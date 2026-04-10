'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { CRITERIA } from '@/types';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface RadarChartProps {
  latest: number[];
  average: number[];
}

export default function RadarChart({ latest, average }: RadarChartProps) {
  const labels = CRITERIA.map((c) => c.label);

  const data = {
    labels,
    datasets: [
      {
        label: 'Buổi mới nhất',
        data: latest,
        borderColor: '#534AB7',
        backgroundColor: 'rgba(83, 74, 183, 0.1)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#534AB7',
      },
      {
        label: 'Trung bình',
        data: average,
        borderColor: '#0F6E56',
        backgroundColor: 'rgba(15, 110, 86, 0.06)',
        borderWidth: 1.5,
        borderDash: [5, 3],
        pointRadius: 3,
        pointBackgroundColor: '#0F6E56',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          color: '#888',
          font: { size: 11 },
          backdropColor: 'transparent',
        },
        grid: { color: 'rgba(0,0,0,0.06)' },
        angleLines: { color: 'rgba(0,0,0,0.06)' },
        pointLabels: {
          color: '#555',
          font: { size: 13 },
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#666',
          font: { size: 12 },
          boxWidth: 12,
          padding: 16,
        },
      },
    },
  };

  return (
    <div className="max-w-[300px] mx-auto">
      <Radar data={data} options={options} />
    </div>
  );
}
