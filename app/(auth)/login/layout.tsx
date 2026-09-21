import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng nhập',
  description: 'Đăng nhập vào ThinkAI Lumina để tiếp tục hành trình học tập và luyện thi.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
