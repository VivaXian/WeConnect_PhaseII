import { Fragment, useEffect, useRef } from 'react';
import type { ConversationSegment, TransferTarget } from '../types/conversation';
import type { QuickEntryPick } from './quick-entry-card';
import { QuickEntryCard } from './quick-entry-card';
import { SegmentDivider } from './segment-divider';
import { SegmentHeader } from './segment-header';
import { ThreadMessage } from './thread-message';
import { threadStyles } from './conversation-thread.css';

const messageCount = (segments: ConversationSegment[]) =>
  segments.reduce((total, segment) => total + segment.messages.length, 0);

const awaitsFirstReply = (segment: ConversationSegment): boolean =>
  segment.status === 'open' && !segment.messages.some((message) => message.senderRole === 'customer');

interface ConversationThreadProps {
  segments: ConversationSegment[];
  isClosed?: boolean;
  onTransferPress?: (target: TransferTarget) => void;
  onRetry?: (messageId: string) => void;
  onQuickEntry?: (pick: QuickEntryPick) => void;
  onOpenCase?: (caseId: string) => void;
  onOpenDevice?: (deviceName: string) => void;
}

export const ConversationThread = ({
  segments,
  isClosed = false,
  onTransferPress,
  onRetry,
  onQuickEntry,
  onOpenCase,
  onOpenDevice,
}: ConversationThreadProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const total = messageCount(segments);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [total]);

  return (
    <div className={threadStyles.thread}>
      {segments.map((segment, segmentIndex) => {
        const isLast = segmentIndex === segments.length - 1;
        return (
          <Fragment key={segment.id}>
            {segment.kind === 'inquiry' && (
              <SegmentHeader label="飞利浦客户响应中心" startedAt={segment.startedAt} />
            )}

            {segment.messages.map((message, index) => (
              <ThreadMessage
                key={message.id}
                messages={segment.messages}
                index={index}
                onTransferPress={onTransferPress}
                onRetry={onRetry}
                onOpenCase={onOpenCase}
                onOpenDevice={onOpenDevice}
              />
            ))}

            {isLast && onQuickEntry && awaitsFirstReply(segment) && (
              <QuickEntryCard onPick={onQuickEntry} />
            )}

            {segment.status === 'closed' && segment.kind === 'inquiry' && (
              <SegmentDivider text="本次咨询已结束" />
            )}

            {segment.status === 'closed' && segment.kind === 'work-order' && (
              isLast && isClosed ? (
                <SegmentDivider tone="end" text="本次报修已完成，对话已结束" />
              ) : (
                <SegmentDivider text="本次服务已结束" />
              )
            )}
          </Fragment>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};
