import { ChevronRight } from '@filament/react/icons/chevron-right';
import type { Conversation } from '../types/conversation';
import { isOwnConversation } from '../utils/conversation-grouping';
import { lastMessageText } from '../utils/conversation-display';
import { caseConversationListStyles as s } from './case-conversation-list.css';

interface CaseConversationListProps {
  conversations: Conversation[];
  onConversationPress: (conversationId: string) => void;
}

export const CaseConversationList = ({ conversations, onConversationPress }: CaseConversationListProps) => (
  <div className={s.list}>
    {conversations.map((conversation) => {
      const isOwn = isOwnConversation(conversation);

      return (
        <button
          key={conversation.id}
          type="button"
          className={s.row}
          onClick={() => onConversationPress(conversation.id)}
        >
          <div className={s.content}>
            <div className={s.top}>
              <span className={s.title}>
                {isOwn ? '我的对话' : `${conversation.ownerName} 的对话`}
              </span>
              {!isOwn && <span className={s.readOnlyTag}>只读</span>}
            </div>
            <span className={s.summary}>{lastMessageText(conversation)}</span>
          </div>
          <ChevronRight className={s.chevron} aria-hidden="true" />
        </button>
      );
    })}
  </div>
);
