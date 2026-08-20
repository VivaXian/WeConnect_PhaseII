import { useEffect } from 'react';
import { Button } from '@filament/react/button';
import { Text } from '@filament/react/text';
import { ChevronRight } from '@filament/react/icons/chevron-right';
import { useShallow } from 'zustand/react/shallow';
import type { CaseRef } from '../types/conversation';
import { useConversationStore } from '../stores/conversation-store';
import { useRoleStore } from '../stores/role-store';
import {
  activeEngineerName,
  allMessages,
  isConversationClosed,
  openSegmentOf,
} from '../utils/conversation-status';
import { isOwnConversation } from '../utils/conversation-grouping';
import { repairData } from '../utils/repair-data';
import { MiniProgramNav } from '../components/mini-program-nav';
import { ConversationThread } from '../components/conversation-thread';
import { ThreadPartnerBar } from '../components/thread-partner-bar';
import { MessageComposer } from '../components/message-composer';
import { conversationPageStyles as s } from './conversation-page.css';

interface ConversationPageProps {
  conversationId: string;
  onBack: () => void;
  onCasePress: (caseId: string) => void;
  onDevicePress: (deviceName: string) => void;
  onStartGeneralInquiry: (relatedCaseRef?: CaseRef) => void;
  onConversationPress: (conversationId: string) => void;
  attachedCase?: CaseRef;
}

export const ConversationPage = ({
  conversationId,
  onBack,
  onCasePress,
  onDevicePress,
  onStartGeneralInquiry,
  onConversationPress,
  attachedCase,
}: ConversationPageProps) => {
  const { conversations, sendMessage, submitQuickEntry, markRead, retryMessage, closeActiveSegment } = useConversationStore(
    useShallow((state) => ({
      conversations: state.conversations,
      sendMessage: state.sendMessage,
      submitQuickEntry: state.submitQuickEntry,
      markRead: state.markRead,
      retryMessage: state.retryMessage,
      closeActiveSegment: state.closeActiveSegment,
    }))
  );
  const { role } = useRoleStore();

  const conversation = conversations.find((item) => item.id === conversationId);

  const messageCount = conversation ? allMessages(conversation).length : 0;

  useEffect(() => {
    markRead(conversationId);
  }, [conversationId, markRead, messageCount]);

  if (!conversation) {
    return (
      <div className={s.page}>
        <MiniProgramNav variant="back" title="客户响应中心" onBack={onBack} />
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
  const isClosed = isConversationClosed(conversation);
  const title = caseRef ? `报修 ${caseRef.displayNo}` : '客户响应中心';
  const isGeneral = conversation.scope === 'general';
  const openSegment = openSegmentOf(conversation);
  const canEndInquiry =
    isGeneral && Boolean(openSegment?.messages.some((message) => message.senderRole === 'customer'));

  return (
    <div className={s.page}>
      <MiniProgramNav variant="back" title={title} onBack={onBack} />

      {isReadOnly && (
        <div className={s.readOnlyBar}>
          <Text variant="body-s" color="secondary">
            {`${conversation.ownerName} ↔ ${activeEngineerName(conversation) ?? '客户响应中心'} · 仅可查看`}
          </Text>
        </div>
      )}

      {caseRef && (
        <div className={s.caseBar}>
          <button type="button" className={s.caseBarMain} onClick={() => onCasePress(caseRef.id)}>
            <span className={s.caseBarDevice}>{caseRef.deviceName}</span>
            <span className={s.caseBarMeta}>
              {caseRef.displayNo}
              {record?.statusTitle ? ` · ${record.statusTitle}` : ''}
            </span>
          </button>
          <button
            type="button"
            className={s.caseBarLink}
            onClick={() => onDevicePress(caseRef.deviceName)}
          >
            设备详情
            <ChevronRight className={s.caseBarChevron} aria-hidden="true" />
          </button>
        </div>
      )}

      {caseRef && <ThreadPartnerBar conversation={conversation} isClosed={isClosed} />}

      <ConversationThread
        segments={conversation.segments}
        isClosed={isClosed}
        onTransferPress={(target) => onConversationPress(target.conversationId)}
        onRetry={(messageId) => retryMessage(conversation.id, messageId)}
        onQuickEntry={
          !isReadOnly && !isClosed && conversation.scope === 'general' && !attachedCase
            ? (pick) => submitQuickEntry(conversation.id, pick)
            : undefined
        }
        onOpenCase={onCasePress}
        onOpenDevice={onDevicePress}
      />

      {isReadOnly ? null : isClosed ? (
        <div className={s.closedCard}>
          <Button variant="primary" isFullWidth onPress={() => onStartGeneralInquiry(caseRef)}>
            再次咨询
          </Button>
        </div>
      ) : (
        <MessageComposer
          relatedCase={isGeneral ? undefined : caseRef}
          initialDraft={isGeneral && attachedCase ? `我要咨询报修单 ${attachedCase.displayNo}` : undefined}
          onQuickEntry={isGeneral ? (pick) => submitQuickEntry(conversation.id, pick) : undefined}
          onEndInquiry={canEndInquiry ? () => closeActiveSegment(conversation.id) : undefined}
          onSend={(text, attachments) =>
            sendMessage(conversation.id, text, attachments, {
              engineerName: activeEngineerName(conversation) ?? record?.progress.engineer?.name,
              originWorkOrderId: record?.linkedWorkOrders?.[0]?.id,
            })
          }
        />
      )}
    </div>
  );
};
