import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thanh toán chưa hoàn tất',
  description: 'Giao dịch thanh toán chưa được hoàn tất trên ThinkAI Lumina.',
};

export default function PaymentCancelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
