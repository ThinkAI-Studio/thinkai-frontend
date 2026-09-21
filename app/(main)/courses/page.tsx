'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dashboardStyles from '../dashboard/page.module.css';
import MainSidebar from '../components/MainSidebar';
import styles from './page.module.css';
import PageState from '@/components/ui/PageState';
import Button from '@/components/ui/Button';
import { formatVnd } from '@/lib/utils/format';
import { FadeIn } from '@/components/tai/FadeIn';
import { StaggerGroup, StaggerItem } from '@/components/tai/StaggerGroup';
import { SkeletonShimmer } from '@/components/tai/SkeletonShimmer';
import {
  getCourses,
  type CourseListItem,
  type CourseListResponse,
} from '@/services/courses';

const sortOptions = [
  { label: 'Mới nhất', sortBy: 'createdAt', sortDir: 'desc' as const },
  { label: 'Giá thấp nhất', sortBy: 'price', sortDir: 'asc' as const },
  { label: 'Giá cao nhất', sortBy: 'price', sortDir: 'desc' as const },
];

const courseCategories = [
  { id: '', label: 'Tất cả' },
  { id: 'TOEIC', label: 'Luyện thi TOEIC' },
  { id: 'IELTS', label: 'Luyện thi IELTS' },
  { id: 'Giao tiếp', label: 'Giao tiếp thực chiến' },
  { id: 'THPT', label: 'Tiếng Anh THPT' },
  { id: 'AI', label: 'AI & Công nghệ' },
];

export default function CoursesPage() {
  const [keywordInput, setKeywordInput] = useState('');
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [pageData, setPageData] = useState<CourseListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState({
    page: 0,
    size: 9,
    keyword: '',
    sortBy: 'createdAt',
    sortDir: 'desc' as 'asc' | 'desc',
  });

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getCourses(query);
        setPageData(data);
        setCourses(data.content);
      } catch (err: any) {
        setError(err.message || 'Không thể tải danh sách khóa học.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [query]);

  const reloadCourses = () => {
    setQuery((prev) => ({ ...prev }));
  };

  const handleSearch = () => {
    setQuery((prev) => ({
      ...prev,
      page: 0,
      keyword: keywordInput.trim(),
    }));
  };

  const handleSortChange = (value: string) => {
    const next = sortOptions[Number(value)] || sortOptions[0];
    setQuery((prev) => ({
      ...prev,
      page: 0,
      sortBy: next.sortBy,
      sortDir: next.sortDir,
    }));
  };

  return (
    <div className={dashboardStyles.container}>
      <MainSidebar active="courses" />
      <main className={`${dashboardStyles.main} ${styles.main}`}>
        <FadeIn>
          <section className={styles.hero}>
            <h1>
              Khóa học trực tuyến
              <br />
              <em>cùng gia sư AI cá nhân hóa</em>
            </h1>
            <p>Lộ trình đào tạo TOEIC, IELTS và kỹ năng chuyên sâu được thiết kế tối ưu theo năng lực của bạn.</p>

            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                className={styles.searchInput}
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button variant="secondary" size="sm" type="button" className={styles.clearBtn} onClick={handleSearch}>
                Tìm
              </Button>
            </div>
          </section>
        </FadeIn>

        <section className={styles.content}>
          <div className={styles.filterPillBar} role="tablist" aria-label="Bộ lọc danh mục">
            {courseCategories.map((cat) => {
              const isSelected = (!query.keyword && cat.id === '') || query.keyword === cat.id;
              return (
                <button
                  key={cat.id || 'all'}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`${styles.filterPill} ${isSelected ? styles.filterPillActive : ''}`}
                  onClick={() => {
                    setKeywordInput(cat.id);
                    setQuery((prev) => ({ ...prev, page: 0, keyword: cat.id }));
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className={styles.courseSection}>
            <div className={styles.courseHeader}>
              <p>
                Hiển thị <strong>{courses.length}</strong> trên{' '}
                <strong>{pageData?.totalElements || 0}</strong> khóa học
              </p>
              <div className={styles.sortBy}>
                <span>Sắp xếp theo:</span>
                <select onChange={(e) => handleSortChange(e.target.value)}>
                  {sortOptions.map((option, idx) => (
                    <option value={idx} key={option.label}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading && (
              <div className={styles.courseGrid}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={styles.courseCard}>
                    <SkeletonShimmer className={styles.courseImage} />
                    <div className={styles.courseInfo}>
                      <SkeletonShimmer className="h-4 w-20 mb-2" />
                      <SkeletonShimmer className="h-5 w-full mb-2" />
                      <SkeletonShimmer className="h-4 w-24 mb-3" />
                      <div className={styles.courseFooter}>
                        <SkeletonShimmer className="h-4 w-32" />
                        <SkeletonShimmer className="h-5 w-20" />
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
                onAction={reloadCourses}
              />
            )}

            {!loading && !error && courses.length > 0 && (
              <StaggerGroup className={styles.courseGrid} staggerDelay={0.06}>
                {courses.map((course) => (
                  <StaggerItem key={course.id}>
                    <Link href={`/courses/${course.id}`} className={styles.courseCard}>
                      <div 
                        className={styles.courseImage} 
                        style={course.thumbnail ? { 
                          backgroundImage: `url(${course.thumbnail})`, 
                          backgroundSize: 'cover', 
                          backgroundPosition: 'center' 
                        } : {}}
                      >
                        <span className={styles.categoryTag}>KHÓA HỌC</span>
                      </div>
                      <div className={styles.courseInfo}>
                        <div className={styles.ratingRow}>
                          <span className={styles.reviews}>Học viên:</span>
                          <span className={styles.rating}>{course.enrolledCount}</span>
                        </div>
                        <h3>{course.title}</h3>
                        <p>{course.lessonsCount} bài học</p>
                        <div className={styles.courseFooter}>
                          <div className={styles.instructor}>
                            <span>{course.instructor?.fullName || 'Đang cập nhật'}</span>
                          </div>
                          <span className={styles.price}>{formatVnd(course.price)}</span>
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            )}

            {!loading && !error && courses.length === 0 && (
              <PageState
                type="empty"
                message="Không tìm thấy khóa học phù hợp với bộ lọc hiện tại."
                actionLabel="Đặt lại bộ lọc"
                onAction={() => {
                  setKeywordInput('');
                  setQuery({
                    page: 0,
                    size: 9,
                    keyword: '',
                    sortBy: 'createdAt',
                    sortDir: 'desc',
                  });
                }}
              />
            )}

            <div className={styles.pagination}>
              <Button
                variant="secondary"
                size="sm"
                type="button"
                className={styles.pageBtn}
                disabled={(pageData?.page || 0) <= 0}
                onClick={() =>
                  setQuery((prev) => ({
                    ...prev,
                    page: Math.max(0, prev.page - 1),
                  }))
                }
              >
                ‹
              </Button>
              <Button variant="secondary" size="sm" type="button" className={`${styles.pageBtn} ${styles.active}`}>
                {(pageData?.page || 0) + 1}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                type="button"
                className={styles.pageBtn}
                disabled={(pageData?.page || 0) + 1 >= (pageData?.totalPages || 1)}
                onClick={() =>
                  setQuery((prev) => ({
                    ...prev,
                    page: prev.page + 1,
                  }))
                }
              >
                ›
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
