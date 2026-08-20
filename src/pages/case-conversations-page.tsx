import { MiniProgramNav } from '../components/mini-program-nav';
import { CaseConversationList } from '../components/case-conversation-list';
import { useConversationStore } from '../stores/conversation-store';
import { useRoleStore } from '../stores/role-store';
import { caseConversations, isOwnConversation } from '../utils/conversation-grouping';
import { repairData } from '../utils/repair-data';
import { caseConversationsStyles as s } from './case-conversations-page.css';

interface CaseConversationsPageProps {
  repairId: string;
  onBack: () => void;
  onConversationPress: (conversationId: string) => void;
}

export const CaseConversationsPage = ({
  repairId,
  onBack,
  onConversationPress,
}: CaseConversationsPageProps) => {
  const conversations = useConversationStore((state) => state.conversations);
  const { role } = useRoleStore();
  const record = repairData.flatMap((g) => g.records).find((r) => r.id === repairId);
  const visibleConversations = caseConversations(conversations, repairId).filter(
    (item) => isOwnConversation(item) || role === 'admin'
  );

  return (
    <div className={s.page}>
      <MiniProgramNav variant="back" title="服务对话" onBack={onBack} />
      {record && (
        <div className={s.subHeader}>
          <span className={s.subHeaderTitle}>{record.deviceName}</span>
          <span className={s.subHeaderMeta}>报修号 {record.repairId}</span>
        </div>
      )}
      {visibleConversations.length > 0 ? (
        <div className={s.card}>
          <CaseConversationList
            conversations={visibleConversations}
            onConversationPress={onConversationPress}
          />
        </div>
      ) : (
        <p className={s.empty}>暂无服务对话</p>
      )}
    </div>
  );
};
