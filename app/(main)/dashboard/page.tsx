'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import Button from '@/components/ui/Button';
import PageState from '@/components/ui/PageState';
import { getProfile, type ProfileResponse } from '@/services/user';
import { getDashboard, type DashboardData } from '@/services/dashboard';
import { ApiException } from '@/services/api';
import MainSidebar from '../components/MainSidebar';
import { FadeIn } from '@/components/tai/FadeIn';
import { NumberFlow } from '@/components/tai/NumberFlow';
import { StaggerGroup, StaggerItem } from '@/components/tai/StaggerGroup';
import { SkeletonShimmer } from '@/components/tai/SkeletonShimmer';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const profileData = await getProfile();
      setProfile(profileData);

      const dashboardData = await getDashboard();
      setDashboard(dashboardData);
    } catch (err: any) {
      const dashboardData = await getDashboard();
      setDashboard(dashboardData);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const getFirstName = () => {
    return profile?.fullName ? profile.fullName.split(' ')[0] : 'bạn';
  };

  const completedLessons = dashboard?.enrolledCourses.reduce(
    (sum, course) => sum + course.completedLessons,
    0
  ) || 0;

  const nextLessonHref = dashboard?.nextLesson
    ? `/learn/${dashboard.nextLesson.lessonId}`
    : '/courses';

  const firstCourse = dashboard?.enrolledCourses[0];

  const { currentMonthName, currentDay, weekDays } = useMemo(() => {
    const now = new Date();
    const month = `Tháng ${now.getMonth() + 1}`;
    const day = now.getDate();
    const dayOfWeek = (now.getDay() + 6) % 7;
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - dayOfWeek + i);
      return {
        date: d.getDate(),
        isToday: i === dayOfWeek,
      };
    });
    return { currentMonthName: month, currentDay: day, weekDays: days };
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <MainSidebar active="dashboard" />
        <main className={styles.main}>
          <div className={styles.header}>
            <SkeletonShimmer className="h-8 w-64 mb-2" />
            <SkeletonShimmer className="h-4 w-96" />
          </div>
          <div className={styles.statsGrid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.statCard}>
                <SkeletonShimmer className="h-5 w-12 mb-3" />
                <SkeletonShimmer className="h-8 w-16 mb-2" />
                <SkeletonShimmer className="h-3 w-24" />
              </div>
            ))}
          </div>
          <section className={styles.section}>
            <SkeletonShimmer className="h-64 w-full rounded-lg" />
          </section>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <MainSidebar active="dashboard" />
        <main className={styles.main}>
          <header className={styles.welcomeBanner}>
            <div className={styles.welcomeText}>
              <h1>Chào mừng quay lại, {getFirstName()}!</h1>
              <p>Theo dõi tiến độ và tiếp tục bài học tiếp theo của bạn.</p>
            </div>
          </header>
          <PageState
            type="error"
            message={error}
            actionLabel="Thử lại"
            onAction={loadDashboard}
          />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <MainSidebar active="dashboard" />

      {/* Main Content */}
      <main className={styles.main}>
        {/* Header */}
        <FadeIn>
          <header className={styles.header}>
            <div className={styles.greeting}>
              <h1>
                {dashboard?.greeting || (
                  <>Chào mừng quay lại, <em>{getFirstName()}!</em></>
                )}
              </h1>
              <p>Theo dõi tiến độ và tiếp tục bài học tiếp theo của bạn.</p>
            </div>
          </header>
        </FadeIn>

        {/* Stats Cards */}
        <StaggerGroup className={styles.statsGrid}>
          <StaggerItem>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>Khóa</div>
              <div className={styles.statValue}>
                <NumberFlow value={dashboard?.totalEnrolledCourses || 0} />
              </div>
              <div className={styles.statLabel}>KHÓA HỌC</div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>Tiến độ</div>
              <div className={styles.statValue}>
                <NumberFlow value={Math.round(dashboard?.averageProgress || 0)} formatOptions={{ style: 'percent' }} />%
              </div>
              <div className={styles.statLabel}>TIẾN ĐỘ</div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>Bài học</div>
              <div className={styles.statValue}>
                <NumberFlow value={completedLessons} />
              </div>
              <div className={styles.statLabel}>BÀI ĐÃ HOÀN THÀNH</div>
            </div>
          </StaggerItem>
        </StaggerGroup>

        {/* Bento Body Grid */}
        <div className={styles.bentoBody}>
          <div className={styles.bentoMain}>
            {/* Continue Learning */}
            <FadeIn delay={0.3}>
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2>Tiếp tục học</h2>
                  <Link href="/courses" className={styles.viewAll}>Xem tất cả →</Link>
                </div>
                
                {firstCourse ? (
                  <div className={styles.courseCard}>
                    <div className={styles.courseImage}>
                      <span>&lt; / &gt;</span>
                    </div>
                    <div className={styles.courseInfo}>
                      <div className={styles.courseMeta}>
                        <span className={styles.courseTag}>ĐANG HỌC</span>
                        <span className={styles.courseTime}>
                          {firstCourse.completedLessons}/{firstCourse.totalLessons} bài
                        </span>
                      </div>
                      <h3>{firstCourse.title}</h3>
                      <p>Tiếp tục bài học để hoàn thành tiến độ của khóa học.</p>
                      <div className={styles.progressSection}>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${Math.round(firstCourse.progressPercent || 0)}%` }}
                          />
                        </div>
                        <span className={styles.progressText}>
                          {Math.round(firstCourse.progressPercent || 0)}%
                        </span>
                      </div>
                    </div>
                    <Link href={nextLessonHref}>
                      <Button variant="primary">Tiếp tục →</Button>
                    </Link>
                  </div>
                ) : (
                  <div className={styles.courseCard}>
                    <div className={styles.courseInfo}>
                      <h3>Bạn chưa đăng ký khóa học nào</h3>
                      <p>Khám phá các khóa học để bắt đầu hành trình học tập.</p>
                    </div>
                    <Link href="/courses">
                      <Button variant="primary">Khám phá khóa học →</Button>
                    </Link>
                  </div>
                )}
              </section>
            </FadeIn>

            {/* Bottom Grid */}
            <div className={styles.bottomGrid}>
              <div className={styles.suggestionCard}>
                <h3>Gợi ý học tập</h3>
                <div className={styles.suggestion}>
                  <span className={styles.suggestionIcon}>Gợi ý</span>
                  <div>
                    <p className={styles.suggestionTitle}>Bài học tiếp theo</p>
                    <p className={styles.suggestionDesc}>
                      {dashboard?.nextLesson
                        ? `${dashboard.nextLesson.lessonTitle} (${dashboard.nextLesson.courseTitle})`
                        : 'Bạn đã hoàn thành các bài đang theo học. Tiếp tục học khóa mới.'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={styles.discussionCard}>
                <h3>Tiến độ trung bình</h3>
                <div className={styles.discussion}>
                  <span className={styles.discussionIcon}>Tiến độ</span>
                  <div>
                    <p className={styles.discussionTitle}>
                      {Math.round(dashboard?.averageProgress || 0)}% hoàn thành
                    </p>
                    <p className={styles.discussionDesc}>
                      Duy trì đều đặn để hoàn thành mục tiêu học tập tuần này.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Telemetry & Schedule Bento Panel */}
          <aside className={styles.telemetryPanel}>
            <div className={styles.lessonList}>
              <h3>Khóa học đã đăng ký</h3>
              <p className={styles.lessonCourse}>Theo dõi nhanh tiến độ</p>
              
              <div className={styles.chapters}>
                {(dashboard?.enrolledCourses || []).slice(0, 5).map((course) => (
                  <div
                    key={course.courseId}
                    className={`${styles.chapter} ${course.progressPercent >= 100 ? styles.completed : styles.current}`}
                  >
                    <span className={styles.chapterCheck}>
                      {course.progressPercent >= 100 ? '✓' : '○'}
                    </span>
                    <div>
                      <p className={styles.chapterNumber}>KHÓA HỌC #{course.courseId}</p>
                      <p className={styles.chapterTitle}>{course.title}</p>
                      <p className={styles.chapterMeta}>
                        {course.completedLessons}/{course.totalLessons} bài • {Math.round(course.progressPercent)}%
                      </p>
                    </div>
                  </div>
                ))}
                {!dashboard?.enrolledCourses.length && (
                  <div className={styles.chapter}>
                    <span className={styles.chapterLock}>○</span>
                    <div>
                      <p className={styles.chapterTitle}>Chưa có dữ liệu khóa học</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Calendar */}
            <div className={styles.calendar}>
              <div className={styles.calendarHeader}>
                <h4>{currentMonthName}</h4>
                <Link href="/my-courses" className={styles.viewCalendar}>Tiến độ tuần</Link>
              </div>
              <div className={styles.calendarGrid}>
                <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
                {weekDays.map((item, idx) => (
                  <span key={idx} className={item.isToday ? styles.today : undefined}>
                    {item.date}
                  </span>
                ))}
              </div>
              <div className={styles.calendarLegend}>
                <span>● Hôm nay: Ngày {currentDay}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
