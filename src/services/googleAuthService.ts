// Google Identity Services (GSI) Helper

const metaEnv = (import.meta as any).env || {};
export const GOOGLE_CLIENT_ID = metaEnv.VITE_GOOGLE_CLIENT_ID || metaEnv.GOOGLE_CLIENT_ID || '171654929533-cdbccjk0peqhhpsqjckhhio2l1l4485n.apps.googleusercontent.com';

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
    if ((window as any).google?.accounts) {
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

// Prompt user to select their Google Gmail account via OAuth 2.0 Popup or GIS prompt
export const promptGoogleAccountSelect = (): Promise<GoogleUserProfile | null> => {
  return new Promise((resolve) => {
    if (!GOOGLE_CLIENT_ID || !(window as any).google?.accounts) {
      resolve(null);
      return;
    }

    try {
      // 1. Try Google OAuth2 Token Client Popup (allows user to select their Gmail account)
      if ((window as any).google.accounts.oauth2) {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: async (response: any) => {
            if (response.error || !response.access_token) {
              console.warn('Google OAuth response notice:', response);
              resolve(null);
              return;
            }
            try {
              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${response.access_token}` }
              });
              if (userInfoRes.ok) {
                const info = await userInfoRes.json();
                resolve({
                  email: info.email,
                  name: info.name || info.email.split('@')[0],
                  picture: info.picture,
                  sub: info.sub
                });
                return;
              }
            } catch (err) {
              console.warn('Failed fetching Google userinfo:', err);
            }
            resolve(null);
          }
        });

        client.requestAccessToken({ prompt: 'select_account' });
        return;
      }

      // 2. Fallback to Google ID Prompt
      if ((window as any).google.accounts.id) {
        (window as any).google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          auto_select: false,
          callback: (response: any) => {
            if (response.credential) {
              const profile = decodeGoogleJwt(response.credential);
              resolve(profile);
            } else {
              resolve(null);
            }
          }
        });
        (window as any).google.accounts.id.prompt();
        return;
      }
    } catch (err) {
      console.warn('Error in promptGoogleAccountSelect:', err);
    }
    resolve(null);
  });
};

