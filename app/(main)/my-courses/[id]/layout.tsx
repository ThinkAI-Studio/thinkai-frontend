import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nội dung khóa học',
  description: 'Nội dung chi tiết và bài học của khóa học trên ThinkAI Lumina.',
};

export default function MyCourseDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
