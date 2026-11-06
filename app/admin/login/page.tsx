'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useArchive } from '@/context/ArchiveContext';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';

export default function AdminLoginPage() {
  const { isAuthenticated } = useArchive();
  const router = useRouter();

  // If already authenticated, redirect to /admin
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  return (
    <AdminAuthGuard>
      <div className="text-center py-12">
        <span className="text-xs text-gold">Authenticated. Redirecting to Curatorial Dashboard...</span>
      </div>
    </AdminAuthGuard>
  );
}
