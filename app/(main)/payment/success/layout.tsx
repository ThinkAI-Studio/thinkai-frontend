import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thanh toán thành công',
  description: 'Giao dịch đăng ký khóa học trên ThinkAI Lumina đã hoàn tất thành công.',
};

export default function PaymentSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
