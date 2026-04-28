'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, Employee } from '@/services/auth.service';
import { IconChevronLeft, IconLock, IconLogout, IconUser, IconKey, IconEye, IconEyeOff, IconLoader2, IconCircleCheck } from '@tabler/icons-react';
import Swal from 'sweetalert2';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  useEffect(() => {
    const token = authService.getToken();
    const userData = authService.getUserData();

    if (!token) {
      router.push('/');
      return;
    }

    if (userData) {
      setUser(userData);
    }

    // Always fetch fresh data from API to ensure all fields are present
    authService.getProfile(token).then((res) => {
      if (res.success) {
        setUser(res.data);
        authService.setUserData(res.data);
      }
    }).finally(() => {
      setIsLoading(false);
    });
  }, [router]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Keluar Aplikasi?',
      text: "Anda perlu login kembali untuk mengakses data presensi.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1565c0',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'rounded-2xl',
      }
    });

    if (result.isConfirmed) {
      const token = authService.getToken();
      try {
        if (token) await authService.logout(token);
      } finally {
        authService.clearToken();
        router.replace('/');
      }
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.new_password !== formData.new_password_confirmation) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Konfirmasi password baru tidak cocok!',
        customClass: { popup: 'rounded-2xl' }
      });
      return;
    }

    setIsSubmitting(true);
    const token = authService.getToken();
    
    try {
      if (!token) throw new Error('Unauthorized');
      
      const res = await authService.changePassword(token, formData);
      
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Password Anda telah berhasil diperbarui.',
          confirmButtonColor: '#1565c0',
          customClass: { popup: 'rounded-2xl' }
        });
        setFormData({
          old_password: '',
          new_password: '',
          new_password_confirmation: '',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: res.message || 'Gagal mengubah password.',
          customClass: { popup: 'rounded-2xl' }
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Terjadi kesalahan pada server.',
        customClass: { popup: 'rounded-2xl' }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', background: '#f8fafc' }}>
        <IconLoader2 size={24} className="animate-spin" color="#1565c0" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#f8fafc', paddingBottom: '20px' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)', 
        padding: '24px 20px 60px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.back()} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '10px', padding: '8px', color: '#ffffff', cursor: 'pointer' }}>
            <IconChevronLeft size={20} stroke={2.5} />
          </button>
          <h1 style={{ fontSize: '18px', fontWeight: 800 }}>Profil Saya</h1>
        </div>
        <button onClick={handleLogout} style={{ background: 'rgba(239, 68, 68, 0.2)', border: 'none', borderRadius: '10px', padding: '8px 12px', color: '#ffffff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
          <IconLogout size={16} stroke={2.5} />
          Keluar
        </button>
      </div>

      <div style={{ marginTop: '-40px', padding: '0 16px' }}>
        {/* User Card */}
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f1f5f9', border: '4px solid #ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {user?.foto ? (
              <img src={user.foto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <IconUser size={40} color="#94a3b8" />
            )}
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>{user?.nama_karyawan}</h2>
          <p style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '16px' }}>{user?.nik} • {user?.nama_jabatan}</p>
          
          <div style={{ display: 'flex', width: '100%', gap: '12px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>Departemen</p>
              <p style={{ fontSize: '12px', color: '#1e293b', fontWeight: 700 }}>{user?.nama_dept || '-'}</p>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '2px' }}>Lokasi</p>
              <p style={{ fontSize: '12px', color: '#1e293b', fontWeight: 700 }}>{user?.nama_cabang || '-'}</p>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
              <IconLock size={20} stroke={2} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>Ubah Password</h3>
          </div>

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Old Password */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px', display: 'block' }}>Password Lama</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <IconKey size={18} />
                </div>
                <input
                  type={showPassword.old ? 'text' : 'password'}
                  required
                  value={formData.old_password}
                  onChange={(e) => setFormData({ ...formData, old_password: e.target.value })}
                  placeholder="Masukkan password lama"
                  style={{ width: '100%', padding: '12px 40px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, old: !showPassword.old })}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {showPassword.old ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px', display: 'block' }}>Password Baru</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <IconKey size={18} />
                </div>
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={formData.new_password}
                  onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  style={{ width: '100%', padding: '12px 40px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {showPassword.new ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px', display: 'block' }}>Konfirmasi Password Baru</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <IconCircleCheck size={18} />
                </div>
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  required
                  value={formData.new_password_confirmation}
                  onChange={(e) => setFormData({ ...formData, new_password_confirmation: e.target.value })}
                  placeholder="Ulangi password baru"
                  style={{ width: '100%', padding: '12px 40px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {showPassword.confirm ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: '10px',
                width: '100%',
                padding: '14px',
                background: isSubmitting ? '#94a3b8' : 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(21,101,192,0.25)',
                transition: 'all 0.2s'
              }}
            >
              {isSubmitting ? <IconLoader2 size={20} className="animate-spin" /> : <IconLock size={20} />}
              {isSubmitting ? 'Menyimpan...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
