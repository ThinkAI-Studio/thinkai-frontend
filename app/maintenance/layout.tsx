import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thông Báo Tạm Dừng Hoạt Động | ThinkAI Lumina',
  description: 'Nền tảng ThinkAI hiện đang tạm dừng hoạt động để bảo trì và nâng cấp cơ sở hạ tầng dịch vụ.',
};

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
