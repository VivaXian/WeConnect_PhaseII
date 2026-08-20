import { MiniProgramNav } from '../components/mini-program-nav';
import { useConversationStore } from '../stores/conversation-store';
import { archivedRepairConversations, repairConversations } from '../utils/conversation-grouping';
import { useConversationUnread } from '../hooks/use-conversation-unread';
import { ConversationRow } from '../components/conversation-row';
import { conversationHistoryStyles as s } from './conversation-history-page.css';

interface ConversationHistoryPageProps {
  onBack: () => void;
  onConversationPress: (id: string) => void;
}

export const ConversationHistoryPage = ({
  onBack,
  onConversationPress,
}: ConversationHistoryPageProps) => {
  const conversations = useConversationStore((state) => state.conversations);
  const { byConversationId } = useConversationUnread();
  const current = repairConversations(conversations);
  const archived = archivedRepairConversations(conversations);

  return (
    <div className={s.page}>
      <MiniProgramNav variant="back" title="全部报修对话" onBack={onBack} />
      {current.length > 0 && (
        <>
          <p className={s.hint}>进行中</p>
          <div className={s.list}>
            {current.map((conversation) => (
              <ConversationRow
                key={conversation.id}
                conversation={conversation}
                unread={byConversationId[conversation.id] ?? 0}
                onPress={onConversationPress}
              />
            ))}
          </div>
        </>
      )}
      {archived.length > 0 && (
        <>
          <p className={s.hint}>报修已完成</p>
          <div className={s.list}>
            {archived.map((conversation) => (
              <ConversationRow
                key={conversation.id}
                conversation={conversation}
                unread={0}
                onPress={onConversationPress}
              />
            ))}
          </div>
        </>
      )}
      {current.length === 0 && archived.length === 0 && (
        <div className={s.list}>
          <p className={s.empty}>暂无报修对话</p>
        </div>
      )}
    </div>
  );
};
