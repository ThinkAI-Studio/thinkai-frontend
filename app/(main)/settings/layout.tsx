import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cài đặt tài khoản',
  description: 'Tùy chỉnh cấu hình và bảo mật tài khoản ThinkAI Lumina.',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
