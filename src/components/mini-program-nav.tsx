import { navStyles as s } from './mini-program-nav.css';
import { PhilipsLogo } from '@filament/react/icons/philips-logo';

interface MiniProgramNavProps {
  title: string;
  variant?: 'logo' | 'back' | 'page';
  onBack?: () => void;
}

export const MiniProgramNav = ({ title, variant = 'logo', onBack }: MiniProgramNavProps) => (
  <div className={s.wrap}>
    {/* Status bar */}
    <div className={s.statusBar}>
      <span className={s.time}>9:41</span>
      <div className={s.statusIcons}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill="white" aria-hidden="true">
          <rect x="0" y="7" width="3" height="4" rx="0.5"/>
          <rect x="4.5" y="5" width="3" height="6" rx="0.5"/>
          <rect x="9" y="3" width="3" height="8" rx="0.5"/>
          <rect x="13.5" y="0" width="3" height="11" rx="0.5"/>
        </svg>
        <svg width="15" height="11" viewBox="0 0 16 12" fill="none" aria-hidden="true">
          <circle cx="8" cy="10.5" r="1.5" fill="white"/>
          <path d="M4.5 7.5 Q8 5 11.5 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <path d="M1.5 5 Q8 1 14.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        </svg>
        <svg width="25" height="11" viewBox="0 0 25 11" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="21" height="10" rx="2.5" stroke="white" strokeOpacity="0.35"/>
          <rect x="2" y="2" width="17" height="7" rx="1.5" fill="white"/>
          <path d="M23 3.5 L23 7.5" stroke="white" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>

    {/* Navigation bar */}
    <div className={s.navBar}>
      {variant === 'page' ? (
        <span className={s.navTitleLeft}>{title}</span>
      ) : (
        <>
          <div className={s.navLeft}>
            {variant === 'logo' ? (
              <div className={s.logoWrap}>
                <PhilipsLogo style={{ color: '#ffffff' }} width={82} height={15} />
              </div>
            ) : (
              <button className={s.backBtn} onClick={onBack} aria-label="返回">
                <svg width="9" height="17" viewBox="0 0 9 17" fill="none" aria-hidden="true">
                  <path d="M8 1L1 8.5L8 16" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
          <span className={s.navTitle}>{title}</span>
        </>
      )}
      <div className={s.navRight}>
        <div className={s.capsule}>
          <button className={s.capsuleBtn} aria-label="设置">
            <svg width="18" height="4" viewBox="0 0 18 4" fill="white" aria-hidden="true">
              <circle cx="2" cy="2" r="2"/>
              <circle cx="9" cy="2" r="2"/>
              <circle cx="16" cy="2" r="2"/>
            </svg>
          </button>
          <div className={s.capsuleDivider} />
          <button className={s.capsuleBtn} aria-label="退出">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5" stroke="white" strokeWidth="1.5"/>
              <circle cx="8" cy="8" r="2.5" fill="white"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
);
