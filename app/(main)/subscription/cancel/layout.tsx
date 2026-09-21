import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng ký gói thành viên đã hủy',
  description: 'Thao tác đăng ký gói thành viên Lumina Pro đã được hủy.',
};

export default function SubscriptionCancelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
