'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export default function CinematicHeroPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on Esc or viewport resize
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={styles.stage}>

      {/* ════════════════════════════════════════
          GLASSMORPHIC NAVIGATION BAR
          ════════════════════════════════════════ */}
      <header className={styles.header}>
        <nav className={styles.nav}>
          {/* Logo with Instrument Serif font */}
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

          {/* Desktop Navigation Links */}
          <div className={styles.navLinks}>
            <Link href="/" className={`${styles.navLink} ${styles.navLinkActive}`}>
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

          {/* Actions: Sign In & Begin Journey CTA */}
          <div className={styles.navActions}>
            <Link href="/login" className={styles.signInLink}>
              Sign In
            </Link>
            <Link
              href="/register"
              className={`${styles.navCta} ${styles.liquidGlass}`}
            >
              Begin Journey
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className={`${styles.burgerBtn} ${styles.liquidGlass}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={mobileOpen}
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Liquid-Glass Drawer */}
        {mobileOpen && (
          <div className={`${styles.mobileSheet} ${styles.liquidGlass}`}>
            <div className={styles.mobileNavLinks}>
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={`${styles.mobileLink} ${styles.mobileLinkActive}`}
              >
                Home
              </Link>
              <Link
                href="/courses"
                onClick={() => setMobileOpen(false)}
                className={styles.mobileLink}
              >
                Courses
              </Link>
              <Link
                href="/exams"
                onClick={() => setMobileOpen(false)}
                className={styles.mobileLink}
              >
                Exams
              </Link>
              <Link
                href="/ai-tutor"
                onClick={() => setMobileOpen(false)}
                className={styles.mobileLink}
              >
                AI Tutor
              </Link>
              <Link
                href="/payment"
                onClick={() => setMobileOpen(false)}
                className={styles.mobileLink}
              >
                Pricing
              </Link>
            </div>

            <div className={styles.mobileActions}>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className={styles.mobileSignIn}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className={`${styles.mobileCta} ${styles.liquidGlass}`}
              >
                Begin Journey
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ════════════════════════════════════════
          HERO SECTION (CINEMATIC TYPOGRAPHY)
          ════════════════════════════════════════ */}
      <main className={styles.hero}>
        {/* Notice Pill for Maintenance */}
        <div className={styles.announcementWrapper}>
          <Link href="/maintenance" className={styles.announcementPill}>
            <span className={styles.announcementDot} />
            <span className={styles.announcementText}>
              <strong>Thông báo:</strong> Website đã dừng hoạt động do định hướng sản phẩm không còn phù hợp.
            </span>
            <span className={styles.announcementArrow}>Chi tiết &rarr;</span>
          </Link>
        </div>

        {/* H1 Heading with Instrument Serif */}
        <h1 className={styles.headline}>
          Where <em className={styles.headlineEm}>dreams</em> rise{' '}
          <em className={styles.headlineEm}>through the silence.</em>
        </h1>

        {/* Subtext */}
        <p className={styles.subtext}>
          We&apos;re designing tools for deep thinkers, bold creators, and quiet
          rebels. Amid the chaos, we build digital spaces for sharp focus and
          inspired work.
        </p>

        {/* Hero CTA Button */}
        <Link
          href="/register"
          className={`${styles.heroCta} ${styles.liquidGlass}`}
        >
          Begin Journey
        </Link>
      </main>

      {/* Footer text */}
      <footer className={styles.footer}>
        <span>ThinkAI Architecture · Designed for Inspired Work</span>
      </footer>
    </div>
  );
}
