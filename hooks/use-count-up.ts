import { useEffect, useState } from 'react';

export const useCountUp = ({
  start = 0,
  target,
  durationMs = 800,
  decimals = 0,
}: {
  start: number;
  target: number;
  durationMs?: number;
  decimals?: number;
}) => {
  const [value, setValue] = useState(start);

  const reduceMotion = false; // TODO - вернуть проверку на анимацию

//   useMemo(() => {
//     if (typeof window === 'undefined') return true;
//     return (
//       window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
//     );
//   }, []);

  useEffect(() => {
    if (reduceMotion) {
      setValue(Number(target));
      return;
    }
    let raf = 0;
    const from = start;
    const to = target;
    const startTime = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (to - from) * eased;

      setValue(Number(next.toFixed(decimals)));

      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, start, decimals, reduceMotion]);

  return value;
};
