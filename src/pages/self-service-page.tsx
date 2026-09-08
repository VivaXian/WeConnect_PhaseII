import { ConversationListSection } from '../components/conversation-list-section';
import { MiniProgramNav } from '../components/mini-program-nav';
import { REPAIR_CHAT_LABEL } from '../utils/service-support-copy';
import { selfServiceStyles as s } from './self-service-page.css';

const SERVICE_HOTLINE = '400-810-0038';

interface SelfServicePageProps {
  onBack: () => void;
  onConversationPress: (conversationId: string) => void;
  onHistoryPress: () => void;
}

export const SelfServicePage = ({
  onBack,
  onConversationPress,
  onHistoryPress,
}: SelfServicePageProps) => (
  <div className={s.page}>
    <MiniProgramNav variant="back" title={REPAIR_CHAT_LABEL} onBack={onBack} />
    <div className={s.scroll}>
      <ConversationListSection
        onConversationPress={onConversationPress}
        onHistoryPress={onHistoryPress}
      />
      <a className={s.hotline} href={`tel:${SERVICE_HOTLINE}`}>
        服务热线 {SERVICE_HOTLINE}
      </a>
    </div>
  </div>
);
