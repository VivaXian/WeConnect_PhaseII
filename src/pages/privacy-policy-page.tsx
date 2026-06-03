import { ChevronRight } from '@filament/react/icons/chevron-right';
import { MiniProgramNav } from '../components/mini-program-nav';
import { privacyPolicyStyles } from './privacy-policy-page.css';

const PRIVACY_ITEMS = [
  { key: 'policy-text', label: '隐私政策正文' },
  { key: 'policy-summary', label: '隐私政策摘要' },
  { key: 'collect-list', label: '个人信息收集清单' },
  { key: 'share-list', label: '个人信息共享清单' },
];

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export const PrivacyPolicyPage = ({ onBack }: PrivacyPolicyPageProps) => (
  <div className={privacyPolicyStyles.page}>
    <MiniProgramNav variant="back" title="隐私政策" onBack={onBack} />
    <div className={privacyPolicyStyles.list}>
      {PRIVACY_ITEMS.map((item) => (
        <button key={item.key} type="button" className={privacyPolicyStyles.listItem}>
          <span>{item.label}</span>
          <ChevronRight />
        </button>
      ))}
    </div>
  </div>
);
