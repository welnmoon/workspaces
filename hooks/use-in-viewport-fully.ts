import { useEffect, useRef, useState } from 'react';

export function useFullyInView<T extends HTMLElement>(ratio = 0.98) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting && entry.intersectionRatio >= ratio);
      },
      {
        threshold: [0, ratio, 1],
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [ratio]);

  return { ref, inView };
}
