'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import { Student } from '@/types';

export default function StudentManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '',
    subject: '',
    grade: 9,
    parent_name: '',
    parent_phone: '',
    parent_zalo: '',
    teacher_name: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    const { data } = await getSupabase()
      .from('students')
      .select('*')
      .order('name');
    if (data) setStudents(data);
  }

  function resetForm() {
    setForm({
      name: '',
      subject: '',
      grade: 9,
      parent_name: '',
      parent_phone: '',
      parent_zalo: '',
      teacher_name: '',
    });
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(s: Student) {
    setForm({
      name: s.name,
      subject: s.subject,
      grade: s.grade,
      parent_name: s.parent_name || '',
      parent_phone: s.parent_phone || '',
      parent_zalo: s.parent_zalo || '',
      teacher_name: s.teacher_name || '',
    });
    setEditingId(s.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name || !form.subject) return;
    setSaving(true);

    if (editingId) {
      await getSupabase().from('students').update(form).eq('id', editingId);
    } else {
      await getSupabase().from('students').insert(form);
    }

    setSaving(false);
    resetForm();
    loadStudents();
  }

  async function toggleActive(s: Student) {
    await getSupabase()
      .from('students')
      .update({ is_active: !s.is_active })
      .eq('id', s.id);
    loadStudents();
  }

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.subject.toLowerCase().includes(search.toLowerCase()) ||
      s.parent_name?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = students.filter((s) => s.is_active).length;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="text-xl font-semibold">{students.length}</div>
          <div className="text-xs text-gray-500">Tổng HS</div>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <div className="text-xl font-semibold text-green-700">{activeCount}</div>
          <div className="text-xs text-gray-500">Đang học</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="text-xl font-semibold">{students.length - activeCount}</div>
          <div className="text-xs text-gray-500">Nghỉ</div>
        </div>
      </div>

      {/* Search + Add */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên, môn, phụ huynh..."
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:scale-[0.98] cursor-pointer"
        >
          + Thêm
        </button>
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 space-y-3">
          <div className="text-sm font-medium text-gray-700 mb-1">
            {editingId ? 'Sửa thông tin' : 'Thêm học sinh mới'}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Họ tên *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <input
              placeholder="Môn học *"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <select
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: Number(e.target.value) })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {[6, 7, 8, 9, 10, 11, 12].map((g) => (
                <option key={g} value={g}>
                  Lớp {g}
                </option>
              ))}
            </select>
            <input
              placeholder="Tên GV"
              value={form.teacher_name}
              onChange={(e) => setForm({ ...form, teacher_name: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <input
              placeholder="Tên phụ huynh"
              value={form.parent_name}
              onChange={(e) => setForm({ ...form, parent_name: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <input
              placeholder="SĐT phụ huynh"
              value={form.parent_phone}
              onChange={(e) => setForm({ ...form, parent_phone: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <input
            placeholder="Zalo phụ huynh"
            value={form.parent_zalo}
            onChange={(e) => setForm({ ...form, parent_zalo: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={!form.name || !form.subject || saving}
              className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer"
            >
              {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Thêm'}
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              Huỷ
            </button>
          </div>
        </div>
      )}

      {/* Student list */}
      <div className="space-y-2">
        {filtered.map((s) => (
          <div
            key={s.id}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
              s.is_active
                ? 'bg-white border-gray-100 hover:border-gray-200'
                : 'bg-gray-50 border-gray-100 opacity-60'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-700 font-medium text-sm flex-shrink-0">
              {s.name.split(' ').slice(-1)[0]?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{s.name}</div>
              <div className="text-xs text-gray-500">
                {s.subject} {s.grade} · {s.parent_name || 'Chưa có PH'} · {s.total_sessions} buổi
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => startEdit(s)}
                className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer"
              >
                Sửa
              </button>
              <button
                onClick={() => toggleActive(s)}
                className={`px-2 py-1 text-xs rounded-md cursor-pointer ${
                  s.is_active
                    ? 'text-red-500 hover:bg-red-50'
                    : 'text-green-600 hover:bg-green-50'
                }`}
              >
                {s.is_active ? 'Nghỉ' : 'Kích hoạt'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
