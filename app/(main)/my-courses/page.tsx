'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dashboardStyles from '../dashboard/page.module.css';
import MainSidebar from '../components/MainSidebar';
import styles from './page.module.css';
import PageState from '@/components/ui/PageState';
import { formatVnd } from '@/lib/utils/format';
import { FadeIn } from '@/components/tai/FadeIn';
import { NumberFlow } from '@/components/tai/NumberFlow';
import { StaggerGroup, StaggerItem } from '@/components/tai/StaggerGroup';
import { SkeletonShimmer } from '@/components/tai/SkeletonShimmer';
import { getMyCourses, type MyCourseItem } from '@/services/courses';

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<MyCourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMyCourses();
      setCourses(data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách khóa học.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <div className={dashboardStyles.container}>
      <MainSidebar active="my-courses" />
      <main className={`${dashboardStyles.main} ${styles.main}`}>
        <FadeIn>
          <section className={styles.hero}>
            <h1>Khóa học của tôi</h1>
            <p>Danh sách các khóa học bạn đã đăng ký trên ThinkAI.</p>
          </section>
        </FadeIn>

        <section className={styles.content}>
          {loading && (
            <div className={styles.courseGrid}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={styles.courseCard}>
                  <SkeletonShimmer className={styles.courseImage} />
                  <div className={styles.courseInfo}>
                    <SkeletonShimmer className="h-5 w-3/4 mb-3" />
                    <SkeletonShimmer className="h-2 w-full mb-1" />
                    <SkeletonShimmer className="h-3 w-32 mb-3" />
                    <div className={styles.courseFooter}>
                      <SkeletonShimmer className="h-4 w-24" />
                      <SkeletonShimmer className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <PageState
              type="error"
              message={error}
              actionLabel="Thử lại"
              onAction={loadCourses}
            />
          )}

          {!loading && !error && courses.length === 0 && (
            <PageState
              type="empty"
              message="Bạn chưa đăng ký khóa học nào."
              actionLabel="Khám phá khóa học"
              onAction={() => window.location.href = '/courses'}
            />
          )}

          {!loading && !error && courses.length > 0 && (
            <>
              <StaggerGroup className={styles.statsRow}>
                <StaggerItem className={styles.statCard}>
                  <span className={styles.statNumber}>
                    <NumberFlow value={courses.length} />
                  </span>
                  <span className={styles.statLabel}>Khóa học đã đăng ký</span>
                </StaggerItem>
                <StaggerItem className={styles.statCard}>
                  <span className={styles.statNumber}>
                    <NumberFlow value={courses.filter((c) => c.progressPercent >= 100).length} />
                  </span>
                  <span className={styles.statLabel}>Đã hoàn thành</span>
                </StaggerItem>
                <StaggerItem className={styles.statCard}>
                  <span className={styles.statNumber}>
                    <NumberFlow value={courses.filter((c) => c.progressPercent > 0 && c.progressPercent < 100).length} />
                  </span>
                  <span className={styles.statLabel}>Đang học</span>
                </StaggerItem>
              </StaggerGroup>

              <StaggerGroup className={styles.courseGrid} staggerDelay={0.06}>
                {courses.map((course) => (
                  <StaggerItem key={course.id}>
                    <Link href={`/my-courses/${course.id}`} className={styles.courseCard}>
                      <div className={styles.courseImage}>
                        <span className={styles.progressTag}>
                          {Math.round(course.progressPercent)}%
                        </span>
                      </div>
                      <div className={styles.courseInfo}>
                        <h3>{course.title}</h3>
                        <div className={styles.progressBarWrapper}>
                          <div className={styles.progressBar}>
                            <div
                              className={styles.progressFill}
                              style={{ width: `${Math.min(100, Math.round(course.progressPercent))}%` }}
                            />
                          </div>
                          <span className={styles.progressText}>
                            {Math.round(course.progressPercent)}% hoàn thành
                          </span>
                        </div>
                        <div className={styles.courseFooter}>
                          <span className={styles.price}>{formatVnd(course.price)}</span>
                          {course.nextLesson ? (
                            <span className={styles.nextLesson}>
                              Tiếp: {course.nextLesson.title}
                            </span>
                          ) : (
                            <span className={styles.nextLesson}>
                              {course.progressPercent >= 100 ? '✓ Hoàn thành' : 'Bắt đầu học'}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
