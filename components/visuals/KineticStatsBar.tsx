'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './KineticStatsBar.module.css';

interface StatMetric {
  prefix?: string;
  target: number;
  suffix: string;
  decimals: number;
  label: string;
  sublabel: string;
}

const STATS: StatMetric[] = [
  { prefix: '< ', target: 12, suffix: 'ms', decimals: 0, label: 'Inference Latency', sublabel: 'Redis Semantic Match' },
  { prefix: '', target: 99.9, suffix: '%', decimals: 1, label: 'Platform Uptime', sublabel: 'K3s GitOps Auto-Healing' },
  { prefix: '', target: 8, suffix: '-State', decimals: 0, label: 'AI Harness Pipeline', sublabel: 'Pedagogical Critic' },
  { prefix: '', target: 100, suffix: 'k+', decimals: 0, label: 'Exam Bank Questions', sublabel: 'TOEIC & IELTS Standard' },
];

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

export default function KineticStatsBar() {
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          const duration = 1600;
          const startTime = performance.now();

          const update = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = easeOutCubic(progress);

            setCounts(STATS.map((s) => s.target * eased));

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              setCounts(STATS.map((s) => s.target));
            }
          };

          requestAnimationFrame(update);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.statsContainer} ref={containerRef}>
      {STATS.map((stat, i) => (
        <div key={i} className={styles.statBox}>
          <div className={styles.statValue}>
            <span className={styles.prefix}>{stat.prefix}</span>
            <span className={styles.number}>
              {stat.decimals > 0
                ? counts[i].toFixed(stat.decimals)
                : Math.round(counts[i])}
            </span>
            <span className={styles.suffix}>{stat.suffix}</span>
          </div>
          <div className={styles.statLabel}>{stat.label}</div>
          <div className={styles.statSublabel}>{stat.sublabel}</div>
        </div>
      ))}
    </div>
  );
}
