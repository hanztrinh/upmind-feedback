'use client';

import dynamic from 'next/dynamic';

const StudentManager = dynamic(() => import('@/components/StudentManager'), { ssr: false });

export default function StudentsPage() {
  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 mb-1">Quản lý học sinh</h1>
      <p className="text-sm text-gray-500 mb-6">Thêm, sửa, tìm kiếm thông tin học sinh & phụ huynh</p>
      <StudentManager />
    </div>
  );
}
