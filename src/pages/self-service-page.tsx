import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { GENERAL_CONVERSATION_ID } from '../types/conversation';
import { useConversationStore } from '../stores/conversation-store';
import { useVisibleConversations } from '../hooks/use-visible-conversations';
import { allMessages } from '../utils/conversation-status';
import { ConversationThread } from '../components/conversation-thread';
import { MessageComposer } from '../components/message-composer';
import { QuickEntryCard } from '../components/quick-entry-card';
import type { QuickEntryStep } from '../components/quick-entry-card';
import { RepairThreadStrip } from '../components/repair-thread-strip';
import { ServiceWelcomeCard } from '../components/service-welcome-card';
import { selfServiceStyles as s } from './self-service-page.css';

interface SelfServicePageProps {
  onConversationPress: (conversationId: string) => void;
  onHistoryPress: () => void;
  onFaqPress: () => void;
  onCasePress: (caseId: string) => void;
  onDevicePress: (deviceName: string) => void;
}

export const SelfServicePage = ({
  onConversationPress,
  onHistoryPress,
  onFaqPress,
  onCasePress,
  onDevicePress,
}: SelfServicePageProps) => {
  const { sendMessage, submitQuickEntry, markRead, retryMessage, startNewInquirySession } = useConversationStore(
    useShallow((state) => ({
      sendMessage: state.sendMessage,
      submitQuickEntry: state.submitQuickEntry,
      markRead: state.markRead,
      retryMessage: state.retryMessage,
      startNewInquirySession: state.startNewInquirySession,
    }))
  );
  const conversations = useVisibleConversations();
  const [pickerStep, setPickerStep] = useState<QuickEntryStep | null>(null);

  const conversation = conversations.find((item) => item.id === GENERAL_CONVERSATION_ID);
  const messageCount = conversation ? allMessages(conversation).length : 0;

  useEffect(() => {
    markRead(GENERAL_CONVERSATION_ID);
  }, [markRead, messageCount]);

  // 演示用：每次进页就开新的一段咨询，欢迎卡跟着重出
  useEffect(() => {
    startNewInquirySession(GENERAL_CONVERSATION_ID);
  }, [startNewInquirySession]);

  if (!conversation) return null;

  return (
    <div className={s.page}>
      <RepairThreadStrip
        onConversationPress={onConversationPress}
        onHistoryPress={onHistoryPress}
      />

      <ConversationThread
        segments={conversation.segments}
        inquiryHead={({ showPresets }) => (
          <ServiceWelcomeCard showPresets={showPresets} onPresetPress={setPickerStep} />
        )}
        onTransferPress={(target) => onConversationPress(target.conversationId)}
        onRetry={(messageId) => retryMessage(conversation.id, messageId)}
        onOpenCase={onCasePress}
        onOpenDevice={onDevicePress}
      />

      {pickerStep && (
        <div className={s.pickerPanel}>
          <QuickEntryCard
            initialStep={pickerStep}
            hint={null}
            onClose={() => setPickerStep(null)}
            onPick={(pick) => {
              setPickerStep(null);
              const transferTo = submitQuickEntry(conversation.id, pick.text, {
                topic: pick.topic,
                deviceId: pick.deviceId,
                caseId: pick.caseId,
              });
              if (transferTo) onConversationPress(transferTo);
            }}
          />
        </div>
      )}

      <MessageComposer
        onPickContext={() => setPickerStep((step) => (step ? null : 'root'))}
        onRepairPress={onHistoryPress}
        onFaqPress={onFaqPress}
        onSend={(text, attachments) => {
          sendMessage(conversation.id, text, attachments, {});
          setPickerStep(null);
        }}
      />
    </div>
  );
};
