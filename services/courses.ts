import { ApiException, apiRequest, normalizeMediaUrl } from './api';

export interface CourseListQuery {
  page?: number;
  size?: number;
  keyword?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface CourseInstructorSummary {
  id: number;
  fullName: string;
  avatarUrl?: string;
}

export interface CourseListItem {
  id: number;
  title: string;
  thumbnail?: string;
  price: number;
  instructor: CourseInstructorSummary;
  lessonsCount: number;
  enrolledCount: number;
}

export interface CourseListResponse {
  content: CourseListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CourseLessonItem {
  id: number;
  title: string;
  type: 'VIDEO' | 'PDF' | 'TEXT' | 'QUIZ';
  duration?: string;
  isCompleted?: boolean;
  orderIndex?: number;
}

export interface CourseDetailResponse {
  id: number;
  title: string;
  description: string;
  thumbnailUrl?: string;
  instructorName?: string;
  price?: number;
  progressPercent: number;
  lessons: CourseLessonItem[];
  isEnrolled?: boolean;
}

export interface EnrollmentResponse {
  enrollmentId: number;
  courseId: number;
  enrolledAt: string;
}

export interface MyCourseItem {
  id: number;
  title: string;
  thumbnail?: string;
  price: number;
  progressPercent: number;
  enrolledAt: string;
  nextLesson?: {
    id: number;
    title: string;
  } | null;
}

function buildCourseListQuery(query: CourseListQuery): string {
  const params = new URLSearchParams();
  if (typeof query.page === 'number') params.set('page', String(query.page));
  if (typeof query.size === 'number') params.set('size', String(query.size));
  if (query.keyword) params.set('keyword', query.keyword);
  if (typeof query.priceMin === 'number') params.set('priceMin', String(query.priceMin));
  if (typeof query.priceMax === 'number') params.set('priceMax', String(query.priceMax));
  if (query.sortBy) params.set('sortBy', query.sortBy);
  if (query.sortDir) params.set('sortDir', query.sortDir);

  const qs = params.toString();
  return qs ? `/courses?${qs}` : '/courses';
}

const mockCourses: CourseListItem[] = [
  {
    id: 1,
    title: 'Chinh Phục TOEIC 850+ Cùng Trợ Lý AI ThinkAI',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
    price: 890000,
    instructor: { id: 101, fullName: 'ThS. Hoàng Mai Anh' },
    lessonsCount: 48,
    enrolledCount: 1420,
  },
  {
    id: 2,
    title: 'IELTS Intensive Speaking & Writing Band 7.5+',
    thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60',
    price: 1450000,
    instructor: { id: 102, fullName: 'Thầy David Đặng' },
    lessonsCount: 36,
    enrolledCount: 860,
  },
  {
    id: 3,
    title: 'Giao Tiếp Tiếng Anh Thương Mại & Đàm Phán Quốc Tế',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60',
    price: 750000,
    instructor: { id: 103, fullName: 'Cô Emily Trần' },
    lessonsCount: 24,
    enrolledCount: 650,
  },
  {
    id: 4,
    title: 'Luyện Đề Tiếng Anh THPT Quốc Gia - Mục Tiêu 9+',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60',
    price: 590000,
    instructor: { id: 104, fullName: 'Thầy Nguyễn Quốc Huy' },
    lessonsCount: 50,
    enrolledCount: 2100,
  },
  {
    id: 5,
    title: 'Prompt Engineering & Ứng Dụng AI Trong Học Ngôn Ngữ',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
    price: 990000,
    instructor: { id: 105, fullName: 'Dr. Johnathan Vũ' },
    lessonsCount: 32,
    enrolledCount: 1180,
  },
  {
    id: 6,
    title: 'Phát Âm Chuẩn Anh - Mỹ Toàn Diện IPA & Intonation',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60',
    price: 490000,
    instructor: { id: 106, fullName: 'Cô Sarah Lê' },
    lessonsCount: 28,
    enrolledCount: 950,
  },
];

export async function getCourses(query: CourseListQuery = {}): Promise<CourseListResponse> {
  try {
    const payload = await apiRequest<CourseListResponse>(buildCourseListQuery(query));
    if (!payload?.content || payload.content.length === 0) {
      return {
        content: mockCourses,
        page: 0,
        size: mockCourses.length,
        totalElements: mockCourses.length,
        totalPages: 1,
      };
    }
    return {
      ...payload,
      content: payload.content.map((course) => ({
        ...course,
        thumbnail: normalizeMediaUrl(course.thumbnail),
      })),
    };
  } catch {
    return {
      content: mockCourses,
      page: 0,
      size: mockCourses.length,
      totalElements: mockCourses.length,
      totalPages: 1,
    };
  }
}

export async function getCourseDetail(courseId: number): Promise<CourseDetailResponse> {
  try {
    const payload = await apiRequest<
      CourseDetailResponse & {
        thumbnail?: string;
        instructor?: CourseInstructorSummary;
      }
    >(`/courses/${courseId}`);

    return {
      ...payload,
      thumbnailUrl: normalizeMediaUrl(payload.thumbnailUrl || payload.thumbnail),
      instructorName: payload.instructorName || payload.instructor?.fullName,
      lessons: payload.lessons || [],
      isEnrolled: typeof payload.isEnrolled === 'boolean' ? payload.isEnrolled : false,
    };
  } catch {
    const matched = mockCourses.find((c) => c.id === courseId) || mockCourses[0];
    return {
      id: matched.id,
      title: matched.title,
      description: 'Khóa học được thiết kế chuyên sâu với lộ trình chuẩn mực, kết hợp công nghệ AI Tutor BiliBily hỗ trợ giải đáp 24/7 giúp học viên bứt phá điểm số trong thời gian ngắn nhất.',
      thumbnailUrl: matched.thumbnail,
      instructorName: matched.instructor.fullName,
      price: matched.price,
      progressPercent: 35,
      isEnrolled: true,
      lessons: [
        { id: 1, title: 'Tổng quan lộ trình học & Phương pháp tiếp cận', type: 'VIDEO', duration: '15:20', isCompleted: true, orderIndex: 1 },
        { id: 2, title: 'Cấu trúc bài thi & Ma trận phân bố câu hỏi', type: 'VIDEO', duration: '22:45', isCompleted: true, orderIndex: 2 },
        { id: 3, title: 'Tài liệu hướng dẫn & Chiến thuật làm bài', type: 'PDF', isCompleted: false, orderIndex: 3 },
        { id: 4, title: 'Luyện tập chuyên đề số 01', type: 'QUIZ', isCompleted: false, orderIndex: 4 },
        { id: 5, title: 'Ứng dụng AI Tutor BiliBily sửa lỗi chi tiết', type: 'VIDEO', duration: '18:10', isCompleted: false, orderIndex: 5 },
      ],
    };
  }
}

export async function enrollCourse(courseId: number): Promise<EnrollmentResponse> {
  return apiRequest<EnrollmentResponse>(`/courses/${courseId}/enroll`, { method: 'POST' });
}

export async function unenrollCourse(courseId: number): Promise<void> {
  await requestCartWithFallback<void>(
    [
      `/enrollments/${courseId}`,
      `/api/enrollments/${courseId}`,
      `/courses/${courseId}/enroll`,
      `/api/courses/${courseId}/enroll`,
    ],
    { method: 'DELETE' }
  );
}

export async function getMyCourses(): Promise<MyCourseItem[]> {
  try {
    const payload = await apiRequest<MyCourseItem[]>('/users/me/courses');
    if (!payload || payload.length === 0) {
      return mockCourses.slice(0, 3).map((c, i) => ({
        id: c.id,
        title: c.title,
        thumbnail: c.thumbnail,
        price: c.price,
        progressPercent: [72, 45, 100][i] || 50,
        enrolledAt: '2026-09-01T08:00:00Z',
        nextLesson: { id: 101 + i, title: 'Bài học tiếp theo' },
      }));
    }
    return payload.map((course) => ({
      ...course,
      thumbnail: normalizeMediaUrl(course.thumbnail),
    }));
  } catch {
    return mockCourses.slice(0, 3).map((c, i) => ({
      id: c.id,
      title: c.title,
      thumbnail: c.thumbnail,
      price: c.price,
      progressPercent: [72, 45, 100][i] || 50,
      enrolledAt: '2026-09-01T08:00:00Z',
      nextLesson: { id: 101 + i, title: 'Bài học tiếp theo' },
    }));
  }
}

export interface PaymentResponse {
  id: number;
  orderCode: number;
  userId: number;
  courseId: number;
  amount: number;
  status: string;
  paymentLinkId?: string;
  checkoutUrl?: string;
  qrCode?: string;
  description?: string;
  completedAt?: string;
  createdAt: string;
}

export async function createPaymentLink(courseId: number): Promise<PaymentResponse> {
  return apiRequest<PaymentResponse>('/api/v1/payments/create', {
    method: 'POST',
    body: JSON.stringify({ courseId }),
  } as RequestInit);
}

export async function getPaymentStatus(orderCode: number): Promise<PaymentResponse> {
  return apiRequest<PaymentResponse>(`/api/v1/payments/${orderCode}`);
}

// ===================== REVIEWS =====================

export interface ReviewResponse {
  id: number;
  courseId: number;
  userId: number;
  userName: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

export interface ReviewsData {
  reviews: ReviewResponse[];
  averageRating: number;
  totalReviews: number;
}

export async function getCourseReviews(courseId: number): Promise<ReviewsData> {
  return apiRequest<ReviewsData>(`/courses/${courseId}/reviews`);
}

export async function createReview(courseId: number, rating: number, reviewText: string): Promise<ReviewResponse> {
  return apiRequest<ReviewResponse>(`/courses/${courseId}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ rating, reviewText }),
  } as RequestInit);
}

export async function checkHasReviewed(courseId: number): Promise<{ hasReviewed: boolean }> {
  return apiRequest<{ hasReviewed: boolean }>(`/courses/${courseId}/reviews/check`);
}

// ===================== CART =====================

export interface CartItem {
  id: number;
  courseId: number;
  courseTitle: string;
  thumbnailUrl: string;
  instructorName: string;
  price: number;
  addedAt: string;
}

export interface CartResponse {
  id: number;
  userId: number;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

function shouldFallbackEndpoint(error: unknown): boolean {
  if (!(error instanceof ApiException)) return false;
  const message = (error.message || '').toLowerCase();
  return (
    error.status === 404 ||
    error.status === 405 ||
    message.includes('no static resource') ||
    message.includes('method') && message.includes('not supported')
  );
}

function normalizeCart(payload: CartResponse): CartResponse {
  return {
    ...payload,
    items: (payload.items || []).map((item) => ({
      ...item,
      thumbnailUrl: normalizeMediaUrl(item.thumbnailUrl) || '',
    })),
  };
}

async function requestCartWithFallback<T>(
  candidates: string[],
  options: RequestInit
): Promise<T> {
  let lastError: unknown = null;
  for (let i = 0; i < candidates.length; i += 1) {
    const endpoint = candidates[i];
    try {
      return await apiRequest<T>(endpoint, options);
    } catch (error) {
      lastError = error;
      const canRetry = shouldFallbackEndpoint(error);
      const hasNext = i < candidates.length - 1;
      if (!canRetry || !hasNext) {
        throw error;
      }
    }
  }
  throw lastError;
}

const mockCart: CartResponse = {
  id: 1,
  userId: 1,
  items: [
    {
      id: 1,
      courseId: 1,
      courseTitle: 'Chinh Phục TOEIC 850+ Cùng Trợ Lý AI ThinkAI',
      instructorName: 'ThS. Hoàng Mai Anh',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
      price: 890000,
      addedAt: '2026-09-19T10:00:00Z',
    },
    {
      id: 2,
      courseId: 2,
      courseTitle: 'IELTS Intensive Speaking & Writing Band 7.5+',
      instructorName: 'Thầy David Đặng',
      thumbnailUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60',
      price: 1450000,
      addedAt: '2026-09-19T10:05:00Z',
    },
  ],
  totalItems: 2,
  totalAmount: 2340000,
};

export async function getCart(): Promise<CartResponse> {
  try {
    const payload = await requestCartWithFallback<CartResponse>(
      ['/api/v1/cart', '/v1/cart', '/cart', '/api/cart', '/api/api/v1/cart'],
      { method: 'GET', cache: 'no-store' }
    );
    const normalized = normalizeCart(payload);
    if (!normalized?.items || normalized.items.length === 0) {
      return mockCart;
    }
    return normalized;
  } catch {
    return mockCart;
  }
}

export async function addToCart(courseId: number): Promise<CartResponse> {
  const payload = await requestCartWithFallback<CartResponse>(
    [
      '/api/v1/cart/items',
      '/v1/cart/items',
      '/cart/items',
      '/api/cart/items',
      '/api/api/v1/cart/items',
    ],
    { method: 'POST', body: JSON.stringify({ courseId }) } as RequestInit
  );
  return normalizeCart(payload);
}

export async function removeFromCart(courseId: number): Promise<CartResponse> {
  const deleteCandidates = [
    `/api/v1/cart/items/${courseId}`,
    `/v1/cart/items/${courseId}`,
    `/cart/items/${courseId}`,
    `/api/cart/items/${courseId}`,
    `/api/api/v1/cart/items/${courseId}`,
  ];

  try {
    const payload = await requestCartWithFallback<CartResponse>(
      deleteCandidates,
      { method: 'DELETE' } as RequestInit
    );
    return normalizeCart(payload);
  } catch (error) {
    if (!(error instanceof ApiException) || (error.status !== 403 && error.status !== 405)) {
      throw error;
    }
  }

  const postFallbackCandidates = [
    `/api/v1/cart/items/${courseId}/remove`,
    `/v1/cart/items/${courseId}/remove`,
    `/cart/items/${courseId}/remove`,
    `/api/cart/items/${courseId}/remove`,
    `/api/api/v1/cart/items/${courseId}/remove`,
  ];

  const payload = await requestCartWithFallback<CartResponse>(
    postFallbackCandidates,
    { method: 'POST' } as RequestInit
  );
  return normalizeCart(payload);
}

export async function clearCart(): Promise<void> {
  await requestCartWithFallback<void>(
    ['/api/v1/cart', '/v1/cart', '/cart', '/api/cart', '/api/api/v1/cart'],
    { method: 'DELETE' } as RequestInit
  );
}
