# UpMind Feedback

Hệ thống nhận xét học sinh & CRM cho trung tâm UpMind.

## Tính năng

### 1. Nhận xét buổi học (`/feedback`)
- Giáo viên chọn học sinh, chấm 5 tiêu chí bằng tap nhanh (1-5)
- 5 tiêu chí: Hiểu bài, Tự làm bài, Thái độ, Chuyên cần, Tương tác
- Mỗi mức điểm có mô tả cụ thể → GV không cần suy nghĩ
- Ghi chú text tuỳ chọn
- Tự động chuyển sang HS tiếp sau khi lưu
- Thời gian nhập: ~15-20 giây/HS

### 2. Dashboard phụ huynh (`/dashboard`)
- Điểm buổi gần nhất + xu hướng (↑↓→)
- Biểu đồ radar: buổi mới nhất vs trung bình
- Biểu đồ line: xu hướng qua nhiều buổi
- Nhận xét text của giáo viên
- **Thiết kế tối ưu cho chụp màn hình gửi Zalo**

### 3. Quản lý học sinh (`/students`)
- CRUD học sinh: tên, môn, lớp, GV
- Thông tin phụ huynh: tên, SĐT, Zalo
- Tìm kiếm nhanh
- Đánh dấu nghỉ/kích hoạt
- Thống kê tổng quan

## Tech Stack
- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **Backend/DB**: Supabase (PostgreSQL + REST API)
- **Charts**: Chart.js + react-chartjs-2
- **Deploy**: Vercel

## Setup

### 1. Tạo Supabase project
- Vào [supabase.com](https://supabase.com) → New project
- Chạy file `supabase-schema.sql` trong SQL Editor

### 2. Cấu hình env
```bash
cp .env.local.example .env.local
# Sửa NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 3. Chạy local
```bash
npm install
npm run dev
```

### 4. Deploy lên Vercel
```bash
npx vercel
# Thêm env variables trong Vercel dashboard
```

## Cấu trúc thư mục
```
src/
├── app/
│   ├── page.tsx              # Trang chủ
│   ├── layout.tsx            # Layout + nav
│   ├── feedback/page.tsx     # GV nhập nhận xét
│   ├── dashboard/page.tsx    # Dashboard PH
│   └── students/page.tsx     # Quản lý HS
├── components/
│   ├── FeedbackForm.tsx      # Form nhập 5 tiêu chí
│   ├── ParentDashboard.tsx   # Dashboard tổng hợp
│   ├── RadarChart.tsx        # Biểu đồ radar
│   ├── TrendChart.tsx        # Biểu đồ xu hướng
│   ├── RatingPills.tsx       # UI chấm điểm 1-5
│   └── StudentManager.tsx    # CRM quản lý HS
├── lib/
│   └── supabase.ts           # Supabase client
└── types/
    └── index.ts              # TypeScript types + criteria config
```
