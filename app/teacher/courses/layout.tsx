import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý khóa học',
  description: 'Quản lý và biên tập nội dung khóa học dành cho Giảng viên trên ThinkAI Lumina.',
};

export default function TeacherCoursesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
