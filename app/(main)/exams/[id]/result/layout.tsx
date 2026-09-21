import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kết quả làm bài',
  description: 'Báo cáo chi tiết điểm số và phân tích kỹ năng làm bài thi trên ThinkAI Lumina.',
};

export default function ExamResultLayout({ children }: { children: React.ReactNode }) {
  return children;
}
