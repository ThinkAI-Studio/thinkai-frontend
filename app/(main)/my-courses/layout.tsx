import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Khóa học của tôi',
  description: 'Theo dõi tiến độ và khóa học đã đăng ký trên ThinkAI Lumina.',
};

export default function MyCoursesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
