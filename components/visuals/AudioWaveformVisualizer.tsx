'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './AudioWaveformVisualizer.module.css';

interface AccentOption {
  code: string;
  name: string;
  speed: string;
}

const ACCENTS: AccentOption[] = [
  { code: 'US', name: 'US (American Standard)', speed: '1.0x' },
  { code: 'UK', name: 'UK (British RP)', speed: '0.95x' },
  { code: 'AUS', name: 'AUS (Australian)', speed: '1.05x' },
];

export default function AudioWaveformVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAccent, setSelectedAccent] = useState('US');
  const [playbackTime, setPlaybackTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const barCount = 36;
    const heights = Array.from({ length: barCount }, (_, i) => Math.sin((i / barCount) * Math.PI) * 24 + 6);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / (barCount * 1.5);
      const gap = barWidth * 0.5;

      for (let i = 0; i < barCount; i++) {
        let barHeight = heights[i];
        if (isPlaying) {
          barHeight = heights[i] + Math.sin(phase + i * 0.35) * 16 + Math.cos(phase * 0.8 + i * 0.2) * 8;
        }

        barHeight = Math.max(4, Math.min(barHeight, height - 6));
        const x = i * (barWidth + gap) + gap;
        const y = (height - barHeight) / 2;

        ctx.fillStyle = isPlaying ? '#E15B45' : 'rgba(225, 91, 69, 0.4)';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      if (isPlaying) {
        phase += 0.15;
      }
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= 14) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.tag}>
          <span>TOEIC LISTENING PART 2 · AUDIO ENGINE</span>
        </div>
        <div className={styles.accentTabs}>
          {ACCENTS.map((acc) => (
            <button
              key={acc.code}
              type="button"
              className={`${styles.accentTab} ${selectedAccent === acc.code ? styles.accentActive : ''}`}
              onClick={() => setSelectedAccent(acc.code)}
            >
              {acc.code}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.waveformBox}>
        <canvas ref={canvasRef} width={420} height={64} className={styles.canvas} />
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.playBtn} onClick={togglePlay}>
          {isPlaying ? '⏸ Dừng' : '▶ Nghe mẫu audio'}
        </button>
        <span className={styles.timer}>
          {formatSeconds(playbackTime)} / 00:14 ({selectedAccent} Accent)
        </span>
      </div>

      <div className={styles.transcript}>
        <strong>Transcript:</strong> "Where should we store the extra marketing brochures for next week's seminar?"
      </div>
    </div>
  );
}
