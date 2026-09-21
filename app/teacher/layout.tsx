import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cổng Giảng viên',
  description: 'Không gian quản lý khóa học, bài giảng và đề thi dành cho Giảng viên trên ThinkAI Lumina.',
};

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return children;
}
