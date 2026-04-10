export interface Student {
  id: string;
  name: string;
  subject: string;
  grade: number;
  parent_name: string | null;
  parent_phone: string | null;
  parent_zalo: string | null;
  teacher_name: string | null;
  total_sessions: number;
  is_active: boolean;
  created_at: string;
}

export interface Feedback {
  id: string;
  student_id: string;
  session_number: number;
  session_date: string;
  comprehension: number;
  independence: number;
  attitude: number;
  attendance: number;
  interaction: number;
  note: string | null;
  teacher_name: string | null;
  created_at: string;
}

export interface FeedbackInput {
  student_id: string;
  session_number: number;
  session_date: string;
  comprehension: number;
  independence: number;
  attitude: number;
  attendance: number;
  interaction: number;
  note: string;
  teacher_name: string;
}

export const CRITERIA = [
  {
    key: 'comprehension' as const,
    label: 'Hiểu bài',
    descriptions: ['Đang cố gắng', 'Cần hỗ trợ', 'Khá', 'Tốt', 'Xuất sắc'],
  },
  {
    key: 'independence' as const,
    label: 'Tự làm bài',
    descriptions: ['Chưa tự làm được', 'Cần gợi ý nhiều', 'Làm được 1 phần', 'Tự làm tốt', 'Hoàn toàn độc lập'],
  },
  {
    key: 'attitude' as const,
    label: 'Thái độ',
    descriptions: ['Không tập trung', 'Thụ động', 'Bình thường', 'Tích cực', 'Rất hăng hái'],
  },
  {
    key: 'attendance' as const,
    label: 'Chuyên cần',
    descriptions: ['Vắng', 'Trễ > 10ph', 'Đúng giờ', 'Đúng giờ + chuẩn bị', 'Đến sớm + sẵn sàng'],
  },
  {
    key: 'interaction' as const,
    label: 'Tương tác',
    descriptions: ['Không tham gia', 'Ít phát biểu', 'Trả lời khi hỏi', 'Chủ động hỏi', 'Hỏi + giúp bạn'],
  },
] as const;

export type CriteriaKey = typeof CRITERIA[number]['key'];
