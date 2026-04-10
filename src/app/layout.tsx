import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UpMind Feedback',
  description: 'Hệ thống nhận xét học sinh UpMind',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="text-base font-semibold text-gray-900 tracking-tight">
              UpMind
            </a>
            <div className="flex gap-1">
              <a
                href="/feedback"
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Nhận xét
              </a>
              <a
                href="/dashboard"
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/students"
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Học sinh
              </a>
            </div>
          </div>
        </nav>
        <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
