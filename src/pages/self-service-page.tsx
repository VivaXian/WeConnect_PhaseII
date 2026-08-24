import { ConversationListSection } from '../components/conversation-list-section';
import { FaqSection } from '../components/faq-section';
import { selfServiceStyles as s } from './self-service-page.css';

const SERVICE_HOTLINE = '400-810-0038';

interface SelfServicePageProps {
  onConversationPress: (conversationId: string) => void;
  onHistoryPress: () => void;
  onFaqPress: () => void;
}

export const SelfServicePage = ({
  onConversationPress,
  onHistoryPress,
  onFaqPress,
}: SelfServicePageProps) => (
  <div className={s.page}>
    <div className={s.scroll}>
      <FaqSection onSeeAllPress={onFaqPress} />
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
