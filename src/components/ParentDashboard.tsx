'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import { Student, Feedback, CRITERIA } from '@/types';
import RadarChart from './RadarChart';
import TrendChart from './TrendChart';

const BAR_COLORS = ['bg-purple-200', 'bg-teal-200', 'bg-orange-200', 'bg-blue-200', 'bg-pink-200'];

interface ParentDashboardProps {
  studentId?: string;
}

export default function ParentDashboard({ studentId }: ParentDashboardProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedId, setSelectedId] = useState(studentId || '');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (selectedId) loadFeedbacks(selectedId);
  }, [selectedId]);

  async function loadStudents() {
    const { data } = await getSupabase()
      .from('students')
      .select('*')
      .eq('is_active', true)
      .order('name');
    if (data && data.length > 0) {
      setStudents(data);
      if (!selectedId) setSelectedId(data[0].id);
    }
    setLoading(false);
  }

  async function loadFeedbacks(sid: string) {
    const { data } = await getSupabase()
      .from('feedbacks')
      .select('*')
      .eq('student_id', sid)
      .order('session_date', { ascending: false })
      .limit(10);
    if (data) setFeedbacks(data);
  }

  const student = students.find((s) => s.id === selectedId);
  const latest = feedbacks[0];
  const prev = feedbacks[1];

  // Compute averages
  const averages = CRITERIA.map((c) => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, f) => acc + f[c.key], 0);
    return Math.round((sum / feedbacks.length) * 10) / 10;
  });

  const latestScores = latest
    ? CRITERIA.map((c) => latest[c.key])
    : [0, 0, 0, 0, 0];

  const overallAvg =
    feedbacks.length > 0
      ? Math.round((averages.reduce((a, b) => a + b, 0) / averages.length) * 10) / 10
      : 0;

  function getTrend(key: typeof CRITERIA[number]['key']) {
    if (!latest || !prev) return 'flat';
    if (latest[key] > prev[key]) return 'up';
    if (latest[key] < prev[key]) return 'down';
    return 'flat';
  }

  const trendIcon = {
    up: '↑',
    down: '↓',
    flat: '→',
  };
  const trendColor = {
    up: 'text-green-600',
    down: 'text-red-500',
    flat: 'text-gray-400',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Student selector (for internal use — hide when sharing screenshot) */}
      {!studentId && (
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.subject} {s.grade}
            </option>
          ))}
        </select>
      )}

      {/* Header card */}
      {student && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-700 font-semibold text-base flex-shrink-0">
            {student.name.split(' ').slice(-1)[0]?.[0] || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900">{student.name}</div>
            <div className="text-xs text-gray-500 mt-0.5">
              {student.subject} {student.grade} · GV: {student.teacher_name} · Buổi{' '}
              {student.total_sessions}
            </div>
            {overallAvg > 0 && (
              <div className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-medium">
                ★ TB: {overallAvg} / 5
              </div>
            )}
          </div>
        </div>
      )}

      {feedbacks.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          Chưa có nhận xét nào cho học sinh này
        </div>
      ) : (
        <>
          {/* Latest scores */}
          {latest && (
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="text-xs font-medium text-gray-500 mb-3">
                Buổi gần nhất —{' '}
                {new Date(latest.session_date).toLocaleDateString('vi-VN')}
              </div>
              <div className="space-y-2.5">
                {CRITERIA.map((c, i) => {
                  const trend = getTrend(c.key);
                  const pct = Math.round((latest[c.key] / 5) * 100);
                  return (
                    <div key={c.key} className="flex items-center gap-2">
                      <span className="text-sm text-gray-700 w-24 flex-shrink-0">
                        {c.label}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${BAR_COLORS[i]} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-5 text-right">
                        {latest[c.key]}
                      </span>
                      <span className={`text-sm w-5 text-center ${trendColor[trend]}`}>
                        {trendIcon[trend]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Radar */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <div className="text-xs font-medium text-gray-500 mb-2">Tổng quan</div>
            <RadarChart latest={latestScores} average={averages} />
          </div>

          {/* Trend chart */}
          {feedbacks.length >= 2 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="text-xs font-medium text-gray-500 mb-2">
                Xu hướng {feedbacks.length} buổi gần nhất
              </div>
              <TrendChart feedbacks={feedbacks} />
            </div>
          )}

          {/* Teacher note */}
          {latest?.note && (
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="text-xs font-medium text-gray-500 mb-2">
                Nhận xét của giáo viên
              </div>
              <p className="text-sm text-gray-800 leading-relaxed">{latest.note}</p>
              <p className="text-xs text-gray-400 mt-2">
                {latest.teacher_name} ·{' '}
                {new Date(latest.session_date).toLocaleDateString('vi-VN')}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
