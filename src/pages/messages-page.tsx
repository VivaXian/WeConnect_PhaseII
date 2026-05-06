import clsx from 'clsx';
import type { AppMessage, MessageCategory } from '../types/message';
import { CATEGORY_LABEL } from '../types/message';
import { useMessageStore } from '../stores/message-store';
import { useRoleStore } from '../stores/role-store';
import { useShallow } from 'zustand/react/shallow';
import { msgStyles } from './messages-page.css';

const CATEGORY_ICON: Record<MessageCategory, string> = {
  'contract-expired': '🔴',
  'contract-expiry': '⏰',
  'pm-plan': '📅',
  'pm-risk': '⚠️',
  'order-update': '🔵',
};

const ICON_STYLE: Record<MessageCategory, string> = {
  'contract-expired': msgStyles.iconDanger,
  'contract-expiry': msgStyles.iconWarn,
  'pm-plan': msgStyles.iconBlue,
  'pm-risk': msgStyles.iconWarn,
  'order-update': msgStyles.iconBlue,
};

const BADGE_STYLE: Record<MessageCategory, string> = {
  'contract-expired': msgStyles.badgeDanger,
  'contract-expiry': msgStyles.badgeWarn,
  'pm-plan': msgStyles.badgeBlue,
  'pm-risk': msgStyles.badgeWarn,
  'order-update': msgStyles.badgeBlue,
};

function groupByDate(messages: AppMessage[]): { label: string; items: AppMessage[] }[] {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const todayItems = messages.filter((m) => m.time === todayStr);
  const weekItems = messages.filter((m) => {
    const d = new Date(m.time);
    return d < today && d >= weekAgo && m.time !== todayStr;
  });
  const olderItems = messages.filter((m) => new Date(m.time) < weekAgo);

  return [
    todayItems.length > 0 ? { label: '今日', items: todayItems } : null,
    weekItems.length > 0 ? { label: '本周', items: weekItems } : null,
    olderItems.length > 0 ? { label: '更早', items: olderItems } : null,
  ].filter(Boolean) as { label: string; items: AppMessage[] }[];
}

interface MessageCardProps {
  msg: AppMessage;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const MessageCard = ({ msg, onMarkRead, onDelete }: MessageCardProps) => (
  <div
    className={msg.isRead ? msgStyles.cardRead : msgStyles.card}
    onClick={() => onMarkRead(msg.id)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onMarkRead(msg.id)}
    aria-label={msg.title}
  >
    <div className={clsx(msgStyles.iconCircle, ICON_STYLE[msg.category])}>
      {CATEGORY_ICON[msg.category]}
    </div>
    <div className={msgStyles.cardContent}>
      <div className={msgStyles.cardMetaRow}>
        <span className={clsx(msgStyles.categoryBadge, BADGE_STYLE[msg.category])}>
          {CATEGORY_LABEL[msg.category]}
        </span>
        <button
          className={msgStyles.deleteBtn}
          onClick={(event) => {
            event.stopPropagation();
            onDelete(msg.id);
          }}
          aria-label={`删除${msg.title}`}
        >
          删除
        </button>
      </div>
      <div className={msgStyles.cardTitleRow}>
        <span className={msg.isRead ? msgStyles.cardTitleRead : msgStyles.cardTitle}>
          {msg.title}
        </span>
        {!msg.isRead && <div className={msgStyles.unreadDot} />}
      </div>
      <div className={msgStyles.cardBody}>{msg.body}</div>
      <div className={msgStyles.cardTime}>{msg.time}</div>
    </div>
  </div>
);

export interface MessagesPageProps {
  onBack?: () => void;
}

export const MessagesPage = ({ onBack }: MessagesPageProps) => {
  const { role } = useRoleStore();
  const { deleteMessage, deleteMessages, markAllRead, markRead, messages } = useMessageStore(
    useShallow((state) => ({
      deleteMessage: state.deleteMessage,
      deleteMessages: state.deleteMessages,
      markAllRead: state.markAllRead,
      markRead: state.markRead,
      messages: state.messages,
    }))
  );
  const isAdmin = role === 'admin';

  const visibleMessages = messages.filter((message) => isAdmin || !message.forAdminOnly);
  const unreadCount = visibleMessages.filter((message) => !message.isRead).length;
  const groups = groupByDate(visibleMessages);

  return (
    <div className={msgStyles.page}>
      <div className={msgStyles.topBar}>
        <div className={msgStyles.topBarLeft}>
          {onBack && (
            <button className={msgStyles.backBtn} onClick={onBack} aria-label="返回">
              ‹ 返回
            </button>
          )}
          <div className={msgStyles.topBarTitle}>
            消息中心{unreadCount > 0 ? ` (${unreadCount})` : ''}
          </div>
          <div className={msgStyles.topBarSub}>
            {unreadCount > 0 ? `${unreadCount} 条未读消息` : '全部已读'}
          </div>
        </div>
        <div className={msgStyles.topBarActions}>
          {unreadCount > 0 && (
            <button
              className={msgStyles.markAllBtn}
              onClick={() => markAllRead(visibleMessages.map((message) => message.id))}
            >
              全部已读
            </button>
          )}
          {visibleMessages.length > 0 && (
            <button
              className={msgStyles.deleteAllBtn}
              onClick={() => deleteMessages(visibleMessages.map((message) => message.id))}
            >
              批量删除
            </button>
          )}
        </div>
      </div>

      <div className={msgStyles.listSection}>
        {groups.length === 0 ? (
          <div className={msgStyles.emptyState}>暂无消息</div>
        ) : (
          groups.map((group) => (
            <div key={group.label} className={msgStyles.group}>
              <div className={msgStyles.groupTitle}>{group.label}</div>
              {group.items.map((msg) => (
                  <MessageCard
                    key={msg.id}
                    msg={msg}
                    onMarkRead={markRead}
                    onDelete={deleteMessage}
                  />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
