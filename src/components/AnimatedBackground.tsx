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

    // Wave parameters
    let step = 0;
    const waveLayers = [
      {
        frequency: 0.008,
        amplitude: 45,
        speed: 0.015,
        offsetY: 0.45,
        color: 'rgba(16, 185, 129, 0.12)',
        glow: 'rgba(16, 185, 129, 0.3)',
        lineWidth: 2.5
      },
      {
        frequency: 0.006,
        amplitude: 65,
        speed: 0.01,
        offsetY: 0.55,
        color: 'rgba(6, 182, 212, 0.1)',
        glow: 'rgba(6, 182, 212, 0.25)',
        lineWidth: 2.0
      },
      {
        frequency: 0.012,
        amplitude: 35,
        speed: 0.02,
        offsetY: 0.65,
        color: 'rgba(59, 130, 246, 0.08)',
        glow: 'rgba(59, 130, 246, 0.2)',
        lineWidth: 1.5
      }
    ];

    // Floating energy sparks riding the waves
    const sparkCount = 20;
    const sparks = Array.from({ length: sparkCount }, () => ({
      x: Math.random() * width,
      speed: 0.8 + Math.random() * 1.5,
      radius: 1.5 + Math.random() * 2,
      layerIdx: Math.floor(Math.random() * waveLayers.length)
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      step += 1;

      // 1. Draw Flowing Electrical Wave Layers
      waveLayers.forEach((wave) => {
        ctx.beginPath();
        const baseCenterY = height * wave.offsetY;

        for (let x = 0; x <= width; x += 4) {
          const y = baseCenterY + Math.sin(x * wave.frequency + step * wave.speed) * wave.amplitude + Math.cos(x * 0.003 + step * 0.005) * 15;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = wave.color;
        ctx.lineWidth = wave.lineWidth;
        ctx.shadowColor = wave.glow;
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // 2. Draw Particles Riding Wave Lines
      sparks.forEach((spark) => {
        spark.x += spark.speed;
        if (spark.x > width) spark.x = -10;

        const wave = waveLayers[spark.layerIdx];
        const baseCenterY = height * wave.offsetY;
        const sparkY = baseCenterY + Math.sin(spark.x * wave.frequency + step * wave.speed) * wave.amplitude;

        ctx.beginPath();
        ctx.arc(spark.x, sparkY, spark.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 15;
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
      className="fixed inset-0 pointer-events-none z-0 opacity-90"
    />
  );
};
