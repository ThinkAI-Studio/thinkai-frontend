import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chi tiết khóa học',
  description: 'Thông tin chi tiết và giáo trình khóa học trên ThinkAI Lumina.',
};

export default function CourseDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
