import { Chat } from '@filament/react/icons/chat';
import { Cross } from '@filament/react/icons/cross';
import type { Conversation } from '../types/conversation';
import { useVisibleConversations } from '../hooks/use-visible-conversations';
import { useConversationUnread } from '../hooks/use-conversation-unread';
import { conversationPartnerLabel } from '../utils/conversation-display';
import { allMessages } from '../utils/conversation-status';
import { unreadToastStyles as s } from './unread-conversation-toast.css';

const latestUnreadId = (conversation: Conversation): string =>
  [...allMessages(conversation)]
    .reverse()
    .find((message) => !message.isRead && message.senderRole !== 'customer')?.id ?? '';

interface UnreadConversationToastProps {
  /** 关闭只对当前这批消息生效，来了新消息还要再提醒一次 */
  dismissedKey: string | null;
  onDismiss: (key: string) => void;
  onOpenConversation: (conversationId: string) => void;
  onOpenGeneral: () => void;
  onOpenAll: () => void;
}

export const UnreadConversationToast = ({
  dismissedKey,
  onDismiss,
  onOpenConversation,
  onOpenGeneral,
  onOpenAll,
}: UnreadConversationToastProps) => {
  const conversations = useVisibleConversations();
  const { byConversationId } = useConversationUnread();

  const unread = conversations.filter((item) => (byConversationId[item.id] ?? 0) > 0);
  if (unread.length === 0) return null;

  const key = unread.map(latestUnreadId).join('|');
  if (key === dismissedKey) return null;

  const single = unread.length === 1 ? unread[0] : null;
  const total = unread.reduce((sum, item) => sum + (byConversationId[item.id] ?? 0), 0);

  // 不写报修号（用户记不住）；「发来」而非「回复」——工程师也可能是主动开口的
  const text = single
    ? `${conversationPartnerLabel(single)}给您发来新消息`
    : `服务团队给您发来 ${total} 条新消息`;

  const open = () => {
    if (!single) return onOpenAll();
    return single.caseRef ? onOpenConversation(single.id) : onOpenGeneral();
  };

  return (
    <div className={s.layer}>
      <div className={s.toast} role="status" aria-live="polite">
        <button type="button" className={s.main} onClick={open}>
          <span className={s.iconChip}>
            <Chat className={s.icon} aria-hidden="true" />
          </span>
          <span className={s.text}>{text}</span>
        </button>
        <span className={s.divider} aria-hidden="true" />
        <button
          type="button"
          className={s.close}
          onClick={() => onDismiss(key)}
          aria-label="关闭提醒"
        >
          <Cross className={s.closeIcon} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
