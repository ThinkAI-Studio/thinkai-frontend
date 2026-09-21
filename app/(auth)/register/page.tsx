'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../login/page.module.css';
import Button from '@/components/ui/Button';
import PageState from '@/components/ui/PageState';
import { ApiException } from '@/services/api';
import { register, googleLogin } from '@/services/auth';

function getRedirectPathByRole(role?: string): string {
  const normalizedRole = (role || '').replace(/^ROLE_/, '').toUpperCase();
  if (normalizedRole === 'ADMIN') return '/admin';
  if (normalizedRole === 'TEACHER') return '/teacher';
  return '/dashboard';
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT' as 'STUDENT' | 'TEACHER',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [globalSuccess, setGlobalSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get('role')?.toUpperCase();
    if (roleParam === 'STUDENT' || roleParam === 'TEACHER') {
      setFormData(prev => ({ ...prev, role: roleParam as 'STUDENT' | 'TEACHER' }));
    }
  }, [searchParams]);

  useEffect(() => {
    const initGoogle = () => {
      if (!(window as any).google || !googleBtnRef.current) return;

      (window as any).google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          setLoading(true);
          setGlobalError('');
          setGlobalSuccess('');
          try {
            const auth = await googleLogin(response.credential);
            if (auth.token) {
              router.push(getRedirectPathByRole(auth.role));
              return;
            }
            setGlobalSuccess('Đăng ký thành công. Tài khoản đang chờ admin duyệt trước khi đăng nhập.');
            setTimeout(() => {
              router.push('/login');
            }, 2000);
          } catch (err: any) {
            console.error('Google register error:', err);
            setGlobalError(err.message || 'Đăng ký Google thất bại');
          } finally {
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
      }, 500);
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
    if (globalSuccess) setGlobalSuccess('');
  };

  const handleRoleSelect = (role: 'STUDENT' | 'TEACHER') => {
    setFormData(prev => ({ ...prev, role }));
    if (globalError) setGlobalError('');
    if (globalSuccess) setGlobalSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGlobalError('');
    setGlobalSuccess('');

    if (!agreeTerms) {
      setGlobalError('Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật.');
      return;
    }

    setLoading(true);

    try {
      const auth = await register(formData);
      if (auth.token) {
        router.push(getRedirectPathByRole(auth.role));
        return;
      }
      setGlobalSuccess('Đăng ký thành công. Tài khoản đang chờ admin duyệt trước khi đăng nhập.');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
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
            href="/login"
            className={styles.navCta}
          >
            Đăng nhập
          </Link>
        </nav>
      </header>

      {/* 2. Center Pill Interaction Console */}
      <main className={styles.hero}>
        <h1 className={styles.headline}>Tạo tài khoản</h1>

        <p className={styles.subhead}>
          Tạo tài khoản để trải nghiệm học tập và luyện thi thông minh cùng AI.
        </p>

        <div className={styles.authCard}>
          {globalError && <div className={styles.errorAlert}>{globalError}</div>}
          {globalSuccess && <div className={styles.successAlert}>{globalSuccess}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Role switcher pills */}
            <div className={styles.roleSelection}>
              <button
                type="button"
                className={`${styles.rolePill} ${formData.role === 'STUDENT' ? styles.rolePillActive : ''}`}
                onClick={() => handleRoleSelect('STUDENT')}
              >
                Tôi là Học viên
              </button>
              <button
                type="button"
                className={`${styles.rolePill} ${formData.role === 'TEACHER' ? styles.rolePillActive : ''}`}
                onClick={() => handleRoleSelect('TEACHER')}
              >
                Tôi là Giảng viên
              </button>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.pillInputWrap}>
                <label htmlFor="firstName" className={styles.label}>Họ</label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="Nhập họ..."
                  className={`${styles.pillInput} ${errors.firstName ? styles.pillInputError : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                {errors.firstName && <span className={styles.fieldError}>{errors.firstName}</span>}
              </div>

              <div className={styles.pillInputWrap}>
                <label htmlFor="lastName" className={styles.label}>Tên</label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Nhập tên..."
                  className={`${styles.pillInput} ${errors.lastName ? styles.pillInputError : ''}`}
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                {errors.lastName && <span className={styles.fieldError}>{errors.lastName}</span>}
              </div>
            </div>

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

            <div className={styles.inputRow}>
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
                {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
              </div>

              <div className={styles.pillInputWrap}>
                <label htmlFor="confirmPassword" className={styles.label}>Xác nhận</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Xác nhận mật khẩu..."
                  className={`${styles.pillInput} ${errors.confirmPassword ? styles.pillInputError : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className={styles.checkboxWrap}>
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => { setAgreeTerms(e.target.checked); if (globalError) setGlobalError(''); }}
              />
              <label htmlFor="terms">
                Tôi đồng ý với <Link href="/terms" className={styles.termsLink}>Điều khoản</Link> & <Link href="/privacy" className={styles.termsLink}>Bảo mật</Link>
              </label>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản →'}
            </button>
          </form>

          <div className={styles.divider}>
            <span>hoặc</span>
          </div>

          <div className={styles.googleWrap}>
            <div ref={googleBtnRef} style={{ minHeight: '44px', width: '100%' }} />
          </div>

          <p className={styles.switchText}>
            Đã có tài khoản?{' '}
            <Link href="/login" className={styles.switchLink}>
              Đăng nhập
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={(
        <div className={styles.stage}>
          <PageState type="loading" message="Đang tải trang đăng ký..." />
        </div>
      )}
    >
      <RegisterForm />
    </Suspense>
  );
}
