
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface UseCustomCursorProps {
  containerRef: React.RefObject<HTMLElement | null>;
  cursorRef: React.RefObject<HTMLDivElement | null>;
  cursorDotRef: React.RefObject<HTMLDivElement | null>;
  enabled?: boolean;
}

export const useCustomCursor = ({
  containerRef,
  cursorRef,
  cursorDotRef,
  enabled = true,
}: UseCustomCursorProps) => {
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Mobile check
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (!enabled || isMobile || !containerRef.current || !cursorRef.current || !cursorDotRef.current) return;

    const container = containerRef.current;
    
    // We casts as HTMLDivElement for cursor refs since we checked existence, but TypeScript might be strict
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseEnter = () => {
        gsap.to([cursor, cursorDot], { scale: 1, opacity: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
         gsap.to([cursor, cursorDot], { scale: 0, opacity: 0, duration: 0.3 });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    
    let rafId: number;
    const loop = () => {
        // Smooth lerp
        cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
        cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;
        
        if (cursor) {
            cursor.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px) translate(-50%, -50%)`;
        }
         if (cursorDot) {
            cursorDot.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px) translate(-50%, -50%)`;
        }
        rafId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);
};
