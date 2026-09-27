import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { openRazorpayCheckout } from '../services/razorpayService';
import { detectMarketFromPhone, getMarketConfig, formatMarketPrice } from '../utils/marketService';

interface RazorpayCheckoutButtonProps {
  amount: number;
  planName: string;
  currency?: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  customExercises?: string[];
  serviceType?: string;
  onSuccess: (result: { orderId: string; paymentId: string }) => void;
  onError?: (error: string) => void;
  className?: string;
  buttonText?: string;
}

export const RazorpayCheckoutButton: React.FC<RazorpayCheckoutButtonProps> = ({
  amount,
  planName,
  currency,
  userEmail,
  userName,
  userPhone,
  customExercises,
  serviceType,
  onSuccess,
  onError,
  className,
  buttonText
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeMarketCountry = detectMarketFromPhone(userPhone);
  const marketConfig = getMarketConfig(activeMarketCountry);
  const effectiveCurrency = currency || marketConfig.currency;
  const defaultText = `PAY ${formatMarketPrice(amount, activeMarketCountry)} SECURELY`;
  const displayText = buttonText || defaultText;

  const handlePay = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    await openRazorpayCheckout({
      amount: amount,
      currency: effectiveCurrency,
      country: activeMarketCountry,
      name: 'BxStrength Performance',
      description: `${planName} (${(serviceType || 'Standard').toUpperCase()})`,
      userEmail: userEmail,
      userName: userName,
      userPhone: userPhone,
      notes: {
        planName,
        serviceType: serviceType || 'individual',
        customExercises: customExercises?.join(', ') || 'N/A'
      },
      onSuccess: (result) => {
        setIsLoading(false);
        onSuccess({
          orderId: result.razorpay_order_id,
          paymentId: result.razorpay_payment_id
        });
      },
      onFailure: (err) => {
        setIsLoading(false);
        const msg = err?.message || 'Payment was unsuccessful or cancelled';
        setErrorMsg(msg);
        if (onError) onError(msg);
      },
      onDismiss: () => {
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="w-full space-y-2">
      <button
        type="button"
        onClick={handlePay}
        disabled={isLoading}
        className={
          className ||
          'w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black text-xs sm:text-sm uppercase tracking-wider py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        }
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-black" />
            <span>CONNECTING TO SECURE GATEWAY...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 text-black shrink-0" />
            <span>{displayText}</span>
            <ArrowRight className="w-4 h-4 text-black shrink-0" />
          </>
        )}
      </button>

      {errorMsg && (
        <div className="p-3 bg-red-950/80 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2 font-medium">
          <span>⚠️ {errorMsg}</span>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 font-mono">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>256-Bit SSL Encrypted &amp; PCI DSS Compliant</span>
      </div>
    </div>
  );
};
