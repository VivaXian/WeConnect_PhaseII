import { useEffect } from 'react';
import { Text } from '@filament/react/text';
import { useShallow } from 'zustand/react/shallow';
import { useConversationStore } from '../stores/conversation-store';
import { useVisibleConversations } from '../hooks/use-visible-conversations';
import { useRoleStore } from '../stores/role-store';
import {
  activeEngineerName,
  allMessages,
  openSegmentOf,
} from '../utils/conversation-status';
import { isOwnConversation } from '../utils/conversation-grouping';
import { conversationPartnerName } from '../utils/conversation-display';
import { repairData } from '../utils/repair-data';
import { MiniProgramNav } from '../components/mini-program-nav';
import { ConversationThread } from '../components/conversation-thread';
import { ConversationCaseHeader } from '../components/conversation-case-header';
import { ConversationClosedNote } from '../components/conversation-closed-note';
import { MessageComposer } from '../components/message-composer';
import { conversationPageStyles as s } from './conversation-page.css';

interface ConversationPageProps {
  conversationId: string;
  onBack: () => void;
  onCasePress: (caseId: string) => void;
  onDevicePress: (deviceName: string) => void;
  onConversationPress: (conversationId: string) => void;
}

export const ConversationPage = ({
  conversationId,
  onBack,
  onCasePress,
  onDevicePress,
  onConversationPress,
}: ConversationPageProps) => {
  const { sendMessage, markRead, retryMessage } = useConversationStore(
    useShallow((state) => ({
      sendMessage: state.sendMessage,
      markRead: state.markRead,
      retryMessage: state.retryMessage,
    }))
  );
  const conversations = useVisibleConversations();
  const { role } = useRoleStore();

  const conversation = conversations.find((item) => item.id === conversationId);

  const messageCount = conversation ? allMessages(conversation).length : 0;

  useEffect(() => {
    markRead(conversationId);
  }, [conversationId, markRead, messageCount]);

  if (!conversation) {
    return (
      <div className={s.page}>
        <MiniProgramNav variant="back" title="对话" onBack={onBack} />
        <div className={s.emptyState}>
          <Text variant="body-s" color="secondary">对话不存在</Text>
        </div>
      </div>
    );
  }

  const caseRef = conversation.caseRef;
  const isReadOnly = !isOwnConversation(conversation);

  if (isReadOnly && role !== 'admin') {
    return (
      <div className={s.page}>
        <MiniProgramNav variant="back" title="对话" onBack={onBack} />
        <div className={s.emptyState}>
          <Text variant="body-s" color="secondary">您无权查看该对话</Text>
        </div>
      </div>
    );
  }

  const record = caseRef
    ? repairData.flatMap((group) => group.records).find((item) => item.id === caseRef.id)
    : undefined;
  const title = caseRef ? `报修 ${caseRef.displayNo}` : '历史对话';
  const canReply = !isReadOnly && Boolean(openSegmentOf(conversation));

  return (
    <div className={s.page}>
      <MiniProgramNav variant="back" title={title} onBack={onBack} />

      {isReadOnly && (
        <div className={s.readOnlyBar}>
          <Text variant="body-s" color="secondary">
            {`${conversation.ownerName} ↔ ${activeEngineerName(conversation) ?? '服务工程师'} · 仅可查看`}
          </Text>
        </div>
      )}

      {caseRef && (
        <ConversationCaseHeader
          caseRef={caseRef}
          engineerName={conversationPartnerName(conversation)}
          onPress={onCasePress}
          onDevicePress={onDevicePress}
        />
      )}

      <ConversationThread
        segments={conversation.segments}
        onTransferPress={(target) => onConversationPress(target.conversationId)}
        onRetry={(messageId) => retryMessage(conversation.id, messageId)}
        onOpenCase={onCasePress}
        onOpenDevice={onDevicePress}
      />

      {canReply && (
        <MessageComposer
          onSend={(text, attachments) =>
            sendMessage(conversation.id, text, attachments, {
              engineerName: activeEngineerName(conversation) ?? record?.progress.engineer?.name,
              originWorkOrderId: record?.linkedWorkOrders?.[0]?.id,
            })
          }
        />
      )}

      {!canReply && !isReadOnly && caseRef && (
        <ConversationClosedNote repairStatus={record?.status} />
      )}
    </div>
  );
};
