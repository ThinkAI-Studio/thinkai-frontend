'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../login/page.module.css';
import { forgotPassword } from '@/services/auth';
import { ApiException } from '@/services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
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
          <span>SECURITY RECOVERY PORTAL</span>
        </div>

        <h1 className={styles.headline}>Reset Password</h1>

        <p className={styles.subhead}>
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu an toàn.
        </p>

        <div className={`${styles.authCard} ${styles.liquidGlass}`}>
          {error && <div className={styles.errorAlert}>{error}</div>}
          {success ? (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className={styles.successAlert}>
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email <strong>{email}</strong>.
              </div>
              <Link href="/login" className={styles.submitBtn} style={{ textDecoration: 'none' }}>
                Quay lại đăng nhập →
              </Link>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.pillInputWrap}>
                <input
                  type="email"
                  id="email"
                  placeholder="Nhập email của bạn..."
                  className={styles.pillInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Đang gửi yêu cầu...' : 'Gửi liên kết khôi phục →'}
              </button>
            </form>
          )}

          <p className={styles.switchText}>
            Nhớ mật khẩu?{' '}
            <Link href="/login" className={styles.switchLink}>
              Đăng nhập
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
