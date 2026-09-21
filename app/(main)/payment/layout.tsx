import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bảng giá & Đăng ký',
  description: 'Bảng giá dịch vụ và các gói khóa học ThinkAI Lumina.',
};

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
