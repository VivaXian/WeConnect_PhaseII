import { useEffect, useRef, useState } from 'react';
import { MiniProgramNav } from '../components/mini-program-nav';
import { scanCameraStyles as s } from './scan-camera-page.css';

interface ScanCameraPageProps {
  onBack: () => void;
}

export const ScanCameraPage = ({ onBack }: ScanCameraPageProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
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
      <MiniProgramNav variant="back" title="扫描设备二维码" onBack={onBack} />

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

      <div className={s.hint}>将设备二维码对准框内，识别后选择报修或绑定</div>
    </div>
  );
};
