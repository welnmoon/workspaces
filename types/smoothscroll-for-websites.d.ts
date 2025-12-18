declare module 'smoothscroll-for-websites' {
  type SmoothScrollOptions = {
    animationTime?: number;
    stepSize?: number;
    accelerationDelta?: number;
    accelerationMax?: number;
    keyboardSupport?: boolean;
    arrowScroll?: number;
    pulseAlgorithm?: boolean;
    pulseScale?: number;
    pulseNormalize?: number;
    touchpadSupport?: boolean;
  };

  const SmoothScroll: (options?: SmoothScrollOptions) => void;
  export default SmoothScroll;
}
