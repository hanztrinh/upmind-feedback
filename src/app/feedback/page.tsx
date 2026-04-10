'use client';

import dynamic from 'next/dynamic';

const FeedbackForm = dynamic(() => import('@/components/FeedbackForm'), { ssr: false });

export default function FeedbackPage() {
  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 mb-1">Nhận xét buổi học</h1>
      <p className="text-sm text-gray-500 mb-6">Chọn học sinh và chấm 5 tiêu chí</p>
      <FeedbackForm />
    </div>
  );
}
