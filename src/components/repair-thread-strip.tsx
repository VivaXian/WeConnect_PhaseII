import { Badge } from '@filament/react/badge';
import { ChevronRight } from '@filament/react/icons/chevron-right';
import clsx from 'clsx';
import { useVisibleConversations } from '../hooks/use-visible-conversations';
import { useConversationUnread } from '../hooks/use-conversation-unread';
import { repairConversations } from '../utils/conversation-grouping';
import { conversationPartnerLabel, conversationTitle, hasEngineerPartner } from '../utils/conversation-display';
import { RoleAvatar } from './role-avatar';
import { stripStyles as s } from './repair-thread-strip.css';

interface RepairThreadStripProps {
  onConversationPress: (id: string) => void;
  onHistoryPress: () => void;
}

const VISIBLE_CARDS = 3;

export const RepairThreadStrip = ({
  onConversationPress,
  onHistoryPress,
}: RepairThreadStripProps) => {
  const conversations = useVisibleConversations();
  const { byConversationId } = useConversationUnread();

  // 排序：有未读的优先，其次按最后消息时间倒序（repairConversations 已按时间排好）
  const active = [...repairConversations(conversations)].sort((a, b) => {
    const unreadA = (byConversationId[a.id] ?? 0) > 0;
    const unreadB = (byConversationId[b.id] ?? 0) > 0;
    return unreadA === unreadB ? 0 : unreadA ? -1 : 1;
  });

  // 没有进行中的对话就整条不渲染，全部入口常驻在输入框上方的胶囊里
  if (active.length === 0) return null;

  const visible = active.slice(0, VISIBLE_CARDS);
  // 卡片放不下的那些，未读要在「查看更多」上补一个角标，否则这一屏看不出来
  const hiddenUnread = active
    .slice(VISIBLE_CARDS)
    .reduce((total, item) => total + (byConversationId[item.id] ?? 0), 0);

  return (
    <div className={s.strip}>
      <div className={s.header}>
        <span className={s.headerTitle}>进行中的对话</span>
        <button type="button" className={s.headerAction} onClick={onHistoryPress}>
          全部对话
          {hiddenUnread > 0 && (
            <Badge value={hiddenUnread} maxValue={99} aria-label={`另有${hiddenUnread}条未读`} />
          )}
          <ChevronRight className={s.headerChevron} aria-hidden="true" />
        </button>
      </div>

      <div className={s.scroller}>
        {visible.map((conversation) => {
          const unread = byConversationId[conversation.id] ?? 0;
          return (
            <button
              key={conversation.id}
              type="button"
              className={clsx(s.card, unread > 0 && s.cardUnread)}
              onClick={() => onConversationPress(conversation.id)}
            >
              <RoleAvatar role={hasEngineerPartner(conversation) ? 'engineer' : 'ccc'} size={24} />
              <span className={s.info}>
                <span className={s.name}>{conversationTitle(conversation)}</span>
                <span className={s.meta}>
                  {`${conversationPartnerLabel(conversation)} · ${conversation.caseRef?.displayNo ?? ''}`}
                </span>
              </span>
              {unread > 0 && (
                <Badge value={unread} maxValue={99} aria-label={`${unread}条未读`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
