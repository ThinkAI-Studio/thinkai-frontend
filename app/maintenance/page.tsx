'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export default function MaintenanceNoticePage() {
  return (
    <div className={styles.stage}>
      {/* Top Floating Glass Header */}
      <header className={styles.header}>
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

        <Link href="/" className={styles.homeBackLink}>
          <span>←</span>
          <span>Về Trang Chủ</span>
        </Link>
      </header>

      {/* Main Announcement Stage */}
      <main className={styles.main}>
        <div className={styles.noticeCard}>
          {/* Status Badge */}
          <div className={styles.statusBadgeWrapper}>
            <div className={styles.statusBadge}>
              <span className={styles.pulseDot} />
              <span>Thông Báo Dừng Hoạt Động · Service Discontinued</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className={styles.headline}>
            Website Hiện Đang Dừng Hoạt Động <br />
            <em className={styles.headlineEm}>Định hướng sản phẩm đã dừng và không còn phù hợp</em>
          </h1>

          {/* Statement */}
          <p className={styles.statement}>
            Nền tảng ThinkAI hiện đã chính thức dừng hoạt động do định hướng sản phẩm đã dừng và không còn phù hợp với kế hoạch phát triển.
            <br />
            Cảm ơn bạn đã quan tâm và đồng hành cùng dự án trong thời gian qua.
          </p>

          {/* Actions */}
          <div className={styles.actions}>
            <Link href="/" className={styles.primaryAction}>
              <span>Quay Về Trang Chủ</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© ThinkAI Project · All rights reserved.</p>
      </footer>
    </div>
  );
}
