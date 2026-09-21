import { apiRequest, normalizeMediaUrl } from './api';

export interface DashboardEnrolledCourse {
  courseId: number;
  title: string;
  thumbnailUrl?: string;
  progressPercent: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessedAt?: string;
}

export interface DashboardNextLesson {
  lessonId: number;
  lessonTitle: string;
  courseTitle: string;
  type: 'VIDEO' | 'PDF' | 'TEXT' | 'QUIZ';
}

export interface DashboardData {
  greeting: string;
  totalEnrolledCourses: number;
  averageProgress: number;
  enrolledCourses: DashboardEnrolledCourse[];
  nextLesson?: DashboardNextLesson | null;
}

const mockDashboardData: DashboardData = {
  greeting: 'Chào mừng bạn trở lại, Minh!',
  totalEnrolledCourses: 4,
  averageProgress: 68,
  enrolledCourses: [
    {
      courseId: 1,
      title: 'Chinh Phục TOEIC 850+ Cùng AI',
      progressPercent: 72,
      totalLessons: 45,
      completedLessons: 32,
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
      lastAccessedAt: '2026-09-18T14:20:00Z',
    },
    {
      courseId: 2,
      title: 'IELTS Intensive Speaking & Writing Mastery',
      progressPercent: 45,
      totalLessons: 30,
      completedLessons: 14,
      thumbnailUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60',
      lastAccessedAt: '2026-09-17T09:15:00Z',
    },
    {
      courseId: 3,
      title: 'Giao Tiếp Tiếng Anh Thương Mại Thực Chiến',
      progressPercent: 90,
      totalLessons: 20,
      completedLessons: 18,
      thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60',
      lastAccessedAt: '2026-09-15T16:40:00Z',
    },
  ],
  nextLesson: {
    lessonId: 105,
    lessonTitle: 'Chiến thuật bẫy Paraphrase trong TOEIC Part 7',
    courseTitle: 'Chinh Phục TOEIC 850+ Cùng AI',
    type: 'VIDEO',
  },
};

export async function getDashboard(): Promise<DashboardData> {
  try {
    const payload = await apiRequest<DashboardData>('/users/me/dashboard');
    return {
      ...payload,
      enrolledCourses: payload.enrolledCourses.map((course) => ({
        ...course,
        thumbnailUrl: normalizeMediaUrl(course.thumbnailUrl),
      })),
    };
  } catch {
    return mockDashboardData;
  }
}
