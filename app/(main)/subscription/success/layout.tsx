import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng ký thành viên thành công',
  description: 'Chúc mừng bạn đã nâng cấp thành công gói thành viên Lumina Pro trên ThinkAI Lumina.',
};

export default function SubscriptionSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
