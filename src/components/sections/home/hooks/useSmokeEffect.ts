
import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  alpha: number;
  rotation: number;
  active: boolean;
}

interface UseSmokeEffectProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  containerRef: React.RefObject<HTMLElement | null>;
  maxParticles?: number;
  enabled?: boolean;
}

export const useSmokeEffect = ({
  canvasRef,
  containerRef,
  maxParticles = 80,
  enabled = true,
}: UseSmokeEffectProps) => {
  useEffect(() => {
    if (!enabled || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Object Pool
    const particlePool: Particle[] = new Array(maxParticles).fill(null).map(() => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 0,
      size: 0,
      alpha: 0,
      rotation: 0,
      active: false,
    }));

    let animationId: number;
    let frameCount = 0;
    let isVisible = true;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Puff Texture
    const puffSize = 200;
    const puffCanvas = document.createElement('canvas');
    puffCanvas.width = puffSize;
    puffCanvas.height = puffSize;
    const pCtx = puffCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(puffSize/2, puffSize/2, 0, puffSize/2, puffSize/2, puffSize/2);
      grad.addColorStop(0, "rgba(0, 60, 60, 0.4)"); 
      grad.addColorStop(0.3, "rgba(0, 30, 50, 0.2)"); 
      grad.addColorStop(0.7, "rgba(0, 15, 25, 0.05)"); 
      grad.addColorStop(1, "rgba(0, 0, 0, 0)"); 
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, puffSize, puffSize);
    }

    const spawnParticle = () => {
        // Find first inactive particle
        const p = particlePool.find(p => !p.active);
        if (p) {
            p.active = true;
            p.x = Math.random() * width;
            p.y = height + 150;
            p.vx = (Math.random() - 0.5) * 1.5;
            p.vy = -Math.random() * 2 - 1;
            p.life = 0;
            p.maxLife = Math.random() * 250 + 150;
            p.size = Math.random() * 3 + 2;
            p.alpha = 0;
            p.rotation = Math.random() * Math.PI * 2;
        }
    };

    const update = () => {
      if (!isVisible) return;

      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Spawn rate
      if (frameCount % 6 === 0) { // Slightly slower spawn for performance
          spawnParticle();
      }

      // Update & Draw
      ctx.globalCompositeOperation = "screen";
      
      for (let i = 0; i < maxParticles; i++) {
        const p = particlePool[i];
        if (!p.active) continue;

        p.life++;
        p.x += p.vx + Math.sin(p.y * 0.01 + frameCount * 0.005) * 0.3;
        p.y += p.vy;

        // Fade logic
        if (p.life < 60) p.alpha = (p.life / 60) * 0.8;
        else if (p.life > p.maxLife - 60) p.alpha = ((p.maxLife - p.life) / 60) * 0.8;

        if (p.life >= p.maxLife) {
            p.active = false;
            continue;
        }

        ctx.globalAlpha = p.alpha;
        const size = puffSize * p.size;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation + frameCount * 0.001);
        ctx.drawImage(puffCanvas, -size / 2, -size / 2, size, size);
        ctx.restore();
      }
      
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      animationId = requestAnimationFrame(update);
    };

    // Intersection Observer
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isVisible = true;
                    cancelAnimationFrame(animationId);
                    update();
                } else {
                    isVisible = false;
                    cancelAnimationFrame(animationId);
                }
            });
        },
        { threshold: 0 }
    );
    // Safe check since containerRef can be null in types, but useEffect guard handles it
    if (containerRef.current) {
        observer.observe(containerRef.current);
    }

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
         if (entry.target === canvas) {
            width = entry.contentRect.width;
            height = entry.contentRect.height;
            canvas.width = width;
            canvas.height = height;
         }
      }
    });
    resizeObserver.observe(canvas);

    update();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      observer.disconnect();
    };
  }, [enabled, maxParticles]);
};
