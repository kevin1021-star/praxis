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
    const ribbonCount = 10;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      step += 0.009;

      // Dark obsidian background base
      ctx.fillStyle = '#05070e';
      ctx.fillRect(0, 0, width, height);

      // Render 3D silk ribbons flowing diagonally from top right to bottom left (Matching Image)
      for (let i = 0; i < ribbonCount; i++) {
        const offsetPct = i / ribbonCount;
        const baseY = height * (0.15 + offsetPct * 0.65);
        const waveAmp = 65 + i * 10;
        const freq = 0.0028 - i * 0.00012;
        const phase = step + i * 0.35;

        // Draw Ribbon Body
        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 8) {
          const y = baseY + Math.sin(x * freq + phase) * waveAmp + Math.cos(x * 0.0018 + step * 0.5 + i) * 30;
          if (x === 0) {
            ctx.lineTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        // 3D Gradient Shading: Dark slate to deep obsidian shadow
        const fillGrad = ctx.createLinearGradient(0, baseY - waveAmp, 0, height);
        const lightShade = Math.floor(25 + i * 6); // Metallic slate gradient
        const darkShade = Math.floor(10 + i * 2);
        fillGrad.addColorStop(0, `rgb(${lightShade + 15}, ${lightShade + 22}, ${lightShade + 32})`);
        fillGrad.addColorStop(0.3, `rgb(${lightShade}, ${lightShade + 5}, ${lightShade + 12})`);
        fillGrad.addColorStop(1, `rgb(${darkShade}, ${darkShade + 2}, ${darkShade + 6})`);
        ctx.fillStyle = fillGrad;
        ctx.fill();

        // Specular Edge Highlight Stroke (Bright Metallic Silver / Emerald Rim Lighting)
        ctx.beginPath();
        for (let x = 0; x <= width; x += 8) {
          const y = baseY + Math.sin(x * freq + phase) * waveAmp + Math.cos(x * 0.0018 + step * 0.5 + i) * 30;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        const highlightAlpha = Math.max(0.2, 0.75 - i * 0.05);

        if (i === 3 || i === 4) {
          // Highlight active energy wave with subtle glowing emerald rim
          ctx.strokeStyle = `rgba(52, 211, 153, ${highlightAlpha})`;
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 16;
        } else {
          // Pure metallic silver ribbon crest highlight (Matching reference photo)
          ctx.strokeStyle = `rgba(241, 245, 249, ${highlightAlpha})`;
          ctx.shadowColor = '#cbd5e1';
          ctx.shadowBlur = 8;
        }

        ctx.lineWidth = 2.8 - i * 0.18;
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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};
