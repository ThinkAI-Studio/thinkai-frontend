  import { apiRequest, apiRequestFormData, normalizeMediaUrl } from './api';

export interface TeacherDashboardStats {
  totalCourses: number;
  totalStudents: number;
  completedStudents: number;
  completionRate: number;
}

export interface TeacherCourse {
  id: number;
  title: string;
  description?: string;
  thumbnailUrl?: string | null;
  price: number;
  instructorId?: number;
  isPublished?: boolean;
  status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
  updatedAt?: string;
}

export interface TeacherCourseRequest {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  price: number;
}

export interface TeacherCoursePage {
  content: TeacherCourse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface LessonRequest {
  title: string;
  type: 'VIDEO' | 'PDF' | 'QUIZ';
  contentUrl?: string;
  contentText?: string;
  durationSeconds?: number;
  orderIndex?: number;
}

export interface LessonOrderUpdate {
  lessonId: number;
  orderIndex: number;
}

export interface QuestionBankRequest {
  examType: string;
  section: string;
  part: string;
  content: string;
  options?: string;
  correctAnswer: string;
  explanation?: string;
  audioUrl?: string;
  imageUrl?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags?: string[];
}

export interface ExamRequest {
  courseId: number;
  title: string;
  examType?: string;
  description?: string;
  timeLimitMinutes: number;
  passingScore: number;
  isRandomOrder?: boolean;
  partConfig?: Record<string, number>;
}

export interface TeacherQuestionBank {
  id: number;
  examType?: string;
  section?: string;
  part?: string;
  content: string;
  correctAnswer?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  tags?: string[];
}

export interface TeacherExam {
  id: number;
  courseId: number;
  title: string;
  examType?: string;
  description?: string;
  timeLimitMinutes?: number;
  passingScore?: number;
  isRandomOrder?: boolean;
}

function buildPageQuery(basePath: string, page = 0, size = 10): string {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  return `${basePath}?${params.toString()}`;
}

const mockTeacherStats: TeacherDashboardStats = {
  totalCourses: 6,
  totalStudents: 342,
  completedStudents: 188,
  completionRate: 55,
};

const mockTeacherCourseList: TeacherCourse[] = [
  {
    id: 1,
    title: 'Chinh Phục TOEIC 850+ Cùng AI',
    description: 'Khóa học nâng cao dành cho học viên có nền tảng 500+.',
    price: 890000,
    isPublished: true,
    status: 'APPROVED',
    createdAt: '2026-08-10T08:00:00Z',
  },
  {
    id: 2,
    title: 'IELTS Intensive Speaking Band 7.5+',
    description: 'Rèn luyện phản xạ Speaking Part 1, 2, 3 với AI Tutor.',
    price: 1450000,
    isPublished: true,
    status: 'APPROVED',
    createdAt: '2026-08-15T09:00:00Z',
  },
  {
    id: 3,
    title: 'Giao Tiếp Thương Mại Cho Dân Công Nghệ',
    description: 'Tiếng Anh trong môi trường Agile/Scrum và đàm phán khách hàng quốc tế.',
    price: 750000,
    isPublished: false,
    status: 'DRAFT',
    createdAt: '2026-09-01T10:00:00Z',
  },
];

export async function getTeacherDashboard(): Promise<TeacherDashboardStats> {
  try {
    return await apiRequest<TeacherDashboardStats>('/teacher/dashboard');
  } catch {
    return mockTeacherStats;
  }
}

export async function createTeacherCourse(payload: TeacherCourseRequest): Promise<TeacherCourse> {
  const course = await apiRequest<TeacherCourse>('/teacher/courses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return {
    ...course,
    thumbnailUrl: normalizeMediaUrl(course.thumbnailUrl),
  };
}

export async function getTeacherCourses(page = 0, size = 10): Promise<TeacherCoursePage> {
  try {
    const payload = await apiRequest<TeacherCoursePage>(buildPageQuery('/teacher/courses', page, size));
    if (!payload?.content || payload.content.length === 0) {
      return {
        content: mockTeacherCourseList,
        totalElements: mockTeacherCourseList.length,
        totalPages: 1,
        size: 10,
        number: 0,
      };
    }
    return {
      ...payload,
      content: payload.content.map((course) => ({
        ...course,
        thumbnailUrl: normalizeMediaUrl(course.thumbnailUrl),
      })),
    };
  } catch {
    return {
      content: mockTeacherCourseList,
      totalElements: mockTeacherCourseList.length,
      totalPages: 1,
      size: 10,
      number: 0,
    };
  }
}

export async function getTeacherCourse(courseId: number): Promise<TeacherCourse> {
  const course = await apiRequest<TeacherCourse>(`/teacher/courses/${courseId}`);
  return {
    ...course,
    thumbnailUrl: normalizeMediaUrl(course.thumbnailUrl),
  };
}

export async function updateTeacherCourse(courseId: number, payload: TeacherCourseRequest): Promise<TeacherCourse> {
  const course = await apiRequest<TeacherCourse>(`/teacher/courses/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return {
    ...course,
    thumbnailUrl: normalizeMediaUrl(course.thumbnailUrl),
  };
}

export async function deleteTeacherCourse(courseId: number): Promise<void> {
  return apiRequest<void>(`/teacher/courses/${courseId}`, {
    method: 'DELETE',
  });
}

export async function publishTeacherCourse(courseId: number): Promise<TeacherCourse> {
  return apiRequest<TeacherCourse>(`/teacher/courses/${courseId}/publish`, {
    method: 'PUT',
  });
}

export async function createTeacherLesson(courseId: number, payload: LessonRequest): Promise<unknown> {
  return apiRequest<unknown>(`/teacher/courses/${courseId}/lessons`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function uploadTeacherLessonFile(courseId: number, file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const payload = await apiRequestFormData<{ url: string }>(
    `/teacher/courses/${courseId}/lessons/upload`,
    formData,
    { method: 'POST' }
  );
  return {
    url: normalizeMediaUrl(payload.url) || payload.url,
  };
}

export async function uploadTeacherCourseThumbnail(courseId: number, file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const payload = await apiRequestFormData<{ url: string }>(
    `/teacher/courses/${courseId}/thumbnail`,
    formData,
    { method: 'POST' }
  );
  return {
    url: normalizeMediaUrl(payload.url) || payload.url,
  };
}

export async function reorderTeacherLessons(
  courseId: number,
  lessonOrders: LessonOrderUpdate[]
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/teacher/courses/${courseId}/lessons/order`, {
    method: 'PUT',
    body: JSON.stringify({ lessonOrders }),
  });
}

export async function createTeacherQuestion(payload: QuestionBankRequest): Promise<unknown> {
  return apiRequest<TeacherQuestionBank>('/teacher/questions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function importTeacherQuestions(file: File): Promise<{ message: string; count: number }> {
  const formData = new FormData();
  formData.append('file', file);
  return apiRequestFormData<{ message: string; count: number }>(
    '/teacher/questions/import',
    formData,
    { method: 'POST' }
  );
}

const mockQuestions: TeacherQuestionBank[] = [
  {
    id: 1,
    examType: 'TOEIC',
    section: 'LISTENING',
    part: 'Part 1',
    content: 'Look at the picture marked number 1 in your test book. (A) She is typing on a laptop.',
    correctAnswer: 'A',
    difficulty: 'EASY',
    tags: ['TOEIC', 'Listening', 'Office'],
  },
  {
    id: 2,
    examType: 'TOEIC',
    section: 'READING',
    part: 'Part 5',
    content: 'The marketing department will review the proposal before Friday afternoon.',
    correctAnswer: 'A',
    difficulty: 'MEDIUM',
    tags: ['TOEIC', 'Grammar', 'Prepositions'],
  },
];

const mockTeacherExamList: TeacherExam[] = [
  {
    id: 1,
    courseId: 1,
    title: 'Đề Thi Thử TOEIC Part 1 & 2 - Tuần 1',
    examType: 'TOEIC',
    description: 'Kiểm tra nhanh 30 câu hỏi phát âm và cấu trúc đề thi thật.',
    timeLimitMinutes: 30,
    passingScore: 70,
  },
  {
    id: 2,
    courseId: 1,
    title: 'Bài Đánh Giá Giữa Kỳ TOEIC 850+',
    examType: 'TOEIC',
    description: '100 câu hỏi tổng hợp Listening & Reading có phân tích điểm yếu.',
    timeLimitMinutes: 75,
    passingScore: 75,
  },
];

export async function getTeacherQuestionBank(page = 0, size = 10): Promise<{
  content: TeacherQuestionBank[];
  totalElements: number;
  totalPages: number;
}> {
  try {
    const data = await apiRequest<{
      content: TeacherQuestionBank[];
      totalElements: number;
      totalPages: number;
    }>(buildPageQuery('/teacher/questions/bank', page, size));
    if (!data?.content || data.content.length === 0) {
      return { content: mockQuestions, totalElements: mockQuestions.length, totalPages: 1 };
    }
    return data;
  } catch {
    return { content: mockQuestions, totalElements: mockQuestions.length, totalPages: 1 };
  }
}

export async function getTeacherQuestionDetail(questionId: number): Promise<TeacherQuestionBank> {
  try {
    return await apiRequest<TeacherQuestionBank>(`/teacher/questions/${questionId}`);
  } catch {
    return mockQuestions.find((q) => q.id === questionId) || mockQuestions[0];
  }
}

export async function createTeacherExam(payload: ExamRequest): Promise<TeacherExam> {
  return apiRequest<TeacherExam>('/teacher/exams', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getTeacherExams(page = 0, size = 10): Promise<{
  content: TeacherExam[];
  totalElements: number;
  totalPages: number;
}> {
  try {
    const data = await apiRequest<{
      content: TeacherExam[];
      totalElements: number;
      totalPages: number;
    }>(buildPageQuery('/teacher/exams', page, size));
    if (!data?.content || data.content.length === 0) {
      return { content: mockTeacherExamList, totalElements: mockTeacherExamList.length, totalPages: 1 };
    }
    return data;
  } catch {
    return { content: mockTeacherExamList, totalElements: mockTeacherExamList.length, totalPages: 1 };
  }
}
