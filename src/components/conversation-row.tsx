import { Badge } from '@filament/react/badge';
import clsx from 'clsx';
import type { Conversation } from '../types/conversation';
import {
  conversationMeta,
  conversationStatus,
  conversationTitle,
  formatConversationTime,
  isEngineerConversation,
  lastMessageText,
} from '../utils/conversation-display';
import { isCaseClosed } from '../utils/conversation-status';
import { RoleAvatar } from './role-avatar';
import { conversationRowStyles as s } from './conversation-row.css';

interface ConversationRowProps {
  conversation: Conversation;
  unread: number;
  onPress: (id: string) => void;
}

export const ConversationRow = ({ conversation, unread, onPress }: ConversationRowProps) => {
  const isUnread = unread > 0;
  const status = conversationStatus(conversation);
  const meta = conversationMeta(conversation);
  const isClosed = isCaseClosed(conversation);
  const isEngineer = isEngineerConversation(conversation);

  return (
    <button
      type="button"
      className={s.row}
      onClick={() => onPress(conversation.id)}
    >
      <RoleAvatar role={isEngineer ? 'engineer' : 'ccc'} size={40} isMuted={isClosed} />
      <div className={s.content}>
        <div className={s.top}>
          <span className={clsx(s.title, isClosed && s.titleClosed)}>{conversationTitle(conversation)}</span>
          {isUnread && <Badge value={unread} aria-label={`${unread}条未读`} />}
        </div>
        {(status || meta) && (
          <div className={s.metaRow}>
            {status && <span className={clsx(s.status, s.statusActive)}>{status}</span>}
            {meta && <span className={s.meta}>{meta}</span>}
          </div>
        )}
        <div className={s.bottom}>
          <span className={s.summary}>{lastMessageText(conversation)}</span>
          <span className={s.time}>{formatConversationTime(conversation.updatedAt)}</span>
        </div>
      </div>
    </button>
  );
};
