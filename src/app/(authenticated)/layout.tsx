'use client';

import React, { useEffect } from 'react';
import BottomBar from '@/components/layout/BottomBar';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      router.push('/');
      return;
    }

    // Check session validity periodically or on mount
    const checkAuth = async () => {
      try {
        await authService.getProfile(token);
      } catch (error: any) {
        if (error.message && error.message.includes('401')) {
          authService.clearToken();
          router.push('/');
        }
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="layout-wrapper" style={{ width: '100%', maxWidth: 'none' }}>
      <div className="mobile-container" style={{ width: '100%', maxWidth: 'none', paddingBottom: '80px', background: '#f8fafc' }}>
        <main style={{ flex: 1, width: '100%' }}>
          {children}
        </main>
        <BottomBar />
      </div>
    </div>
  );
}
