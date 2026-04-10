import Link from 'next/link';

export default function Home() {
  return (
    <div className="py-12 text-center space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">UpMind Feedback</h1>
        <p className="text-sm text-gray-500">Hệ thống nhận xét & quản lý học sinh</p>
      </div>

      <div className="grid gap-3 max-w-sm mx-auto">
        <Link
          href="/feedback"
          className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 text-lg">
            ✎
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-gray-900">Nhận xét buổi học</div>
            <div className="text-xs text-gray-500">Giáo viên nhập đánh giá nhanh</div>
          </div>
        </Link>

        <Link
          href="/dashboard"
          className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 text-lg">
            ◉
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-gray-900">Dashboard phụ huynh</div>
            <div className="text-xs text-gray-500">Xem tiến bộ & chụp gửi Zalo</div>
          </div>
        </Link>

        <Link
          href="/students"
          className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-lg">
            ♟
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-gray-900">Quản lý học sinh</div>
            <div className="text-xs text-gray-500">CRM: thông tin HS & phụ huynh</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
