import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phòng thi trực tuyến',
  description: 'Phòng thi trực tuyến với đồng hồ bấm giờ và chấm điểm AI trên ThinkAI Lumina.',
};

export default function ExamRoomLayout({ children }: { children: React.ReactNode }) {
  return children;
}
