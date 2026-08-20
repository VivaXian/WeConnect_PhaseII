import { ChevronRight } from '@filament/react/icons/chevron-right';
import { Text } from '@filament/react/text';
import { useConversationStore } from '../stores/conversation-store';
import { useConversationUnread } from '../hooks/use-conversation-unread';
import {
  archivedRepairConversations,
  generalConversationOf,
  repairConversations,
} from '../utils/conversation-grouping';
import { ConversationRow } from './conversation-row';
import { conversationListStyles as s } from './conversation-list-section.css';

const VISIBLE_REPAIR_ROWS = 3;

interface ConversationListSectionProps {
  onConversationPress: (id: string) => void;
  onHistoryPress: () => void;
}

export const ConversationListSection = ({
  onConversationPress,
  onHistoryPress,
}: ConversationListSectionProps) => {
  const conversations = useConversationStore((state) => state.conversations);
  const { byConversationId } = useConversationUnread();

  const general = generalConversationOf(conversations);
  const repairs = repairConversations(conversations);
  const archivedCount = archivedRepairConversations(conversations).length;
  const visibleRepairs = repairs.slice(0, VISIBLE_REPAIR_ROWS);
  const totalRepairs = repairs.length + archivedCount;

  return (
    <>
      <div className={s.section}>
        {general && (
          <ConversationRow
            conversation={general}
            unread={byConversationId[general.id] ?? 0}
            onPress={onConversationPress}
          />
        )}
      </div>

      <div className={s.section}>
        <div className={s.header}>
          <Text variant="body-m" weight="bold">报修对话</Text>
        </div>
        {visibleRepairs.length === 0
          ? <p className={s.empty}>暂无进行中的报修对话。报修受理后，与您对接的客户响应中心和服务工程师会出现在这里。</p>
          : visibleRepairs.map((conversation) => (
            <ConversationRow
              key={conversation.id}
              conversation={conversation}
              unread={byConversationId[conversation.id] ?? 0}
              onPress={onConversationPress}
            />
          ))}
        {totalRepairs > visibleRepairs.length && (
          <button type="button" className={s.moreRow} onClick={onHistoryPress}>
            <span>全部报修对话（{totalRepairs}）</span>
            <ChevronRight className={s.moreChevron} aria-hidden="true" />
          </button>
        )}
      </div>
    </>
  );
};
