'use client';

import { useState } from 'react';
import styles from './CognitiveRadarChart.module.css';

interface SkillAxis {
  label: string;
  score: number;
  max: number;
  recommendation: string;
}

const AXES: SkillAxis[] = [
  { label: 'Ngữ Pháp (Grammar)', score: 92, max: 100, recommendation: 'Nắm vững bàng thái cách & đảo ngữ. Cần chú ý mạo từ.' },
  { label: 'Từ Vựng (Lexical)', score: 84, max: 100, recommendation: 'Vốn từ chuyên ngành kinh doanh & báo cáo tài chính tốt.' },
  { label: 'Phát Âm & Nghe (Audio)', score: 88, max: 100, recommendation: 'Nghe tốt giọng US. Cần luyện thêm nối âm của giọng UK & AUS.' },
  { label: 'Đọc Hiểu (Inference)', score: 78, max: 100, recommendation: 'Tốc độ đọc câu hỏi đôi Part 7 cần tăng thêm 15%.' },
  { label: 'Tốc Độ & Nhịp (Pacing)', score: 95, max: 100, recommendation: 'Phân bổ thời gian xuất sắc: 45s/câu Part 5, 60s/câu Part 6.' },
];

export default function CognitiveRadarChart() {
  const [selectedAxis, setSelectedAxis] = useState<number | null>(0);

  const size = 300;
  const center = size / 2;
  const radius = 100;
  const total = AXES.length;

  const getCoordinates = (index: number, valueRatio: number) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const x = center + radius * valueRatio * Math.cos(angle);
    const y = center + radius * valueRatio * Math.sin(angle);
    return { x, y };
  };

  // Polygon points
  const points = AXES.map((axis, i) => {
    const { x, y } = getCoordinates(i, axis.score / axis.max);
    return `${x},${y}`;
  }).join(' ');

  // Grid levels (25%, 50%, 75%, 100%)
  const levels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.tag}>
          <span>BẢN ĐỒ NĂNG LỰC HỌC VIÊN · COGNITIVE RADAR</span>
        </div>
        <span className={styles.overallBadge}>TOEIC ƯỚC TÍNH: 865+</span>
      </div>

      <div className={styles.chartWrapper}>
        <svg width={size} height={size} className={styles.svg}>
          {/* Background web circles / polygons */}
          {levels.map((level, idx) => {
            const gridPoints = AXES.map((_, i) => {
              const { x, y } = getCoordinates(i, level);
              return `${x},${y}`;
            }).join(' ');
            return (
              <polygon
                key={idx}
                points={gridPoints}
                className={styles.gridPolygon}
              />
            );
          })}

          {/* Axes lines */}
          {AXES.map((_, i) => {
            const { x, y } = getCoordinates(i, 1.0);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                className={styles.gridLine}
              />
            );
          })}

          {/* Value Polygon */}
          <polygon points={points} className={styles.valuePolygon} />

          {/* Interactive Vertex Dots */}
          {AXES.map((axis, i) => {
            const { x, y } = getCoordinates(i, axis.score / axis.max);
            const isSelected = selectedAxis === i;
            return (
              <g key={i} onClick={() => setSelectedAxis(i)} className={styles.dotGroup}>
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 6 : 4}
                  className={`${styles.vertexDot} ${isSelected ? styles.vertexDotActive : ''}`}
                />
              </g>
            );
          })}
        </svg>

        <div className={styles.axisLabels}>
          {AXES.map((axis, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.axisTag} ${selectedAxis === i ? styles.axisTagActive : ''}`}
              onClick={() => setSelectedAxis(i)}
            >
              <span>{axis.label.split(' ')[0]}</span>
              <strong>{axis.score}%</strong>
            </button>
          ))}
        </div>
      </div>

      {selectedAxis !== null && (
        <div className={styles.insightBox}>
          <div className={styles.insightHeader}>
            <strong>{AXES[selectedAxis].label}</strong>
            <span className={styles.insightScore}>{AXES[selectedAxis].score}/100</span>
          </div>
          <p className={styles.insightText}>{AXES[selectedAxis].recommendation}</p>
        </div>
      )}
    </div>
  );
}
