import { apiRequest } from './api';

export interface AdminDashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  activeStudents: number;
  activeTeachers: number;
  aiChatsToday: number;
}

export interface AdminAiRuntimeSettings {
  tutorEnabled: boolean;
  harnessEnabled: boolean;
  tutorModel?: string | null;
  tutorFallbackModel?: string | null;
  harnessModels: string[];
  blockedModels: string[];
}

export interface AiTraceMetric {
  createdAt: string;
  userId: number;
  conversationId: string;
  agentType: string;
  action: string;
  message: string;
  result: string;
  requiresMoreInfo: boolean;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
}

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  isActive: boolean;
  approvalStatus?: 'PENDING' | 'APPROVED' | 'BLOCKED';
}

export interface AdminUserPage {
  content: AdminUser[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AdminUsersQuery {
  page?: number;
  size?: number;
  keyword?: string;
  role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
  isActive?: boolean;
  approvalStatus?: 'PENDING' | 'APPROVED' | 'BLOCKED';
}

export interface AdminCourse {
  id: number;
  title: string;
  description?: string;
  thumbnailUrl?: string | null;
  price: number;
  instructorId?: number;
  instructorName?: string;
  isPublished?: boolean;
  status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'BLOCKED';
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCoursePage {
  content: AdminCourse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AdminCoursesQuery {
  page?: number;
  size?: number;
  keyword?: string;
}

export interface AdminAuditLog {
  id: number;
  actor: string;
  action: string;
  resourceType: string;
  resourceKey: string;
  diffSummary?: string;
  beforeSnapshot?: string;
  afterSnapshot?: string;
  createdAt: string;
}

export interface AdminAuditLogPage {
  content: AdminAuditLog[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AdminAuditLogsQuery {
  page?: number;
  size?: number;
  actor?: string;
  action?: string;
  resourceType?: string;
}

export interface AdminCourseRequest {
  title: string;
  description: string;
  price: number;
  instructorId: number;
  thumbnailUrl?: string;
  isPublished?: boolean;
  status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'BLOCKED';
}

function buildAdminCoursesQuery(query: AdminCoursesQuery = {}): string {
  const params = new URLSearchParams();
  if (typeof query.page === 'number') params.set('page', String(query.page));
  if (typeof query.size === 'number') params.set('size', String(query.size));
  if (query.keyword) params.set('keyword', query.keyword);
  const qs = params.toString();
  return qs ? `/admin/courses?${qs}` : '/admin/courses';
}

function buildAdminUsersQuery(query: AdminUsersQuery = {}): string {
  const params = new URLSearchParams();
  if (typeof query.page === 'number') params.set('page', String(query.page));
  if (typeof query.size === 'number') params.set('size', String(query.size));
  if (query.keyword) params.set('keyword', query.keyword);
  if (query.role) params.set('role', query.role);
  if (typeof query.isActive === 'boolean') params.set('isActive', String(query.isActive));
  if (query.approvalStatus) params.set('approvalStatus', query.approvalStatus);
  const qs = params.toString();
  return qs ? `/admin/users?${qs}` : '/admin/users';
}

function buildAdminAuditLogsQuery(query: AdminAuditLogsQuery = {}): string {
  const params = new URLSearchParams();
  if (typeof query.page === 'number') params.set('page', String(query.page));
  if (typeof query.size === 'number') params.set('size', String(query.size));
  if (query.actor) params.set('actor', query.actor);
  if (query.action) params.set('action', query.action);
  if (query.resourceType) params.set('resourceType', query.resourceType);
  const qs = params.toString();
  return qs ? `/admin/audit-logs?${qs}` : '/admin/audit-logs';
}

const mockAdminStats: AdminDashboardStats = {
  totalUsers: 1420,
  totalCourses: 28,
  totalEnrollments: 5630,
  activeStudents: 1210,
  activeTeachers: 45,
  aiChatsToday: 382,
};

const mockAdminUsers: AdminUser[] = [
  { id: 1, fullName: 'Nguyễn Văn Minh', email: 'minh.nguyen@thinkai.vn', role: 'ADMIN', isActive: true, approvalStatus: 'APPROVED' },
  { id: 2, fullName: 'ThS. Hoàng Mai Anh', email: 'maianh.hoang@thinkai.vn', role: 'TEACHER', isActive: true, approvalStatus: 'APPROVED' },
  { id: 3, fullName: 'Trần Thị Thảo', email: 'thao.tran@gmail.com', role: 'STUDENT', isActive: true, approvalStatus: 'APPROVED' },
  { id: 4, fullName: 'Lê Minh Tuấn', email: 'tuan.le@fpt.edu.vn', role: 'STUDENT', isActive: false, approvalStatus: 'PENDING' },
];

const mockAdminCourseList: AdminCourse[] = [
  { id: 1, title: 'Chinh Phục TOEIC 850+ Cùng AI', description: 'TOEIC Mastery', price: 890000, instructorId: 2, instructorName: 'ThS. Hoàng Mai Anh', isPublished: true, status: 'APPROVED' },
  { id: 2, title: 'IELTS Intensive Speaking Band 7.5+', description: 'IELTS Advanced', price: 1450000, instructorId: 2, instructorName: 'Thầy David Đặng', isPublished: true, status: 'APPROVED' },
  { id: 3, title: 'Giao Tiếp Thương Mại Thực Chiến', description: 'Business English', price: 750000, instructorId: 2, instructorName: 'Cô Emily Trần', isPublished: false, status: 'DRAFT' },
];

const mockAiTraces: AiTraceMetric[] = [
  {
    createdAt: '2026-09-19T14:30:12Z',
    userId: 3,
    conversationId: 'conv-8923-a',
    agentType: 'TUTOR',
    action: 'ANSWER_QUERY',
    message: 'Giải thích giúp mình câu hỏi về Inversion trong TOEIC Part 5',
    result: 'Phân tích cấu trúc đảo ngữ với trạng từ phủ định Rarely/Never...',
    requiresMoreInfo: false,
    latencyMs: 340,
    inputTokens: 120,
    outputTokens: 280,
  },
  {
    createdAt: '2026-09-19T14:28:45Z',
    userId: 4,
    conversationId: 'conv-8924-b',
    agentType: 'EXAM_OPS',
    action: 'EVALUATE_ANSWER',
    message: 'Nộp câu trả lời bài kiểm tra trắc nghiệm',
    result: 'Chấm điểm tự động: 10/10, sinh feedback chi tiết',
    requiresMoreInfo: false,
    latencyMs: 180,
    inputTokens: 95,
    outputTokens: 140,
  },
];

export async function getAdminDashboard(): Promise<AdminDashboardStats> {
  try {
    return await apiRequest<AdminDashboardStats>('/admin/dashboard');
  } catch {
    return mockAdminStats;
  }
}

export async function getAdminUsers(query: AdminUsersQuery = {}): Promise<AdminUserPage> {
  try {
    const data = await apiRequest<AdminUserPage>(buildAdminUsersQuery(query));
    if (!data?.content || data.content.length === 0) {
      return { content: mockAdminUsers, page: 0, size: 50, totalElements: mockAdminUsers.length, totalPages: 1 };
    }
    return data;
  } catch {
    return { content: mockAdminUsers, page: 0, size: 50, totalElements: mockAdminUsers.length, totalPages: 1 };
  }
}

export async function updateAdminUserStatus(userId: number, isActive: boolean): Promise<{ userId: number; isActive: boolean }> {
  return apiRequest<{ userId: number; isActive: boolean }>(`/admin/users/${userId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ isActive }),
  });
}

export async function updateAdminUsersBulkStatus(
  userIds: number[],
  isActive: boolean
): Promise<{ updatedCount: number; isActive: boolean; userIds: number[] }> {
  return apiRequest<{ updatedCount: number; isActive: boolean; userIds: number[] }>('/admin/users/bulk-status', {
    method: 'PUT',
    body: JSON.stringify({ userIds, isActive }),
  });
}

export async function updateAdminUsersBulkStatusByFilter(payload: {
  isActive: boolean;
  keyword?: string;
  role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
  currentIsActive?: boolean;
  currentApprovalStatus?: 'PENDING' | 'APPROVED' | 'BLOCKED';
}): Promise<{ updatedCount: number; isActive: boolean; userIds: number[] }> {
  return apiRequest<{ updatedCount: number; isActive: boolean; userIds: number[] }>('/admin/users/bulk-status-filter', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function approveAdminUser(
  userId: number
): Promise<{ userId: number; isActive: boolean; approved: boolean }> {
  return apiRequest<{ userId: number; isActive: boolean; approved: boolean }>(`/admin/users/${userId}/approve`, {
    method: 'PUT',
  });
}

export async function updateAIPrompts(payload: { tutorSystemPrompt: string; examGeneratorPrompt: string }): Promise<boolean> {
  return apiRequest<boolean>('/admin/settings/ai-prompts', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function getAdminCourses(query: AdminCoursesQuery = {}): Promise<AdminCoursePage> {
  try {
    const data = await apiRequest<AdminCoursePage>(buildAdminCoursesQuery(query));
    if (!data?.content || data.content.length === 0) {
      return { content: mockAdminCourseList, page: 0, size: 20, totalElements: mockAdminCourseList.length, totalPages: 1 };
    }
    return data;
  } catch {
    return { content: mockAdminCourseList, page: 0, size: 20, totalElements: mockAdminCourseList.length, totalPages: 1 };
  }
}

export async function createAdminCourse(payload: AdminCourseRequest): Promise<{ courseId: number }> {
  return apiRequest<{ courseId: number }>('/admin/courses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateAdminCourse(courseId: number, payload: AdminCourseRequest): Promise<AdminCourse> {
  return apiRequest<AdminCourse>(`/admin/courses/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminCourse(courseId: number): Promise<void> {
  return apiRequest<void>(`/admin/courses/${courseId}`, {
    method: 'DELETE',
  });
}

export async function blockAdminCourse(
  courseId: number,
  blocked: boolean,
  restoreStatus?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'
): Promise<{ courseId: number; status: string; isPublished: boolean; blocked: boolean }> {
  return apiRequest<{ courseId: number; status: string; isPublished: boolean; blocked: boolean }>(
    `/admin/courses/${courseId}/block`,
    {
      method: 'PUT',
      body: JSON.stringify({
        blocked,
        restoreStatus,
      }),
    }
  );
}

export async function getAiTraces(conversationId?: string): Promise<AiTraceMetric[]> {
  const endpoint = conversationId 
    ? `/admin/ai/traces?conversationId=${conversationId}`
    : '/admin/ai/traces';
  try {
    const data = await apiRequest<AiTraceMetric[]>(endpoint);
    if (!data || data.length === 0) return mockAiTraces;
    return data;
  } catch {
    return mockAiTraces;
  }
}

export async function getAiStats(): Promise<{
  totalTraces: number;
  avgLatencyMs: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  agentUsage: Record<string, number>;
}> {
  try {
    return await apiRequest<{
      totalTraces: number;
      avgLatencyMs: number;
      totalInputTokens: number;
      totalOutputTokens: number;
      agentUsage: Record<string, number>;
    }>('/admin/ai/stats');
  } catch {
    return {
      totalTraces: 420,
      avgLatencyMs: 310,
      totalInputTokens: 52000,
      totalOutputTokens: 118000,
      agentUsage: { TUTOR: 280, EXAM_OPS: 90, COURSE_OPS: 50 },
    };
  }
}

export async function getAdminAuditLogs(query: AdminAuditLogsQuery = {}): Promise<AdminAuditLogPage> {
  try {
    return await apiRequest<AdminAuditLogPage>(buildAdminAuditLogsQuery(query));
  } catch {
    return {
      content: [
        { id: 1, actor: 'admin@thinkai.vn', action: 'UPDATE_COURSE', resourceType: 'COURSE', resourceKey: 'course-1', diffSummary: 'Khóa học TOEIC 850+ được duyệt', createdAt: '2026-09-19T10:00:00Z' },
        { id: 2, actor: 'admin@thinkai.vn', action: 'BLOCK_USER', resourceType: 'USER', resourceKey: 'user-4', diffSummary: 'Chặn tài khoản spam', createdAt: '2026-09-18T16:20:00Z' },
      ],
      page: 0,
      size: 50,
      totalElements: 2,
      totalPages: 1,
    };
  }
}

export async function getAdminAiRuntimeSettings(): Promise<AdminAiRuntimeSettings> {
  try {
    return await apiRequest<AdminAiRuntimeSettings>('/admin/settings/ai-runtime');
  } catch {
    return {
      tutorEnabled: true,
      harnessEnabled: true,
      tutorModel: 'gemini-1.5-pro',
      tutorFallbackModel: 'gemini-1.5-flash',
      harnessModels: ['gemini-1.5-pro', 'gpt-4o'],
      blockedModels: [],
    };
  }
}

export async function updateAdminAiRuntimeSettings(payload: AdminAiRuntimeSettings): Promise<AdminAiRuntimeSettings> {
  return apiRequest<AdminAiRuntimeSettings>('/admin/settings/ai-runtime', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
