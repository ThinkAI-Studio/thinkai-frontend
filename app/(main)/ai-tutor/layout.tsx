import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Tutor 24/7',
  description: 'Trò chuyện và học tiếng Anh cùng gia sư AI thông minh BiliBily trên ThinkAI Lumina.',
};

export default function AiTutorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
