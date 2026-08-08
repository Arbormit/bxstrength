import { useState, useEffect } from 'react';

export interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  effectiveType: string;
  rtt: number;
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(() => {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    const conn = typeof navigator !== 'undefined' ? (navigator as any).connection : null;
    const effectiveType = conn?.effectiveType || '4g';
    const rtt = conn?.rtt || 50;
    const isSlow = !isOnline || effectiveType === '2g' || effectiveType === 'slow-2g' || effectiveType === '3g' || rtt > 300;

    return {
      isOnline,
      isSlowConnection: isSlow,
      effectiveType,
      rtt
    };
  });

  useEffect(() => {
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine;
      const conn = (navigator as any).connection;
      const effectiveType = conn?.effectiveType || '4g';
      const rtt = conn?.rtt || 50;
      const isSlow = !isOnline || effectiveType === '2g' || effectiveType === 'slow-2g' || effectiveType === '3g' || rtt > 300;

      setStatus({
        isOnline,
        isSlowConnection: isSlow,
        effectiveType,
        rtt
      });
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    const conn = (navigator as any).connection;
    if (conn) {
      conn.addEventListener('change', updateOnlineStatus);
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      if (conn) {
        conn.removeEventListener('change', updateOnlineStatus);
      }
    };
  }, []);

  return status;
}
