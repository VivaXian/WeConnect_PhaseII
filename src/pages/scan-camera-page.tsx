import { useEffect, useRef, useState } from 'react';
import { scanCameraStyles as s } from './scan-camera-page.css';

interface ScanCameraPageProps {
  onBack: () => void;
}

export const ScanCameraPage = ({ onBack }: ScanCameraPageProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<'repair' | 'bind'>('repair');
  const [cameraAvailable, setCameraAvailable] = useState(true);

  useEffect(() => {
    let stream: MediaStream | null = null;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: 'environment' } } })
      .then((ms) => {
        stream = ms;
        if (videoRef.current) videoRef.current.srcObject = ms;
      })
      .catch(() => setCameraAvailable(false));

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className={s.page}>
      <div className={s.header}>
        <button className={s.closeBtn} onClick={onBack} aria-label="关闭">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2L14 14M14 2L2 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <span className={s.title}>扫描设备二维码</span>
        <div className={s.modeToggle}>
          <button
            className={mode === 'repair' ? s.modeBtnActive : s.modeBtn}
            onClick={() => setMode('repair')}
          >
            报修
          </button>
          <button
            className={mode === 'bind' ? s.modeBtnActive : s.modeBtn}
            onClick={() => setMode('bind')}
          >
            绑定
          </button>
        </div>
      </div>

      <div className={s.viewfinderWrap}>
        {cameraAvailable ? (
          <video ref={videoRef} autoPlay playsInline muted className={s.video} />
        ) : (
          <div className={s.noCamera}>
            <span className={s.noCameraText}>
              摄像头无法访问{'\n'}请在浏览器设置中允许摄像头权限
            </span>
          </div>
        )}
        <div className={s.frame}>
          <div className={s.cornerTL} />
          <div className={s.cornerTR} />
          <div className={s.cornerBL} />
          <div className={s.cornerBR} />
          <div className={s.scanLine} />
        </div>
      </div>

      <div className={s.hint}>将设备二维码对准框内，自动识别</div>
    </div>
  );
};
