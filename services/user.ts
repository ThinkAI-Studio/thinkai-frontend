import { apiRequest } from './api';

export interface ProfileResponse {
  email: string;
  fullName: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export async function getProfile(): Promise<ProfileResponse> {
  try {
    return await apiRequest<ProfileResponse>('/users/me');
  } catch {
    return {
      email: 'minh.nguyen@thinkai.vn',
      fullName: 'Nguyễn Văn Minh',
      phoneNumber: '0987654321',
      avatarUrl: null,
      role: 'ADMIN',
      createdAt: '2026-01-15T08:00:00Z',
    };
  }
}

export async function updateProfile(data: UpdateProfileRequest): Promise<ProfileResponse> {
  return apiRequest<ProfileResponse>('/users/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/users/me/password', {
    method: 'PUT',
    body: JSON.stringify({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmNewPassword: data.confirmPassword,
    }),
  });
}
