'use client';

import { useEffect } from 'react';

export default function SmoothScrollProvider() {
  useEffect(() => {
    (async () => {
      const SmoothScroll = (await import('smoothscroll-for-websites')).default;

      SmoothScroll({
        animationTime: 800,
        stepSize: 75,
        accelerationDelta: 30,
        accelerationMax: 2,
        keyboardSupport: true,
        arrowScroll: 50,
        pulseAlgorithm: true,
        pulseScale: 4,
        pulseNormalize: 1,
        touchpadSupport: true,
      });
    })();
  }, []);

  return null;
}
