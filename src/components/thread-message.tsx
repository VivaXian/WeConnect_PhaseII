import { ChatBubble, ChatBubbleMedia } from '@filament/react/chat-bubble';
import { ErrorFill } from '@filament/react/icons/error-fill';
import type { ConversationMessage, TransferTarget } from '../types/conversation';
import { handoffAt } from '../utils/conversation-handoff';
import { DeviceSummaryCard } from './device-summary-card';
import { HandoffDivider } from './handoff-divider';
import { RoleAvatar } from './role-avatar';
import { SegmentDivider } from './segment-divider';
import { TransferCard } from './transfer-card';
import { threadStyles as s } from './conversation-thread.css';

const formatTimestamp = (iso: string): string => {
  const date = new Date(iso.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return '';
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${minutes}`;
};

const SenderAvatar = ({ message }: { message: ConversationMessage }) => (
  <RoleAvatar role={message.senderRole === 'rse' ? 'engineer' : 'ccc'} size={32} />
);

interface ThreadMessageProps {
  messages: ConversationMessage[];
  index: number;
  onTransferPress?: (target: TransferTarget) => void;
  onRetry?: (messageId: string) => void;
  onOpenCase?: (caseId: string) => void;
  onOpenDevice?: (deviceName: string) => void;
}

export const ThreadMessage = ({
  messages,
  index,
  onTransferPress,
  onRetry,
  onOpenCase,
  onOpenDevice,
}: ThreadMessageProps) => {
  const message = messages[index];
  const previous = messages[index - 1];
  const next = messages[index + 1];
  const isRunStart = previous?.senderRole !== message.senderRole || previous?.senderName !== message.senderName;
  const isRunEnd = next?.senderRole !== message.senderRole || next?.senderName !== message.senderName;

  if (message.senderRole === 'system') {
    if (message.transferTo && onTransferPress) {
      return <TransferCard target={message.transferTo} onPress={onTransferPress} />;
    }
    return <SegmentDivider text={message.content} />;
  }

  if (message.senderRole === 'customer') {
    const hasFailed = message.deliveryStatus === 'failed';
    return (
      <div className={s.sentRow}>
        {hasFailed && (
          <button
            type="button"
            className={s.retryButton}
            onClick={() => onRetry?.(message.id)}
            aria-label="发送失败，点击重新发送"
          >
            <ErrorFill className={s.failIcon} aria-hidden="true" />
          </button>
        )}
        <div className={s.sentBubble}>
          <ChatBubble
            variant="sent"
            state={isRunEnd ? 'latest' : 'previous'}
            timestamp={new Date(message.createdAt.replace(' ', 'T'))}
            timestampFormatter={() => formatTimestamp(message.createdAt)}
          >
            {message.attachments?.map((attachment) => (
              <ChatBubbleMedia key={attachment.id}>
                <img className={s.mediaImage} src={attachment.url} alt={attachment.name ?? '上传的图片'} />
              </ChatBubbleMedia>
            ))}
            {message.content}
          </ChatBubble>
        </div>
      </div>
    );
  }

  const handoff = isRunStart ? handoffAt(messages, index) : null;

  if (message.type === 'device-summary' && message.deviceId) {
    return (
      <>
        {handoff && <HandoffDivider role={handoff.role} name={handoff.name} />}
        <div className={s.cardRow}>
          <DeviceSummaryCard
            deviceId={message.deviceId}
            caseId={message.caseId}
            onOpenCase={onOpenCase}
            onOpenDevice={onOpenDevice}
          />
        </div>
      </>
    );
  }

  return (
    <>
      {handoff && <HandoffDivider role={handoff.role} name={handoff.name} />}
      <div className={s.receivedBubble}>
        <ChatBubble
          variant="received"
          state={isRunEnd ? 'latest' : 'previous'}
          avatar={isRunEnd ? <SenderAvatar message={message} /> : undefined}
          timestamp={new Date(message.createdAt.replace(' ', 'T'))}
          timestampFormatter={() => formatTimestamp(message.createdAt)}
        >
          {message.content}
        </ChatBubble>
      </div>
    </>
  );
};
