import { MiniProgramNav } from '../components/mini-program-nav';
import { useVisibleConversations } from '../hooks/use-visible-conversations';
import {
  archivedRepairConversations,
  generalConversationOf,
  repairConversations,
} from '../utils/conversation-grouping';
import { useConversationUnread } from '../hooks/use-conversation-unread';
import { ConversationRow } from '../components/conversation-row';
import { conversationHistoryStyles as s } from './conversation-history-page.css';

interface ConversationHistoryPageProps {
  onBack: () => void;
  onConversationPress: (id: string) => void;
  /** 客服对话就是上一页本身，点它等于返回 */
  onGeneralPress: () => void;
}

export const ConversationHistoryPage = ({
  onBack,
  onConversationPress,
  onGeneralPress,
}: ConversationHistoryPageProps) => {
  const conversations = useVisibleConversations();
  const { byConversationId } = useConversationUnread();
  const general = generalConversationOf(conversations);
  const current = repairConversations(conversations);
  const archived = archivedRepairConversations(conversations);

  return (
    <div className={s.page}>
      <MiniProgramNav variant="back" title="全部对话" onBack={onBack} />
      {general && (
        <>
          <p className={s.hint}>客服</p>
          <div className={s.list}>
            <ConversationRow
              conversation={general}
              unread={byConversationId[general.id] ?? 0}
              onPress={onGeneralPress}
            />
          </div>
        </>
      )}
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
          <p className={s.hint}>已结束</p>
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
