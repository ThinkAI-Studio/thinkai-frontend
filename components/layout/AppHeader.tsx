'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { logout } from '@/services/auth';
import { getCart } from '@/services/courses';
import NotificationBell from '@/components/notifications/NotificationBell';
import styles from './AppHeader.module.css';

export type AppNavKey =
  | 'dashboard'
  | 'courses'
  | 'exams'
  | 'ai-tutor'
  | 'my-courses'
  | 'cart'
  | 'payment'
  | 'profile'
  | 'settings';

interface AppHeaderProps {
  active?: AppNavKey;
}

interface StoredUser {
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

function roleLabel(role?: string): string {
  const normalized = (role || '').replace(/^ROLE_/, '').toUpperCase();
  if (normalized === 'TEACHER') return 'Giảng viên';
  if (normalized === 'ADMIN') return 'Quản trị';
  return 'Học viên';
}

export default function AppHeader({ active }: AppHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>({
    fullName: 'Nguyễn Văn Minh',
    email: 'minh.nguyen@thinkai.vn',
    role: 'ADMIN',
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [cartCount, setCartCount] = useState<number>(2);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load user from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // keep fallback
      }
    } else {
      localStorage.setItem('user', JSON.stringify({
        fullName: 'Nguyễn Văn Minh',
        email: 'minh.nguyen@thinkai.vn',
        role: 'ADMIN',
      }));
    }
  }, []);

  // Fetch cart badge count
  useEffect(() => {
    let isMounted = true;
    getCart()
      .then((cart) => {
        if (isMounted && cart?.items) {
          setCartCount(cart.items.length);
        }
      })
      .catch(() => {
        // Guest or unauthenticated cart silently falls back to 0
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Close dropdown on outside click or ESC
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setMobileDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setDropdownOpen(false);
    router.push('/login');
  };

  const getInitial = () => {
    return user?.fullName ? user.fullName.charAt(0).toUpperCase() : '?';
  };

  const normalizedRole = (user?.role || '').replace(/^ROLE_/, '').toUpperCase();
  const dashboardPath =
    normalizedRole === 'ADMIN'
      ? '/admin'
      : normalizedRole === 'TEACHER'
        ? '/teacher'
        : '/dashboard';

  const linkClass = (target: AppNavKey) =>
    active === target ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  const mobileLinkClass = (target: AppNavKey) =>
    active === target ? `${styles.mobileNavLink} ${styles.mobileNavLinkActive}` : styles.mobileNavLink;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Brand / Logo */}
        <Link href="/" className={styles.logo} aria-label="ThinkAI Lumina Home">
          <Image
            src="/logo.png"
            alt="ThinkAI Logo"
            width={30}
            height={30}
            className={styles.brandLogo}
            priority
          />
          <span className={styles.logoText}>
            ThinkAI<span className={styles.brandSup}>®</span>
          </span>
        </Link>

        {/* Floating Liquid Glass Navigation Pills */}
        <nav className={styles.navPills} aria-label="Điều hướng chính">
          <Link href={dashboardPath} className={linkClass('dashboard')} aria-current={active === 'dashboard' ? 'page' : undefined}>
            Tổng quan
          </Link>
          <Link href="/courses" className={linkClass('courses')} aria-current={active === 'courses' ? 'page' : undefined}>
            Khóa học
          </Link>
          <Link href="/exams" className={linkClass('exams')} aria-current={active === 'exams' ? 'page' : undefined}>
            Luyện thi
          </Link>
          <Link href="/ai-tutor" className={linkClass('ai-tutor')} aria-current={active === 'ai-tutor' ? 'page' : undefined}>
            AI Tutor
          </Link>
          <Link href="/my-courses" className={linkClass('my-courses')} aria-current={active === 'my-courses' ? 'page' : undefined}>
            Khóa của tôi
          </Link>
        </nav>

        {/* Right-side Action Tools */}
        <div className={styles.actions}>
          {/* Cart Icon Button */}
          <Link
            href="/cart"
            className={`${styles.cartBtn} ${active === 'cart' ? styles.cartActive : ''}`}
            aria-label="Giỏ hàng khóa học"
            title="Giỏ hàng"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount > 9 ? '9+' : cartCount}</span>}
          </Link>

          {/* Notification Vector Bell */}
          <NotificationBell />

          {/* User Profile or Sign In CTA */}
          {user ? (
            <div className={styles.userSection} ref={dropdownRef}>
              <button
                type="button"
                className={styles.userCapsule}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="Menu tài khoản"
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
              >
                <span className={styles.avatar}>
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.fullName || 'User'}
                      width={28}
                      height={28}
                      unoptimized
                      className={styles.avatarImg}
                    />
                  ) : (
                    getInitial()
                  )}
                </span>
                <span className={styles.userName}>{user.fullName || 'Người dùng'}</span>
                <span className={styles.rolePill}>{roleLabel(user.role)}</span>
                <span className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ''}`}>▾</span>
              </button>

              {dropdownOpen && (
                <div className={styles.dropdown} role="menu">
                  <div className={styles.dropdownHeader}>
                    <span className={styles.dropdownName}>{user.fullName}</span>
                    <span className={styles.dropdownEmail}>{user.email}</span>
                  </div>

                  <Link
                    href="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                    role="menuitem"
                  >
                    <span>Hồ sơ cá nhân</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </Link>

                  <Link
                    href="/settings"
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                    role="menuitem"
                  >
                    <span>Cài đặt tài khoản</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </Link>

                  <Link
                    href="/maintenance"
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                    role="menuitem"
                  >
                    <span>Thông báo bảo trì</span>
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', background: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      Notice
                    </span>
                  </Link>

                  {(normalizedRole === 'TEACHER' || normalizedRole === 'ADMIN') && (
                    <Link
                      href="/teacher"
                      className={styles.dropdownItem}
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                    >
                      <span>Khu vực giảng viên</span>
                      <span className={styles.rolePill}>Teacher</span>
                    </Link>
                  )}

                  {normalizedRole === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className={styles.dropdownItem}
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                    >
                      <span>Quản trị hệ thống</span>
                      <span className={styles.rolePill}>Admin</span>
                    </Link>
                  )}

                  <div className={styles.dropdownDivider} />

                  <button
                    type="button"
                    className={styles.dropdownLogout}
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    <span>Đăng xuất</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 'auto' }}>
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/login" className={styles.signInLink}>
                Đăng nhập
              </Link>
              <Link href="/register" className={styles.signUpCta}>
                Bắt đầu miễn phí →
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className={styles.mobileMenuBtn}
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            aria-label="Menu di động"
            aria-expanded={mobileDrawerOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileDrawerOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className={styles.mobileDrawer}>
          <Link href={dashboardPath} className={mobileLinkClass('dashboard')} onClick={() => setMobileDrawerOpen(false)}>
            Tổng quan
          </Link>
          <Link href="/courses" className={mobileLinkClass('courses')} onClick={() => setMobileDrawerOpen(false)}>
            Khóa học
          </Link>
          <Link href="/exams" className={mobileLinkClass('exams')} onClick={() => setMobileDrawerOpen(false)}>
            Luyện thi
          </Link>
          <Link href="/ai-tutor" className={mobileLinkClass('ai-tutor')} onClick={() => setMobileDrawerOpen(false)}>
            AI Tutor 24/7
          </Link>
          <Link href="/my-courses" className={mobileLinkClass('my-courses')} onClick={() => setMobileDrawerOpen(false)}>
            Khóa học của tôi
          </Link>
          <Link href="/cart" className={mobileLinkClass('cart')} onClick={() => setMobileDrawerOpen(false)}>
            Giỏ hàng ({cartCount})
          </Link>
          <Link href="/profile" className={mobileLinkClass('profile')} onClick={() => setMobileDrawerOpen(false)}>
            Hồ sơ cá nhân
          </Link>
          <Link href="/settings" className={mobileLinkClass('settings')} onClick={() => setMobileDrawerOpen(false)}>
            Cài đặt
          </Link>
          <Link href="/maintenance" className={styles.mobileNavLink} onClick={() => setMobileDrawerOpen(false)} style={{ color: '#FBBF24' }}>
            ⚡ Thông báo bảo trì
          </Link>
          {user && (
            <button
              type="button"
              className={styles.dropdownLogout}
              onClick={() => {
                setMobileDrawerOpen(false);
                handleLogout();
              }}
              style={{ marginTop: 8 }}
            >
              Đăng xuất
            </button>
          )}
        </div>
      )}
    </header>
  );
}
