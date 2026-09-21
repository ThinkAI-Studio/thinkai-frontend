import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ngân hàng câu hỏi',
  description: 'Quản trị và phân loại ngân hàng câu hỏi trắc nghiệm trên ThinkAI Lumina.',
};

export default function TeacherQuestionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
