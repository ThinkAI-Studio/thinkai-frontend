'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './NeuralGraphCanvas.module.css';

interface NeuralGraphProps {
  interactive?: boolean;
}

export default function NeuralGraphCanvas({ interactive = true }: NeuralGraphProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle nodes data
    const nodeCount = 75;
    const maxDistance = 65;
    const positions = new Float32Array(nodeCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];

    const spreadX = 240;
    const spreadY = 150;
    const spreadZ = 130;

    for (let i = 0; i < nodeCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spreadX;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spreadZ;

      velocities.push({
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.2,
        z: (Math.random() - 0.5) * 0.2,
      });
    }

    // Node Points Mesh
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(225, 91, 69, 1)');
      gradient.addColorStop(0.5, 'rgba(225, 91, 69, 0.6)');
      gradient.addColorStop(1, 'rgba(225, 91, 69, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const pointsMaterial = new THREE.PointsMaterial({
      size: 6,
      map: texture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pointCloud = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(pointCloud);

    // Dynamic Connecting Lines
    const linesGeometry = new THREE.BufferGeometry();
    const maxLineSegments = nodeCount * nodeCount;
    const linePositions = new Float32Array(maxLineSegments * 6);
    const lineColors = new Float32Array(maxLineSegments * 6);

    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const linesMaterial = new THREE.LineSegments(
      linesGeometry,
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    scene.add(linesMaterial);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x * 0.45;
      mouseY = y * 0.45;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const posAttr = pointsGeometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < nodeCount; i++) {
        posArray[i * 3] += velocities[i].x;
        posArray[i * 3 + 1] += velocities[i].y;
        posArray[i * 3 + 2] += velocities[i].z;

        if (Math.abs(posArray[i * 3]) > spreadX / 2) velocities[i].x *= -1;
        if (Math.abs(posArray[i * 3 + 1]) > spreadY / 2) velocities[i].y *= -1;
        if (Math.abs(posArray[i * 3 + 2]) > spreadZ / 2) velocities[i].z *= -1;
      }
      posAttr.needsUpdate = true;

      let lineIndex = 0;
      let colorIndex = 0;

      for (let i = 0; i < nodeCount; i++) {
        const x1 = posArray[i * 3];
        const y1 = posArray[i * 3 + 1];
        const z1 = posArray[i * 3 + 2];

        for (let j = i + 1; j < nodeCount; j++) {
          const x2 = posArray[j * 3];
          const y2 = posArray[j * 3 + 1];
          const z2 = posArray[j * 3 + 2];

          const dx = x1 - x2;
          const dy = y1 - y2;
          const dz = z1 - z2;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.4;

            linePositions[lineIndex++] = x1;
            linePositions[lineIndex++] = y1;
            linePositions[lineIndex++] = z1;
            linePositions[lineIndex++] = x2;
            linePositions[lineIndex++] = y2;
            linePositions[lineIndex++] = z2;

            lineColors[colorIndex++] = 0.88 * alpha;
            lineColors[colorIndex++] = 0.35 * alpha;
            lineColors[colorIndex++] = 0.27 * alpha;
            lineColors[colorIndex++] = 0.88 * alpha;
            lineColors[colorIndex++] = 0.35 * alpha;
            lineColors[colorIndex++] = 0.27 * alpha;
          }
        }
      }

      linesGeometry.setDrawRange(0, lineIndex / 3);
      (linesGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (linesGeometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;

      targetRotationY += (mouseX - targetRotationY) * 0.05;
      targetRotationX += (mouseY - targetRotationX) * 0.05;

      pointCloud.rotation.y = targetRotationY + performance.now() * 0.00012;
      pointCloud.rotation.x = targetRotationX;
      linesMaterial.rotation.y = pointCloud.rotation.y;
      linesMaterial.rotation.x = pointCloud.rotation.x;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      linesGeometry.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [interactive]);

  return (
    <div className={styles.canvasContainer} ref={mountRef}>
      {/* Floating Telemetry HUD Badges */}
      <div className={styles.telemetryTag1}>
        <span className={styles.tagDot} />
        <span>[01/ROUTER] · 3.4ms Intent Match</span>
      </div>

      <div className={styles.telemetryTag2}>
        <span className={styles.tagDot} />
        <span>[02/CACHE] · 99.4% Hit Rate (Redis)</span>
      </div>

      <div className={styles.telemetryTag3}>
        <span className={styles.tagDot} />
        <span>[03/CRITIC] · Zero-Hallucination Verified</span>
      </div>

      <div className={styles.canvasBadge}>
        <span className={styles.pulseDot} />
        <span>3D Neural Knowledge Graph · Live WebGL</span>
      </div>
    </div>
  );
}
