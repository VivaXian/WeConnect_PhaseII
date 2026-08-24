import { ChevronRight } from '@filament/react/icons/chevron-right';
import { Text } from '@filament/react/text';
import { useVisibleConversations } from '../hooks/use-visible-conversations';
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
  const conversations = useVisibleConversations();
  const { byConversationId } = useConversationUnread();

  const general = generalConversationOf(conversations);
  const repairs = repairConversations(conversations);
  const archivedCount = archivedRepairConversations(conversations).length;
  const visibleRepairs = repairs.slice(0, VISIBLE_REPAIR_ROWS);
  const totalRepairs = repairs.length + archivedCount;

  if (!general && totalRepairs === 0) return null;

  return (
    <>
      {general && (
        <div className={s.section}>
          <ConversationRow
            conversation={general}
            unread={byConversationId[general.id] ?? 0}
            onPress={onConversationPress}
          />
        </div>
      )}

      {totalRepairs > 0 && (
        <div className={s.section}>
          <div className={s.header}>
            <Text variant="body-m" weight="bold">报修对话</Text>
          </div>
          {visibleRepairs.map((conversation) => (
            <ConversationRow
              key={conversation.id}
              conversation={conversation}
              unread={byConversationId[conversation.id] ?? 0}
              onPress={onConversationPress}
            />
          ))}
          {repairs.length === 0 ? (
            <button type="button" className={s.emptyRow} onClick={onHistoryPress}>
              <span>暂无进行中的对话，查看历史记录</span>
              <ChevronRight className={s.emptyChevron} aria-hidden="true" />
            </button>
          ) : (
            totalRepairs > visibleRepairs.length && (
              <button type="button" className={s.moreRow} onClick={onHistoryPress}>
                <span>查看历史记录</span>
                <ChevronRight className={s.moreChevron} aria-hidden="true" />
              </button>
            )
          )}
        </div>
      )}
    </>
  );
};
