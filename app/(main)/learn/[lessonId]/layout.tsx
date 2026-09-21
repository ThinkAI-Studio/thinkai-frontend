import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phòng học bài giảng',
  description: 'Không gian học tập tương tác với trợ lý gia sư AI BiliBily trên ThinkAI Lumina.',
};

export default function LearnRoomLayout({ children }: { children: React.ReactNode }) {
  return children;
}
