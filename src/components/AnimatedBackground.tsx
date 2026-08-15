'use client';

import React, { useEffect, useRef } from 'react';

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Wave parameters - Vivid, high-visibility energy waveforms
    let step = 0;
    const waveLayers = [
      {
        frequency: 0.007,
        amplitude: 60,
        speed: 0.02,
        offsetY: 0.35,
        strokeColor: 'rgba(16, 185, 129, 0.65)',
        glowColor: 'rgba(16, 185, 129, 0.9)',
        fillColor: 'rgba(16, 185, 129, 0.04)',
        lineWidth: 3.5
      },
      {
        frequency: 0.005,
        amplitude: 85,
        speed: 0.014,
        offsetY: 0.55,
        strokeColor: 'rgba(6, 182, 212, 0.6)',
        glowColor: 'rgba(6, 182, 212, 0.85)',
        fillColor: 'rgba(6, 182, 212, 0.03)',
        lineWidth: 3.0
      },
      {
        frequency: 0.009,
        amplitude: 45,
        speed: 0.025,
        offsetY: 0.75,
        strokeColor: 'rgba(59, 130, 246, 0.55)',
        glowColor: 'rgba(59, 130, 246, 0.8)',
        fillColor: 'rgba(59, 130, 246, 0.03)',
        lineWidth: 2.5
      }
    ];

    // Vivid energy sparks riding wave lines
    const sparkCount = 30;
    const sparks = Array.from({ length: sparkCount }, () => ({
      x: Math.random() * width,
      speed: 1.2 + Math.random() * 2.2,
      radius: 3 + Math.random() * 3,
      layerIdx: Math.floor(Math.random() * waveLayers.length)
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      step += 1;

      // 1. Draw Vivid Wave Layers with Filled Gradients & Glow
      waveLayers.forEach((wave) => {
        const baseCenterY = height * wave.offsetY;

        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 3) {
          const y = baseCenterY + Math.sin(x * wave.frequency + step * wave.speed) * wave.amplitude + Math.cos(x * 0.002 + step * 0.008) * 20;
          if (x === 0) {
            ctx.lineTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        // Fill below wave
        ctx.fillStyle = wave.fillColor;
        ctx.fill();

        // Draw Wave Stroke Line
        ctx.beginPath();
        for (let x = 0; x <= width; x += 3) {
          const y = baseCenterY + Math.sin(x * wave.frequency + step * wave.speed) * wave.amplitude + Math.cos(x * 0.002 + step * 0.008) * 20;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = wave.strokeColor;
        ctx.lineWidth = wave.lineWidth;
        ctx.shadowColor = wave.glowColor;
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // 2. Draw Bright Glowing Sparks Travelling Across Waves
      sparks.forEach((spark) => {
        spark.x += spark.speed;
        if (spark.x > width) spark.x = -10;

        const wave = waveLayers[spark.layerIdx];
        const baseCenterY = height * wave.offsetY;
        const sparkY = baseCenterY + Math.sin(spark.x * wave.frequency + step * wave.speed) * wave.amplitude + Math.cos(spark.x * 0.002 + step * 0.008) * 20;

        ctx.beginPath();
        ctx.arc(spark.x, sparkY, spark.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#6ee7b7';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-100"
    />
  );
};
