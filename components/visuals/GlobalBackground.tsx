'use client';

import { useEffect, useRef } from 'react';
import styles from './GlobalBackground.module.css';

export default function GlobalBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback on first user interaction if browser policy strictly enforces it
        const startPlay = () => {
          if (video) {
            video.muted = true;
            video.play().catch(() => {});
          }
          window.removeEventListener('click', startPlay);
          window.removeEventListener('touchstart', startPlay);
          window.removeEventListener('keydown', startPlay);
        };
        window.addEventListener('click', startPlay, { once: true });
        window.addEventListener('touchstart', startPlay, { once: true });
        window.addEventListener('keydown', startPlay, { once: true });
      });
    }
  }, []);

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
          type="video/mp4"
        />
      </video>
      <div className={styles.vignetteOverlay} />
    </div>
  );
}
