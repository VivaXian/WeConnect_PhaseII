import { useLayoutEffect, useRef } from 'react';

export const useDemoPhoneScale = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (!stage || !frame) return;

    const updateScale = (): void => {
      const { width, height } = stage.getBoundingClientRect();
      const scale = Math.min(1, width / 391, height / 828);
      frame.style.setProperty('--demo-phone-scale', String(scale));
    };

    const observer = new ResizeObserver(updateScale);
    observer.observe(stage);
    updateScale();
    return () => observer.disconnect();
  }, []);

  return { stageRef, frameRef };
};
