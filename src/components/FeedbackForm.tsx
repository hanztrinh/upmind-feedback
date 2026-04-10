'use client';

import { useState, useEffect, useRef } from 'react';
import { getSupabase } from '@/lib/supabase';
import { Student, FeedbackInput, CRITERIA, CriteriaKey } from '@/types';
import RatingPills from './RatingPills';

export default function FeedbackForm() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [scores, setScores] = useState<Record<CriteriaKey, number>>({
    comprehension: 0,
    independence: 0,
    attitude: 0,
    attendance: 0,
    interaction: 0,
  });
  const [note, setNote] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const startTime = useRef(Date.now());

  useEffect(() => {
    loadStudents();
    const saved = localStorage.getItem('upmind_teacher');
    if (saved) setTeacherName(saved);
  }, []);

  async function loadStudents() {
    const { data } = await getSupabase()
      .from('students')
      .select('*')
      .eq('is_active', true)
      .order('name');
    if (data) {
      setStudents(data);
      if (data.length > 0) setSelectedId(data[0].id);
    }
  }

  const selectedStudent = students.find((s) => s.id === selectedId);
  const allRated = Object.values(scores).every((v) => v > 0);

  function resetForm() {
    setScores({
      comprehension: 0,
      independence: 0,
      attitude: 0,
      attendance: 0,
      interaction: 0,
    });
    setNote('');
    startTime.current = Date.now();
  }

  async function handleSave() {
    if (!selectedStudent || !allRated) return;
    setSaving(true);

    localStorage.setItem('upmind_teacher', teacherName);

    const elapsed = Math.round((Date.now() - startTime.current) / 1000);

    const input: FeedbackInput = {
      student_id: selectedStudent.id,
      session_number: selectedStudent.total_sessions + 1,
      session_date: new Date().toISOString().split('T')[0],
      ...scores,
      note: note.trim(),
      teacher_name: teacherName.trim(),
    };

    const { error } = await getSupabase().from('feedbacks').insert(input);

    if (error) {
      setToast('Lỗi: ' + error.message);
    } else {
      // Increment total_sessions
      await getSupabase()
        .from('students')
        .update({ total_sessions: selectedStudent.total_sessions + 1 })
        .eq('id', selectedStudent.id);

      setToast(`Đã lưu (${elapsed}s) — chuyển HS tiếp`);
      resetForm();
      loadStudents();

      // Auto-advance to next student
      const idx = students.findIndex((s) => s.id === selectedId);
      if (idx < students.length - 1) {
        setSelectedId(students[idx + 1].id);
      }
    }

    setSaving(false);
    setTimeout(() => setToast(''), 3000);
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Teacher name */}
      <div className="mb-4">
        <label className="block text-xs text-gray-500 mb-1">Giáo viên</label>
        <input
          type="text"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
          placeholder="Tên GV..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Student selector */}
      <div className="mb-4">
        <label className="block text-xs text-gray-500 mb-1">Học sinh</label>
        <select
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            resetForm();
          }}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.subject} {s.grade}
            </option>
          ))}
        </select>
      </div>

      {/* Criteria */}
      <div className="space-y-3">
        {CRITERIA.map((c) => (
          <div key={c.key} className="bg-gray-50 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-800">{c.label}</span>
              <span className="text-xs text-gray-500">
                {scores[c.key] > 0 ? c.descriptions[scores[c.key] - 1] : 'Chọn mức'}
              </span>
            </div>
            <RatingPills
              value={scores[c.key]}
              descriptions={c.descriptions}
              onChange={(val) => setScores((prev) => ({ ...prev, [c.key]: val }))}
            />
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="mt-4">
        <label className="block text-xs text-gray-500 mb-1">Ghi chú (tuỳ chọn)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="VD: Cần luyện thêm đồ thị..."
          rows={2}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={!allRated || saving}
        className={`
          w-full mt-4 py-2.5 rounded-xl text-sm font-medium transition-all
          ${allRated
            ? 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] cursor-pointer'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        {saving ? 'Đang lưu...' : 'Lưu nhận xét'}
      </button>

      {/* Toast */}
      {toast && (
        <div className={`mt-3 text-center text-sm ${toast.startsWith('Lỗi') ? 'text-red-600' : 'text-green-600'}`}>
          {toast}
        </div>
      )}
    </div>
  );
}
