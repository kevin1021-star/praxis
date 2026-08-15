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

    // 3D Dark Silk Ribbon Wave Parameters (Matching Reference Image)
    let step = 0;
    const ribbonCount = 9;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      step += 0.008;

      // Deep void background base
      ctx.fillStyle = '#05070d';
      ctx.fillRect(0, 0, width, height);

      // Draw multi-layered 3D obsidian silk ribbons
      for (let i = 0; i < ribbonCount; i++) {
        const offsetPct = i / ribbonCount;
        const baseY = height * (0.25 + offsetPct * 0.55);
        const waveAmp = 50 + i * 8;
        const freq = 0.003 - i * 0.00015;
        const phase = step + i * 0.4;

        ctx.beginPath();
        ctx.moveTo(0, height);

        // Render smooth 3D bezier ribbon curve
        for (let x = 0; x <= width; x += 10) {
          const y = baseY + Math.sin(x * freq + phase) * waveAmp + Math.cos(x * 0.0015 + step * 0.6 + i) * 25;
          if (x === 0) {
            ctx.lineTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        // 3D Ribbon Shadow Fill (Obsidian / Dark Slate gradient)
        const fillGrad = ctx.createLinearGradient(0, baseY - waveAmp, 0, height);
        const baseShade = Math.floor(12 + i * 4); // #0c101d to #20293d
        fillGrad.addColorStop(0, `rgb(${baseShade + 8}, ${baseShade + 12}, ${baseShade + 20})`);
        fillGrad.addColorStop(0.4, `rgb(${baseShade}, ${baseShade + 4}, ${baseShade + 10})`);
        fillGrad.addColorStop(1, '#05070d');
        ctx.fillStyle = fillGrad;
        ctx.fill();

        // Crisp Top-Edge Highlight Line (Silver / Subtle Emerald Specular Highlight)
        ctx.beginPath();
        for (let x = 0; x <= width; x += 10) {
          const y = baseY + Math.sin(x * freq + phase) * waveAmp + Math.cos(x * 0.0015 + step * 0.6 + i) * 25;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        const highlightAlpha = Math.max(0.08, 0.45 - i * 0.04);
        
        // Front ribbons get a subtle emerald energy sheen
        if (i === 3 || i === 4) {
          ctx.strokeStyle = `rgba(16, 185, 129, ${highlightAlpha * 0.7})`;
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 12;
        } else {
          ctx.strokeStyle = `rgba(226, 232, 240, ${highlightAlpha})`;
          ctx.shadowColor = '#94a3b8';
          ctx.shadowBlur = 6;
        }

        ctx.lineWidth = i === 0 ? 1.5 : 2.2 - i * 0.15;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

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
