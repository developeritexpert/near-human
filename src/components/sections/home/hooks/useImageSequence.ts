
import { useState, useEffect, useRef } from 'react';

interface UseImageSequenceProps {
  totalFrames: number;
  framePath: (index: number) => string;
}

export const useImageSequence = ({ totalFrames, framePath }: UseImageSequenceProps) => {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    let mounted = true;
    let loadedCount = 0;
    const batchSize = 20;

    const loadBatch = async (startIndex: number) => {
      if (!mounted) return;

      const batchPromises = [];
      const endIndex = Math.min(startIndex + batchSize, totalFrames);

      for (let i = startIndex; i < endIndex; i++) {
        const promise = new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = framePath(i);
          img.onload = () => {
            if (mounted) {
              loadedCount++;
              setProgress(Math.round((loadedCount / totalFrames) * 100));
              resolve();
            }
          };
          img.onerror = () => {
            console.error(`Failed to load frame ${i}`);
            // Resolve anyway to continue loading other frames, but track error
            // Ideally we might have retry logic or placeholder
            resolve();
          };
          imagesRef.current[i] = img;
        });
        batchPromises.push(promise);
      }

      await Promise.all(batchPromises);

      if (endIndex < totalFrames) {
        // Small delay to yield to main thread
        setTimeout(() => loadBatch(endIndex), 0);
      } else {
        if (mounted) {
           setImages(imagesRef.current);
           setIsLoading(false);
        }
      }
    };

    // Initialize array
    imagesRef.current = new Array(totalFrames);
    
    // Start loading
    loadBatch(0);

    return () => {
      mounted = false;
      imagesRef.current = [];
    };
  }, [totalFrames, framePath]);

  return { images: imagesRef.current, progress, isLoading, error };
};
