import { useEffect, useRef, useState } from 'react';

export function useFullyInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [isFullyVisible, setIsFullyVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFullyVisible(entry.intersectionRatio === 1);
      },
      {
        threshold: 1.0,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return { ref, isFullyVisible };
}
