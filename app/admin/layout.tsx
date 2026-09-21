import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mission Control',
  description: 'Trung tâm điều hành và giám sát hệ thống ThinkAI Lumina.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
