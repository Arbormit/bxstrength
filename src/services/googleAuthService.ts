// Google Identity Services (GSI) Helper

const metaEnv = (import.meta as any).env || {};
export const GOOGLE_CLIENT_ID = metaEnv.VITE_GOOGLE_CLIENT_ID || metaEnv.GOOGLE_CLIENT_ID || '';

export interface GoogleUserProfile {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

// Decode Google JWT Credential Token
export const decodeGoogleJwt = (token: string): GoogleUserProfile | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    return {
      email: parsed.email,
      name: parsed.name || parsed.email.split('@')[0],
      picture: parsed.picture,
      sub: parsed.sub
    };
  } catch (e) {
    console.error('Failed to decode Google JWT token:', e);
    return null;
  }
};

// Initialize Google GIS script
export const loadGoogleGsiScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).google?.accounts?.id) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
};
