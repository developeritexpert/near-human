
import { useEffect, useRef, useCallback } from 'react';

interface UseCanvasRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  images: HTMLImageElement[];
  isLoading: boolean;
  maxDpr?: number;
  filter?: string;
}

export const useCanvasRenderer = ({
  canvasRef,
  images,
  isLoading,
  maxDpr = 1.5,
  filter,
}: UseCanvasRendererProps) => {

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isLoading || !images.length) return;

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: false }); // Disable desynchronized for quality
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Safety check for frame index
    const safeIndex = Math.min(Math.floor(frameIndex), images.length - 1);
    const img = images[safeIndex];

    if (!img || !img.complete) return;

    const rw = canvas.width;
    const rh = canvas.height;
    
    // Calculate aspect ratio (cover)
    const imgRatio = img.width / img.height;
    const canvasRatio = rw / rh;
    
    let drawW, drawH, drawX, drawY;

    if (canvasRatio > imgRatio) {
      drawW = rw;
      drawH = rw / imgRatio;
      drawX = 0;
      drawY = (rh - drawH) / 2;
    } else {
      drawW = rh * imgRatio;
      drawH = rh;
      drawX = (rw - drawW) / 2;
      drawY = 0;
    }

    ctx.clearRect(0, 0, rw, rh);
    if (filter) {
      ctx.filter = filter;
    }
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    // Reset filter to avoid side effects if context is reused strangely, though clearRect usually enough
    if (filter) {
       ctx.filter = "none"; 
    }
  }, [canvasRef, images, isLoading, filter]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
        canvasRef.current.width = window.innerWidth * dpr;
        canvasRef.current.height = window.innerHeight * dpr;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [maxDpr]);

  return { drawFrame };
};
