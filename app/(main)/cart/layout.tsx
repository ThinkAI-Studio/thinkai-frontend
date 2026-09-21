import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giỏ hàng',
  description: 'Giỏ hàng khóa học trên ThinkAI Lumina.',
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
