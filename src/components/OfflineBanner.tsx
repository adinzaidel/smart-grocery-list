"use client";

import { useOfflineSync } from '@/hooks/useOfflineSync';

export function OfflineBanner() {
  const { isOffline } = useOfflineSync();

  if (!isOffline) return null;

  return (
    <div
      style={{
        backgroundColor: '#f97316',
        color: 'white',
        textAlign: 'center',
        padding: '8px',
        fontSize: '0.875rem',
        fontWeight: 600,
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
      }}
    >
      Offline mode — syncing when reconnected
    </div>
  );
}