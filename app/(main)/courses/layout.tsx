import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Khóa học',
  description: 'Khám phá danh mục khóa học tiếng Anh và luyện thi trên ThinkAI Lumina.',
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
