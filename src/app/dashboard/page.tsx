'use client';

import dynamic from 'next/dynamic';

const ParentDashboard = dynamic(() => import('@/components/ParentDashboard'), { ssr: false });

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 mb-1">Dashboard phụ huynh</h1>
      <p className="text-sm text-gray-500 mb-6">Chọn học sinh để xem tiến bộ — chụp màn hình gửi Zalo</p>
      <ParentDashboard />
    </div>
  );
}
