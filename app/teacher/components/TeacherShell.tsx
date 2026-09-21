'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import type { ProfileResponse } from '@/services/user';
import Button from '@/components/ui/Button';
import AppHeader from '@/components/layout/AppHeader';
import dashboardStyles from '../../(main)/dashboard/page.module.css';
import styles from '../page.module.css';

type TeacherNavKey = 'overview' | 'courses' | 'questions' | 'exams';

interface TeacherShellProps {
  profile: ProfileResponse | null;
  activeNav: TeacherNavKey;
  title: string;
  subtitle: string;
  onLogoutAction: () => void;
  onRefreshAction?: () => void;
  notice?: string;
  error?: string;
  children: ReactNode;
  rightSidebar?: ReactNode;
}

const teacherNavItems = [
  { key: 'overview' as TeacherNavKey, label: 'Tổng quan', href: '/teacher' },
  { key: 'courses' as TeacherNavKey, label: 'Khóa học', href: '/teacher/courses' },
  { key: 'questions' as TeacherNavKey, label: 'Ngân hàng câu hỏi', href: '/teacher/questions' },
  { key: 'exams' as TeacherNavKey, label: 'Bài thi', href: '/teacher/exams' },
];

export default function TeacherShell({
  profile,
  activeNav,
  title,
  subtitle,
  onLogoutAction,
  onRefreshAction,
  notice,
  error,
  children,
  rightSidebar,
}: TeacherShellProps) {
  return (
    <div className={dashboardStyles.container}>
      {/* Universal Floating Liquid Glass Header */}
      <AppHeader />

      <main className={dashboardStyles.main}>
        {/* Teacher Context Header & Pill Navigation */}
        <header className={styles.teacherHeader}>
          <div className={styles.headerTop}>
            <div className={styles.titleArea}>
              <span className={styles.teacherBadge}>Khu vực Giảng viên</span>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>

            {onRefreshAction && (
              <Button
                variant="secondary"
                size="sm"
                type="button"
                className={styles.refreshBtn}
                onClick={onRefreshAction}
              >
                Làm mới
              </Button>
            )}
          </div>

          {/* Context Nav Pills */}
          <nav className={styles.navPills} aria-label="Điều hướng Giảng viên">
            {teacherNavItems.map((item) => {
              const isActive = activeNav === item.key;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`${styles.navPill} ${isActive ? styles.navPillActive : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        {error && <p className={styles.error}>{error}</p>}
        {notice && <p className={styles.notice}>{notice}</p>}

        {/* Content Layout */}
        <div className={rightSidebar ? styles.contentWithSidebar : styles.contentFull}>
          <div className={styles.primaryContent}>{children}</div>
          {rightSidebar && <aside className={styles.sidePanel}>{rightSidebar}</aside>}
        </div>
      </main>
    </div>
  );
}
