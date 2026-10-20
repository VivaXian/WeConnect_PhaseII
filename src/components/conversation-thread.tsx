import { Fragment, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { ConversationSegment, TransferTarget } from '../types/conversation';
import { DateDivider } from './date-divider';
import { SegmentDivider } from './segment-divider';
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

/** 同一天内开的新会话，日期已经标过了，改标时间点 */
const timeLabel = (iso: string): string => {
  const date = new Date(iso.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const headId = (segmentId: string) => `head-${segmentId}`;

/** 落底后还允许自动补滚的窗口，过了就不再跟用户的滚动抢 */
const PIN_WINDOW_MS = 800;

/**
 * 跨分段地标出每一天的第一个元素。序头（欢迎卡）也算一个时间点，
 * 否则空的新会话上面就没有日期了。
 */
const dayStartIds = (segments: ConversationSegment[], hasHeads: boolean): Map<string, string> => {
  const timeline = segments.flatMap((segment) => [
    ...(hasHeads && segment.kind === 'inquiry'
      ? [{ key: dayKey(segment.startedAt), id: headId(segment.id) }]
      : []),
    ...segment.messages.map((message) => ({ key: dayKey(message.createdAt), id: message.id })),
  ]);

  return timeline.reduce(
    (acc, item) => (acc.has(item.key) ? acc : acc.set(item.key, item.id)),
    new Map<string, string>()
  );
};

interface ConversationThreadProps {
  segments: ConversationSegment[];
  /** 每段咨询的序头。历史段也要留着，否则用户当时看到的画面就不见了 */
  inquiryHead?: (options: { showPresets: boolean }) => ReactNode;
  onTransferPress?: (target: TransferTarget) => void;
  onRetry?: (messageId: string) => void;
  onOpenCase?: (caseId: string) => void;
  onOpenDevice?: (deviceName: string) => void;
}

export const ConversationThread = ({
  segments,
  inquiryHead,
  onTransferPress,
  onRetry,
  onOpenCase,
  onOpenDevice,
}: ConversationThreadProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstPaint = useRef(true);
  const pinUntil = useRef(0);
  const total = messageCount(segments);
  const segmentCount = segments.length;
  const lastInquiryIndex = segments.map((segment) => segment.kind).lastIndexOf('inquiry');
  const dayStarts = dayStartIds(segments, Boolean(inquiryHead));

  // 序头是最后一个元素，所以滑到底天然就是「欢迎卡 + 上面露出历史」
  useEffect(() => {
    pinUntil.current = Date.now() + PIN_WINDOW_MS;
    bottomRef.current?.scrollIntoView({
      behavior: isFirstPaint.current ? 'auto' : 'smooth',
      block: 'end',
    });
    isFirstPaint.current = false;
  }, [total, segmentCount]);

  /**
   * 落底之后内容还会继续长高：父层补新会话段、字体和图片加载完重排。
   * 只在落底后的短暂窗口内补滚，窗口之外不抢用户往上翻的滚动。
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      if (Date.now() > pinUntil.current) return;
      container.scrollTop = container.scrollHeight;
    });
    Array.from(container.children).forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, [total, segmentCount]);

  return (
    <div className={threadStyles.thread} ref={containerRef}>
      {segments.map((segment, segmentIndex) => {
        // 咨询段永远不置灰：客服是 7×24 的，没有「关闭」这回事
        const isMuted = segment.status === 'closed' && segment.kind === 'work-order';
        const hasHead = Boolean(inquiryHead) && segment.kind === 'inquiry';

        return (
          <Fragment key={segment.id}>
            {hasHead && inquiryHead && (
              <div className={threadStyles.sessionHead}>
                <DateDivider
                  label={
                    dayStarts.get(dayKey(segment.startedAt)) === headId(segment.id)
                      ? dayLabel(segment.startedAt)
                      : timeLabel(segment.startedAt)
                  }
                />
                {inquiryHead({
                  showPresets: segmentIndex === lastInquiryIndex && segment.messages.length === 0,
                })}
              </div>
            )}
            {segment.messages.map((message, index) => (
              <Fragment key={message.id}>
                {dayStarts.get(dayKey(message.createdAt)) === message.id && (
                  <DateDivider label={dayLabel(message.createdAt)} />
                )}
                <ThreadMessage
                  messages={segment.messages}
                  index={index}
                  segmentKind={segment.kind}
                  isMuted={isMuted}
                  onTransferPress={onTransferPress}
                  onRetry={onRetry}
                  onOpenCase={onOpenCase}
                  onOpenDevice={onOpenDevice}
                />
              </Fragment>
            ))}

            {segment.status === 'closed' && segment.kind === 'work-order' && (
              <SegmentDivider tone="end" text="本次远程服务已结束" />
            )}
          </Fragment>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};
