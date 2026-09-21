import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đặt lại mật khẩu',
  description: 'Đặt lại mật khẩu bảo mật tài khoản ThinkAI Lumina.',
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
