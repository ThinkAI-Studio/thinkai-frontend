import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Luyện thi TOEIC & IELTS',
  description: 'Hệ thống đề thi thử TOEIC và IELTS thông minh với chấm điểm tức thì trên ThinkAI Lumina.',
};

export default function ExamsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
