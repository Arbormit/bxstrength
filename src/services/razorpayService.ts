import { getApiUrl } from './api';

export interface RazorpayOrderResponse {
  success: boolean;
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  receipt?: string;
  error?: string;
}

export interface RazorpayVerificationResponse {
  success: boolean;
  message: string;
  order_id?: string;
  payment_id?: string;
  error?: string;
}

export interface RazorpayCheckoutOptions {
  amount: number; // e.g. 50 for £50 (will be converted to smallest unit >= 100)
  currency?: string;
  name?: string;
  description?: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  notes?: Record<string, any>;
  onSuccess: (result: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  onFailure?: (error: any) => void;
  onDismiss?: () => void;
}

/**
 * Dynamically loads the Razorpay Standard Checkout Script
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * STEP 1: Calls backend API /api/create-order to generate Razorpay Order
 */
export const createRazorpayOrder = async (
  amount: number,
  currency: string = 'GBP',
  receipt?: string,
  notes?: any
): Promise<RazorpayOrderResponse> => {
  const response = await fetch(getApiUrl('/api/create-order'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency, receipt, notes })
  });

  const data = await response.json();
  if (!response.ok || !data.order_id) {
    throw new Error(data.error || data.details || 'Failed to create Razorpay order');
  }

  return data;
};

/**
 * STEP 3: Calls backend API /api/verify-payment to verify HMAC-SHA256 signature
 */
export const verifyRazorpayPayment = async (payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  [key: string]: any;
}): Promise<RazorpayVerificationResponse> => {
  const response = await fetch(getApiUrl('/api/verify-payment'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || data.message || 'Razorpay payment signature verification failed');
  }

  return data;
};

/**
 * STEP 2: Main Frontend Razorpay Standard Web Checkout Handler
 */
export const openRazorpayCheckout = async (options: RazorpayCheckoutOptions): Promise<void> => {
  try {
    // 1. Ensure Razorpay checkout script is loaded
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
    }

    // 2. Create order on backend
    const orderData = await createRazorpayOrder(
      options.amount,
      options.currency || 'GBP',
      `rcpt_${Date.now()}`,
      options.notes
    );

    const keyId =
      import.meta.env.VITE_RAZORPAY_KEY_ID ||
      orderData.key_id;

    // 3. Configure Razorpay Standard Modal Options
    const razorpayOptions = {
      key: keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: options.name || 'BxStrength Performance',
      description: options.description || '1-on-1 Fitness & Performance Protocol',
      order_id: orderData.order_id,
      image: '/favicon.svg',
      prefill: {
        name: options.userName || '',
        email: options.userEmail || '',
        contact: options.userPhone || ''
      },
      notes: options.notes || {},
      theme: {
        color: '#CCFF00',
        backdrop_color: 'rgba(10, 10, 12, 0.9)'
      },
      handler: async function (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) {
        try {
          // Verify payment signature on backend
          await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          // Execute success callback
          options.onSuccess(response);
        } catch (verifyErr: any) {
          if (options.onFailure) {
            options.onFailure(verifyErr);
          } else {
            alert(`Payment Verification Error: ${verifyErr.message}`);
          }
        }
      },
      modal: {
        ondismiss: function () {
          if (options.onDismiss) {
            options.onDismiss();
          }
        }
      }
    };

    // 4. Instantiate and open Razorpay Payment Modal
    const rzp = new (window as any).Razorpay(razorpayOptions);

    rzp.on('payment.failed', function (response: any) {
      const errorMsg = response.error?.description || response.error?.reason || 'Payment failed';
      if (options.onFailure) {
        options.onFailure(new Error(errorMsg));
      } else {
        alert(`Razorpay Payment Failed: ${errorMsg}`);
      }
    });

    rzp.open();
  } catch (err: any) {
    if (options.onFailure) {
      options.onFailure(err);
    } else {
      alert(`Razorpay Checkout Error: ${err.message}`);
    }
  }
};
