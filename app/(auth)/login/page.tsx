'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { login, googleLogin } from '@/services/auth';
import { ApiException } from '@/services/api';

function getRedirectPathByRole(role?: string): string {
  const normalizedRole = (role || '').replace(/^ROLE_/, '').toUpperCase();
  if (normalizedRole === 'ADMIN') return '/admin';
  if (normalizedRole === 'TEACHER') return '/teacher';
  return '/dashboard';
}

export default function LoginPage() {
  const router = useRouter();
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initGoogle = () => {
      if (!(window as any).google || !googleBtnRef.current) return;

      (window as any).google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          setLoading(true);
          setGlobalError('');
          try {
            const auth = await googleLogin(response.credential);
            router.push(getRedirectPathByRole(auth.role));
          } catch (err: any) {
            console.error('Google login error:', err);
            setGlobalError(err.message || 'Đăng nhập Google thất bại');
            setLoading(false);
          }
        },
      });

      (window as any).google.accounts.id.renderButton(googleBtnRef.current, {
        type: 'standard',
        size: 'large',
        width: googleBtnRef.current.offsetWidth || 320,
        theme: 'filled_black',
        shape: 'pill',
      });
    };

    if ((window as any).google) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if ((window as any).google) {
          initGoogle();
          clearInterval(interval);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
    if (globalError) setGlobalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGlobalError('');
    setLoading(true);

    try {
      const auth = await login(formData);
      router.push(getRedirectPathByRole(auth.role));
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
            <Link href="/" className={styles.navLink}>
              Home
            </Link>
            <Link href="/courses" className={styles.navLink}>
              Courses
            </Link>
            <Link href="/exams" className={styles.navLink}>
              Exams
            </Link>
            <Link href="/ai-tutor" className={styles.navLink}>
              AI Tutor
            </Link>
            <Link href="/payment" className={styles.navLink}>
              Pricing
            </Link>
          </div>

          <Link
            href="/register"
            className={styles.navCta}
          >
            Đăng ký
          </Link>
        </nav>
      </header>

      {/* 2. Center Auth Console */}
      <main className={styles.hero}>
        <h1 className={styles.headline}>Đăng nhập</h1>

        <p className={styles.subhead}>
          Tiếp tục lộ trình học tập cùng AI Tutor.
        </p>

        <div className={styles.authCard}>
          {globalError && <div className={styles.errorAlert}>{globalError}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.pillInputWrap}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                placeholder="Nhập địa chỉ email..."
                className={`${styles.pillInput} ${errors.email ? styles.pillInputError : ''}`}
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
            </div>

            <div className={styles.pillInputWrap}>
              <label htmlFor="password" className={styles.label}>Mật khẩu</label>
              <input
                type="password"
                id="password"
                placeholder="Nhập mật khẩu..."
                className={`${styles.pillInput} ${errors.password ? styles.pillInputError : ''}`}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Link href="/forgot-password" className={styles.forgotPillLink}>
                Quên?
              </Link>
              {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Đang xác thực...' : 'Đăng nhập →'}
            </button>
          </form>

          <div className={styles.divider}>
            <span>hoặc</span>
          </div>

          {/* Google Auth Container */}
          <div className={styles.googleWrap}>
            <div ref={googleBtnRef} style={{ minHeight: '44px', width: '100%' }} />
          </div>

          <p className={styles.switchText}>
            Chưa có tài khoản?{' '}
            <Link href="/register" className={styles.switchLink}>
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
