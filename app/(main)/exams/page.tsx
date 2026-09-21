'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import dashboardStyles from '../dashboard/page.module.css';
import MainSidebar from '../components/MainSidebar';
import styles from './page.module.css';
import PageState from '@/components/ui/PageState';
import { formatDateTimeVi } from '@/lib/utils/format';
import { FadeIn } from '@/components/tai/FadeIn';
import { StaggerGroup, StaggerItem } from '@/components/tai/StaggerGroup';
import { SkeletonShimmer } from '@/components/tai/SkeletonShimmer';
import { getMyCourses, type MyCourseItem } from '@/services/courses';
import {
  getCourseExams,
  getExamHistory,
  type ExamHistoryItem,
  type ExamSummary,
} from '@/services/exams';

export default function ExamsPage() {
  const [courses, setCourses] = useState<MyCourseItem[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [history, setHistory] = useState<ExamHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [myCourses, examHistory] = await Promise.all([
        getMyCourses(),
        getExamHistory().catch(() => []),
      ]);
      setCourses(myCourses);
      setHistory(examHistory);

      if (myCourses.length > 0) {
        const firstCourseId = myCourses[0].id;
        setSelectedCourseId(firstCourseId);
        const examList = await getCourseExams(firstCourseId);
        setExams(examList);
      } else {
        setSelectedCourseId(null);
        setExams([]);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách bài thi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleCourseChange = async (courseId: number) => {
    setSelectedCourseId(courseId);
    setLoading(true);
    setError('');
    try {
      const examList = await getCourseExams(courseId);
      setExams(examList);
    } catch (err: any) {
      setError(err.message || 'Không thể tải bài thi của khóa học này.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={dashboardStyles.container}>
      <MainSidebar active="exams" />
      <main className={`${dashboardStyles.main} ${styles.main}`}>
        <FadeIn>
          <section className={styles.header}>
            <h1>Danh sách bài thi</h1>
            <p>Chọn khóa học đã đăng ký để làm bài thi theo lộ trình.</p>
          </section>
        </FadeIn>

        {error && (
          <PageState
            type="error"
            message={error}
            actionLabel="Tải lại dữ liệu"
            onAction={loadInitialData}
          />
        )}

        {courses.length > 0 ? (
          <FadeIn delay={0.1}>
            <section className={styles.courseSelector}>
              <span className={styles.courseLabel}>Khóa học:</span>
              <div className={styles.coursePills} role="tablist" aria-label="Danh sách khóa học">
                {courses.map((course) => {
                  const isSelected = selectedCourseId === course.id;
                  return (
                    <button
                      key={course.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      className={`${styles.coursePill} ${isSelected ? styles.coursePillActive : ''}`}
                      onClick={() => handleCourseChange(course.id)}
                    >
                      {course.title}
                    </button>
                  );
                })}
              </div>
            </section>
          </FadeIn>
        ) : (
          !loading && (
            <section className={styles.empty}>
              <p>Bạn chưa có khóa học đã đăng ký. Hãy đăng ký khóa học trước khi làm bài thi.</p>
              <Link href="/courses" className={styles.linkBtn}>Đi tới danh sách khóa học</Link>
            </section>
          )
        )}

        <FadeIn delay={0.2}>
          <section className={styles.grid}>
            <div className={styles.card}>
              <h2>Bài thi khả dụng</h2>
              {loading ? (
                <div className={styles.list}>
                  {[1, 2, 3].map((i) => (
                    <li key={i} className={styles.item}>
                      <div style={{ flex: 1 }}>
                        <SkeletonShimmer className="h-5 w-48 mb-2" />
                        <SkeletonShimmer className="h-4 w-64 mb-1" />
                        <SkeletonShimmer className="h-3 w-32" />
                      </div>
                    </li>
                  ))}
                </div>
              ) : exams.length === 0 ? (
                <PageState type="empty" message="Chưa có bài thi cho khóa học này." />
              ) : (
                <StaggerGroup className={styles.list} as="ul" staggerDelay={0.05}>
                  {exams.map((exam) => (
                    <StaggerItem key={exam.id} as="li" className={styles.item}>
                      <div>
                        <h3>{exam.title}</h3>
                        <p>{exam.description || 'Bài thi luyện tập'}</p>
                        <small>
                          {exam.timeLimitMinutes} phút
                          {typeof exam.passingScore === 'number' ? ` • Qua môn: ${exam.passingScore}` : ''}
                        </small>
                      </div>
                      <Link href={`/exams/${exam.id}`} className={styles.linkBtn}>
                        Bắt đầu
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              )}
            </div>

            <div className={styles.card}>
              <h2>Lịch sử làm bài</h2>
              {history.length === 0 ? (
                <PageState type="empty" message="Chưa có lịch sử làm bài." />
              ) : (
                <StaggerGroup className={styles.list} as="ul" staggerDelay={0.04}>
                  {history.slice(0, 8).map((item) => (
                    <StaggerItem key={item.attemptId} as="li">
                      <Link
                        href={`/exams/${item.examId}/result?attemptId=${item.attemptId}`}
                        className={styles.historyItem}
                      >
                        <div>
                          <h3>{item.examTitle}</h3>
                          <small>{formatDateTimeVi(item.submittedAt)}</small>
                        </div>
                        <span className={styles.score}>{item.score}</span>
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              )}
            </div>
          </section>
        </FadeIn>
      </main>
    </div>
  );
}
