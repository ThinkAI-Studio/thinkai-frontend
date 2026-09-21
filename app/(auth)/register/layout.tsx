import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng ký tài khoản',
  description: 'Tạo tài khoản ThinkAI Lumina để trải nghiệm học tập và luyện thi thông minh cùng AI.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
