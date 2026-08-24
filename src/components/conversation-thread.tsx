import { Fragment, useEffect, useRef } from 'react';
import type { ConversationSegment, TransferTarget } from '../types/conversation';
import { DateDivider } from './date-divider';
import { SegmentDivider } from './segment-divider';
import { SegmentHeader } from './segment-header';
import { ThreadMessage } from './thread-message';
import { threadStyles } from './conversation-thread.css';

const messageCount = (segments: ConversationSegment[]) =>
  segments.reduce((total, segment) => total + segment.messages.length, 0);

const dayKey = (iso: string): string => iso.slice(0, 10);

const dayLabel = (iso: string): string => {
  const date = new Date(iso.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

/** 跨分段地标出每一天的首条消息，对话对用户是一条连续上下文，不按工单切分 */
const dayStartMessageIds = (segments: ConversationSegment[]): Map<string, string> =>
  segments
    .flatMap((segment) => segment.messages)
    .reduce((acc, message) => {
      const key = dayKey(message.createdAt);
      return acc.has(key) ? acc : acc.set(key, message.id);
    }, new Map<string, string>());

interface ConversationThreadProps {
  segments: ConversationSegment[];
  onTransferPress?: (target: TransferTarget) => void;
  onRetry?: (messageId: string) => void;
  onOpenCase?: (caseId: string) => void;
  onOpenDevice?: (deviceName: string) => void;
}

export const ConversationThread = ({
  segments,
  onTransferPress,
  onRetry,
  onOpenCase,
  onOpenDevice,
}: ConversationThreadProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const total = messageCount(segments);
  const dayStarts = dayStartMessageIds(segments);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [total]);

  return (
    <div className={threadStyles.thread}>
      {segments.map((segment) => {
        const isMuted = segment.status === 'closed';
        return (
          <Fragment key={segment.id}>
            {segment.kind === 'inquiry' && (
              <SegmentHeader label="飞利浦客户响应中心" startedAt={segment.startedAt} />
            )}

            {segment.messages.map((message, index) => (
              <Fragment key={message.id}>
                {dayStarts.get(dayKey(message.createdAt)) === message.id && (
                  <DateDivider label={dayLabel(message.createdAt)} />
                )}
                <ThreadMessage
                  messages={segment.messages}
                  index={index}
                  isMuted={isMuted}
                  onTransferPress={onTransferPress}
                  onRetry={onRetry}
                  onOpenCase={onOpenCase}
                  onOpenDevice={onOpenDevice}
                />
              </Fragment>
            ))}

            {segment.status === 'closed' && segment.kind === 'inquiry' && (
              <SegmentDivider text="本次咨询已结束" />
            )}

            {segment.status === 'closed' && segment.kind === 'work-order' && (
              <SegmentDivider tone="end" text="本次在线沟通已结束" />
            )}
          </Fragment>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};
