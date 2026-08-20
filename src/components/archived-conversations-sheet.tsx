import { Text } from '@filament/react/text';
import type { Conversation } from '../types/conversation';
import { ConversationRow } from './conversation-row';
import { sheetStyles } from './upgrade-form-sheet.css';
import { archivedConversationsStyles as s } from './archived-conversations-sheet.css';

interface ArchivedConversationsSheetProps {
  conversations: Conversation[];
  onConversationPress: (id: string) => void;
  onClose: () => void;
}

export const ArchivedConversationsSheet = ({
  conversations,
  onConversationPress,
  onClose,
}: ArchivedConversationsSheetProps) => (
  <div className={sheetStyles.overlay} onClick={onClose} role="presentation">
    <div
      className={sheetStyles.panel}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label="历史对话"
    >
      <div className={sheetStyles.handle} />
      <div className={sheetStyles.header}>
        <Text variant="heading-s">历史对话</Text>
        <button type="button" className={sheetStyles.closeBtn} onClick={onClose} aria-label="关闭">
          ✕
        </button>
      </div>
      <div className={sheetStyles.divider} />

      <p className={s.hint}>已结束的对话可随时查阅，但不再接收新消息。</p>

      {conversations.length === 0 ? (
        <p className={s.empty}>暂无历史对话</p>
      ) : (
        <div className={s.list}>
          {conversations.map((conversation) => (
            <ConversationRow
              key={conversation.id}
              conversation={conversation}
              unread={0}
              onPress={onConversationPress}
            />
          ))}
        </div>
      )}
    </div>
  </div>
);
