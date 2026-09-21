'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../login/page.module.css';
import { resetPassword } from '@/services/auth';
import { ApiException } from '@/services/api';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => { const n = { ...prev }; delete n[id]; return n; });
    }
    if (globalError) setGlobalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGlobalError('');
    setLoading(true);

    try {
      const result = await resetPassword(token, formData.newPassword, formData.confirmPassword);
      setSuccess(result.message);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      if (err instanceof ApiException) {
        if (err.fieldErrors) {
          setErrors(err.fieldErrors);
        } else {
          setGlobalError(err.message);
        }
      } else {
        setGlobalError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.stage}>

      {/* 1. Header */}
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo} aria-label="ThinkAI Home">
            <Image
              src="/logo.png"
              alt="ThinkAI Logo"
              width={32}
              height={32}
              className={styles.logoImg}
              priority
            />
            <span className={styles.logoText}>
              <span>ThinkAI</span>
              <sup className={styles.logoSup}>®</sup>
            </span>
          </Link>

          <div className={styles.navLinks}>
            <Link href="/" className={styles.navLink}>Home</Link>
            <Link href="/courses" className={styles.navLink}>Courses</Link>
            <Link href="/exams" className={styles.navLink}>Exams</Link>
            <Link href="/ai-tutor" className={styles.navLink}>AI Tutor</Link>
            <Link href="/payment" className={styles.navLink}>Pricing</Link>
          </div>

          <Link href="/login" className={`${styles.navCta} ${styles.liquidGlass}`}>
            Đăng nhập
          </Link>
        </nav>
      </header>

      {/* 2. Center Console */}
      <main className={styles.hero}>
        <div className={styles.trustPill}>
          <span>SECURITY CREDENTIAL UPDATE</span>
        </div>

        <h1 className={styles.headline}>New Password</h1>

        <p className={styles.subhead}>
          Nhập mật khẩu mới an toàn cho tài khoản ThinkAI của bạn.
        </p>

        <div className={`${styles.authCard} ${styles.liquidGlass}`}>
          {!token ? (
            <div style={{ textAlign: 'center' }}>
              <div className={styles.errorAlert}>
                Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
              </div>
              <Link href="/forgot-password" className={styles.submitBtn} style={{ textDecoration: 'none', marginTop: 16 }}>
                Yêu cầu link mới →
              </Link>
            </div>
          ) : (
            <>
              {globalError && <div className={styles.errorAlert}>{globalError}</div>}
              {success ? (
                <div style={{ textAlign: 'center' }}>
                  <div className={styles.successAlert}>
                    {success}
                    <p style={{ marginTop: 6, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                      Đang chuyển hướng về trang đăng nhập...
                    </p>
                  </div>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.pillInputWrap}>
                    <input
                      type="password"
                      id="newPassword"
                      placeholder="Mật khẩu mới (tối thiểu 8 ký tự)..."
                      className={`${styles.pillInput} ${errors.newPassword ? styles.pillInputError : ''}`}
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                    />
                    {errors.newPassword && <span className={styles.fieldError}>{errors.newPassword}</span>}
                  </div>

                  <div className={styles.pillInputWrap}>
                    <input
                      type="password"
                      id="confirmPassword"
                      placeholder="Nhập lại mật khẩu mới..."
                      className={`${styles.pillInput} ${errors.confirmPassword ? styles.pillInputError : ''}`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}
                  </div>

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={loading}
                  >
                    {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu →'}
                  </button>
                </form>
              )}
            </>
          )}

          <p className={styles.switchText}>
            <Link href="/login" className={styles.switchLink}>
              ← Quay lại đăng nhập
            </Link>
          </p>
        </div>
      </main>

      {/* 3. Security Metrics Footer */}
      <footer className={styles.footer}>
        <span>• 256-BIT ENCRYPTION</span>
        <span>• ZERO-LATENCY AUTH</span>
        <span>• MULTI-DEVICE SYNC</span>
      </footer>
    </div>
  );
}
