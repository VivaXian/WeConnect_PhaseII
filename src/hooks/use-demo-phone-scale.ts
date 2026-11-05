import { useLayoutEffect, useRef } from 'react';

export const useDemoPhoneScale = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (!stage || !frame) return;

    const updateScale = (): void => {
      const { clientWidth, clientHeight } = stage;
      const scale = Math.min(1, clientWidth / 391, clientHeight / 828);
      frame.style.setProperty('--demo-phone-scale', String(scale));
    };

    const observer = new ResizeObserver(updateScale);
    observer.observe(stage);
    window.addEventListener('resize', updateScale);
    window.addEventListener('orientationchange', updateScale);
    window.visualViewport?.addEventListener('resize', updateScale);
    updateScale();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('orientationchange', updateScale);
      window.visualViewport?.removeEventListener('resize', updateScale);
    };
  }, []);

  return { stageRef, frameRef };
};
