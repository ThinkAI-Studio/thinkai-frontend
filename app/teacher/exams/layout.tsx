import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý đề thi',
  description: 'Tạo và quản lý các kỳ thi, bài luyện thi trực tuyến trên ThinkAI Lumina.',
};

export default function TeacherExamsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
