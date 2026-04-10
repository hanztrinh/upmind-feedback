'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { CRITERIA, Feedback } from '@/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const COLORS = ['#534AB7', '#0F6E56', '#D85A30', '#185FA5', '#D4537E'];

interface TrendChartProps {
  feedbacks: Feedback[];
}

export default function TrendChart({ feedbacks }: TrendChartProps) {
  const sorted = [...feedbacks].sort(
    (a, b) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime()
  );

  const labels = sorted.map((f) => {
    const d = new Date(f.session_date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  const data = {
    labels,
    datasets: CRITERIA.map((c, i) => ({
      label: c.label,
      data: sorted.map((f) => f[c.key]),
      borderColor: COLORS[i],
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: COLORS[i],
      tension: 0.3,
      fill: false,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 1,
        max: 5,
        ticks: { stepSize: 1, color: '#888', font: { size: 11 } },
        grid: { color: 'rgba(0,0,0,0.06)' },
      },
      x: {
        ticks: { color: '#888', font: { size: 11 } },
        grid: { display: false },
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#666',
          font: { size: 11 },
          boxWidth: 10,
          padding: 10,
        },
      },
    },
  };

  return (
    <div className="h-[220px]">
      <Line data={data} options={options} />
    </div>
  );
}
