import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hồ sơ cá nhân',
  description: 'Quản lý thông tin tài khoản người dùng trên ThinkAI Lumina.',
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
