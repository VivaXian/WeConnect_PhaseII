import type { QuickEntryStep } from './quick-entry-card';
import philipsLogo from '../assets/icons/PHILIPS.svg';
import { welcomeStyles as s } from './service-welcome-card.css';

const PRESETS: { label: string; step: QuickEntryStep }[] = [
  { label: '查询报修', step: 'repair' },
  { label: '咨询我的设备', step: 'device' },
  { label: '商务咨询及其他', step: 'new-device' },
];

interface ServiceWelcomeCardProps {
  /** 这段咨询一旦开口，引导胶囊就收起——留着会被误点，消息还会发到当前会话 */
  showPresets: boolean;
  onPresetPress: (step: QuickEntryStep) => void;
}

/** 模板卡片，不是气泡——不能让用户以为已经有坐席在跟他说话 */
export const ServiceWelcomeCard = ({ showPresets, onPresetPress }: ServiceWelcomeCardProps) => (
  <div className={s.card}>
    <img className={s.logo} src={philipsLogo} alt="" aria-hidden="true" />
    <span className={s.title}>飞利浦客户响应中心</span>
    <span className={s.desc}>
      7×24 小时接收您的消息
      {showPresets && (
        <>
          <br />
          先选一项咨询类型，可更快接入对应人员
        </>
      )}
    </span>
    {showPresets && (
      <div className={s.pills}>
        {PRESETS.map((preset) => (
          <button
            key={preset.step}
            type="button"
            className={s.pill}
            onClick={() => onPresetPress(preset.step)}
          >
            {preset.label}
          </button>
        ))}
      </div>
    )}
  </div>
);
