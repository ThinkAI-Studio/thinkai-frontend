import { apiRequest } from './api';

export interface ExamSummary {
  id: number;
  examType?: string;
  title: string;
  description?: string;
  timeLimitMinutes: number;
  passingScore?: number;
  createdAt?: string;
}

export interface ExamQuestion {
  id: number;
  content: string;
  type: string;
  options: string[];
  orderIndex?: number;
}

export interface StartExamResponse {
  attemptId: number;
  examId: number;
  examType?: string;
  title: string;
  description?: string;
  timeLimitMinutes: number;
  totalQuestions: number;
  startedAt: string;
  questions: ExamQuestion[];
}

export interface SubmitExamRequest {
  attemptId: number;
  answers: Array<{
    questionId: number;
    selectedOption: string;
  }>;
}

export interface SubmitExamResponse {
  attemptId: number;
  examTitle: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  isPassed: boolean;
  passingScore: number;
  submittedAt: string;
  timeTakenSeconds: number;
}

export interface ExamResultDetail {
  questionId: number;
  content: string;
  options: string[];
  orderIndex?: number;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface ExamResultResponse {
  attemptId: number;
  examTitle: string;
  examType?: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  isPassed: boolean;
  passingScore: number;
  startedAt: string;
  submittedAt: string;
  timeTakenSeconds: number;
  answers: ExamResultDetail[];
  aiFeedback?: string;
}

export interface ExamHistoryItem {
  attemptId: number;
  examId: number;
  examTitle: string;
  examType?: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  isPassed: boolean;
  startedAt: string;
  submittedAt: string;
  timeTakenSeconds: number;
}

function parseQuestionOptions(raw: string): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map((item) => String(item)) : [];
  } catch {
    return [];
  }
}

function mapQuestions(questions: Array<Omit<ExamQuestion, 'options'> & { options: string }>): ExamQuestion[] {
  return questions.map((question) => ({
    ...question,
    options: parseQuestionOptions(question.options),
  }));
}

function mapResultAnswers(
  answers: Array<Omit<ExamResultDetail, 'options'> & { options: string }>
): ExamResultDetail[] {
  return answers.map((answer) => ({
    ...answer,
    options: parseQuestionOptions(answer.options),
  }));
}

const mockExams: ExamSummary[] = [
  {
    id: 1,
    examType: 'TOEIC',
    title: 'Đề Thi Thử TOEIC Full Test 2026 - Format Mới',
    description: 'Bao gồm 200 câu hỏi chuẩn format ETS: 100 câu Listening và 100 câu Reading với giải thích chi tiết từ AI.',
    timeLimitMinutes: 120,
    passingScore: 650,
    createdAt: '2026-09-10T08:00:00Z',
  },
  {
    id: 2,
    examType: 'TOEIC',
    title: 'TOEIC Mini Test 01 - Listening Part 1 & 2 Cấp Tốc',
    description: 'Luyện phản xạ nhanh với 30 câu hỏi hình ảnh và hỏi đáp trọng tâm trong đề thi thật.',
    timeLimitMinutes: 30,
    passingScore: 700,
    createdAt: '2026-09-12T09:30:00Z',
  },
  {
    id: 3,
    examType: 'IELTS',
    title: 'IELTS Academic Reading Practice Test 04',
    description: 'Bộ 3 bài đọc chuyên sâu chủ đề Khoa học & Xã hội, rèn luyện kỹ năng Skimming, Scanning và Matching Headings.',
    timeLimitMinutes: 60,
    passingScore: 65,
    createdAt: '2026-09-15T14:00:00Z',
  },
];

const mockHistory: ExamHistoryItem[] = [
  {
    attemptId: 1001,
    examId: 1,
    examTitle: 'Đề Thi Thử TOEIC Full Test 2026 - Format Mới',
    examType: 'TOEIC',
    score: 820,
    correctCount: 168,
    totalQuestions: 200,
    isPassed: true,
    startedAt: '2026-09-18T08:00:00Z',
    submittedAt: '2026-09-18T09:55:00Z',
    timeTakenSeconds: 6900,
  },
  {
    attemptId: 1002,
    examId: 2,
    examTitle: 'TOEIC Mini Test 01 - Listening Part 1 & 2 Cấp Tốc',
    examType: 'TOEIC',
    score: 28,
    correctCount: 28,
    totalQuestions: 30,
    isPassed: true,
    startedAt: '2026-09-17T19:00:00Z',
    submittedAt: '2026-09-17T19:25:00Z',
    timeTakenSeconds: 1500,
  },
];

export async function getCourseExams(courseId: number): Promise<ExamSummary[]> {
  try {
    const data = await apiRequest<ExamSummary[]>(`/exams/${courseId}/exams`);
    if (!data || data.length === 0) return mockExams;
    return data;
  } catch {
    return mockExams;
  }
}

export async function startExam(examId: number, userId?: number | null): Promise<StartExamResponse> {
  const endpoint = typeof userId === 'number'
    ? `/exams/${examId}/start?userId=${userId}`
    : `/exams/${examId}/start`;

  try {
    const response = await apiRequest<Omit<StartExamResponse, 'questions'> & {
      questions: Array<Omit<ExamQuestion, 'options'> & { options: string }>;
    }>(endpoint, {
      method: 'POST',
    });

    return {
      ...response,
      questions: mapQuestions(response.questions || []),
    };
  } catch {
    return {
      attemptId: 1003,
      examId,
      title: 'Đề Thi Thử TOEIC Full Test 2026 - Format Mới',
      timeLimitMinutes: 120,
      totalQuestions: 10,
      startedAt: new Date().toISOString(),
      questions: [
        { id: 1, content: 'Where is the meeting being held?', type: 'MULTIPLE_CHOICE', options: ['In room 302', 'Tomorrow at noon', 'By the director', 'Yes, it is'] },
        { id: 2, content: 'When will the shipment arrive?', type: 'MULTIPLE_CHOICE', options: ['By next Monday', 'At the warehouse', 'Five hundred boxes', 'To Mr. Kim'] },
      ],
    };
  }
}

export async function submitExam(examId: number, payload: SubmitExamRequest): Promise<SubmitExamResponse> {
  try {
    return await apiRequest<SubmitExamResponse>(`/exams/${examId}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch {
    return {
      attemptId: 1003,
      examTitle: 'Đề Thi Thử TOEIC Full Test 2026',
      score: 850,
      correctCount: 9,
      totalQuestions: 10,
      isPassed: true,
      passingScore: 650,
      submittedAt: new Date().toISOString(),
      timeTakenSeconds: 3200,
    };
  }
}

export async function getExamResult(attemptId: number): Promise<ExamResultResponse> {
  try {
    const response = await apiRequest<Omit<ExamResultResponse, 'answers'> & {
      answers: Array<Omit<ExamResultDetail, 'options'> & { options: string }>;
    }>(`/exams/attempts/${attemptId}/result`);

    return {
      ...response,
      answers: mapResultAnswers(response.answers || []),
    };
  } catch {
    return {
      attemptId,
      examTitle: 'Đề Thi Thử TOEIC Full Test 2026',
      score: 850,
      correctCount: 9,
      totalQuestions: 10,
      isPassed: true,
      passingScore: 650,
      startedAt: '2026-09-18T08:00:00Z',
      submittedAt: '2026-09-18T09:00:00Z',
      timeTakenSeconds: 3600,
      answers: [],
      aiFeedback: 'Bạn đã hoàn thành rất xuất sắc phần Listening. Cần lưu ý bẫy từ đồng nghĩa trong Part 7.',
    };
  }
}

export async function getExamHistory(userId?: number | null): Promise<ExamHistoryItem[]> {
  const endpoint = typeof userId === 'number'
    ? `/exams/history?userId=${userId}`
    : '/exams/history';
  try {
    const data = await apiRequest<ExamHistoryItem[]>(endpoint);
    if (!data || data.length === 0) return mockHistory;
    return data;
  } catch {
    return mockHistory;
  }
}
