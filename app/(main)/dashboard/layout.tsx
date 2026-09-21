import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bảng điều khiển',
  description: 'Bảng điều khiển học tập cá nhân hóa trên ThinkAI Lumina.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
