'use client';

import { useState } from 'react';

interface RatingPillsProps {
  value: number;
  descriptions: readonly string[];
  onChange: (val: number) => void;
}

const pillColors: Record<number, string> = {
  1: 'bg-red-50 text-red-800 border-red-200',
  2: 'bg-amber-50 text-amber-800 border-amber-200',
  3: 'bg-blue-50 text-blue-800 border-blue-200',
  4: 'bg-green-50 text-green-800 border-green-200',
  5: 'bg-teal-50 text-teal-800 border-teal-200',
};

export default function RatingPills({ value, descriptions, onChange }: RatingPillsProps) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`
            w-11 h-9 rounded-lg border text-sm font-medium transition-all duration-150
            active:scale-95 cursor-pointer
            ${value === v
              ? pillColors[v]
              : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
            }
          `}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
