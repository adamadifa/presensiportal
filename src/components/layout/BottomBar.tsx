'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { IconHome, IconFingerprint, IconLayoutGrid, IconUser, IconFileText } from '@tabler/icons-react';

export default function BottomBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === '/dashboard';
  const isHistory = pathname === '/history';
  const isAttendance = pathname === '/attendance';
  const isIzin = pathname === '/izin';
  const isProfile = pathname === '/profile';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '8px 0 12px',
        background: '#ffffff',
        borderTop: '1px solid #f3f4f6',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 100,
        boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
      }}
    >
      {/* Beranda */}
      <button
        onClick={() => router.push('/dashboard')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          padding: '4px 4px',
          flex: 1,
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <IconHome size={22} color={isHome ? '#1565c0' : '#9ca3af'} stroke={2.5} />
        <span style={{ fontSize: '10px', fontWeight: 700, color: isHome ? '#1565c0' : '#9ca3af' }}>Beranda</span>
      </button>

      {/* Data Absensi */}
      <button
        onClick={() => router.push('/history')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          padding: '4px 4px',
          flex: 1,
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <IconLayoutGrid size={22} color={isHistory ? '#1565c0' : '#9ca3af'} stroke={2.5} />
        <span style={{ fontSize: '10px', fontWeight: 700, color: isHistory ? '#1565c0' : '#9ca3af' }}>History</span>
      </button>

      {/* Absensi (center button) */}
      <button
        onClick={() => router.push('/attendance')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          padding: '0',
          marginTop: '-28px',
          flex: 1,
          zIndex: 10,
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <div
          className="tech-button-pulse"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1565c0, #0d47a1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #ffffff',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Animated Ring */}
          <div 
            className="tech-ring-rotate"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px dashed rgba(255,255,255,0.3)',
              pointerEvents: 'none'
            }} 
          />
          
          {/* Scanning Line Effect */}
          <div 
            style={{
              position: 'absolute',
              width: '100%',
              height: '2px',
              background: 'rgba(255,255,255,0.5)',
              boxShadow: '0 0 8px rgba(255,255,255,0.8)',
              top: '0',
              left: '0',
              animation: 'scan-line 2s infinite linear',
              pointerEvents: 'none'
            }}
          />

          <IconFingerprint size={26} color="#ffffff" stroke={2.5} style={{ position: 'relative', zIndex: 2 }} />
        </div>
        <span style={{ fontSize: '10px', fontWeight: 700, color: isAttendance ? '#1565c0' : '#4b5563' }}>Absensi</span>
      </button>

      {/* Izin */}
      <button
        onClick={() => router.push('/izin')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          padding: '4px 4px',
          flex: 1,
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <IconFileText size={22} color={isIzin ? '#1565c0' : '#9ca3af'} stroke={2.5} />
        <span style={{ fontSize: '10px', fontWeight: 700, color: isIzin ? '#1565c0' : '#9ca3af' }}>Izin</span>
      </button>

      {/* Profile */}
      <button
        onClick={() => router.push('/profile')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          padding: '4px 4px',
          flex: 1,
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <IconUser size={22} color={isProfile ? '#1565c0' : '#9ca3af'} stroke={2.5} />
        <span style={{ fontSize: '10px', fontWeight: 700, color: isProfile ? '#1565c0' : '#9ca3af' }}>Profil</span>
      </button>
    </div>
  );
}
