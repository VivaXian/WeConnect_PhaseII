import clsx from 'clsx';
import { Button } from '@filament/react/button';
import { Badge } from '@filament/react/badge';
import { Text } from '@filament/react/text';
import { Chat } from '@filament/react/icons/chat';
import { ChevronRight } from '@filament/react/icons/chevron-right';
import type { LinkedWorkOrder } from '../types/repair';
import { WORK_ORDER_SERVICE_MODE_LABEL } from '../types/work-order';
import { CASE_CONVERSATION_LABEL } from '../utils/service-support-copy';
import { workOrderInfoStyles as s } from './work-order-info-section.css';

export interface ConversationEntry {
  time: string;
  unread: number;
  onPress: () => void;
}

interface WorkOrderInfoSectionProps {
  workOrders: LinkedWorkOrder[];
  onWorkOrderPress: (workOrderId: string) => void;
  conversation?: ConversationEntry;
  isStatic?: boolean;
}

interface WorkOrderRowProps {
  workOrder: LinkedWorkOrder;
  isStatic: boolean;
  onWorkOrderPress: (workOrderId: string) => void;
}

interface WorkOrderBodyProps {
  workOrder: LinkedWorkOrder;
  showStatus: boolean;
}

const WorkOrderBody = ({ workOrder, showStatus }: WorkOrderBodyProps) => (
  <div className={s.textContainer}>
    <div className={s.titleRow}>
      <span className={s.typePill}>
        {WORK_ORDER_SERVICE_MODE_LABEL[workOrder.serviceMode ?? 'onsite']}
      </span>
      <Text variant="body-m" weight="bold">
        {workOrder.workOrderNo}
      </Text>
    </div>
    {showStatus && (
      <div className={s.metaRows}>
        <div className={s.metaRow}>
          <Text variant="body-s" color="secondary" width={56} flexShrink={0}>
            工单状态
          </Text>
          <Text variant="body-s">{workOrder.status}</Text>
        </div>
        {workOrder.requestTime && (
          <div className={s.metaRow}>
            <Text variant="body-s" color="secondary" width={56} flexShrink={0}>
              请求时间
            </Text>
            <Text variant="body-s" color="secondary">
              {workOrder.requestTime}
            </Text>
          </div>
        )}
      </div>
    )}
  </div>
);

const WorkOrderRow = ({ workOrder, isStatic, onWorkOrderPress }: WorkOrderRowProps) => {
  if (isStatic) {
    return (
      <div className={s.item}>
        <WorkOrderBody workOrder={workOrder} showStatus={false} />
      </div>
    );
  }

  if (workOrder.status === '待签字') {
    return (
      <div className={s.item}>
        <WorkOrderBody workOrder={workOrder} showStatus />
        <div className={s.action}>
          <Button variant="primary" onPress={() => onWorkOrderPress(workOrder.id)}>
            去签字
          </Button>
        </div>
      </div>
    );
  }

  const isRemote = workOrder.serviceMode === 'remote';
  const isOpenable = !isRemote && workOrder.status !== '进行中';

  if (!isOpenable) {
    return (
      <div className={s.item}>
        <WorkOrderBody workOrder={workOrder} showStatus />
      </div>
    );
  }

  return (
    <button type="button" className={s.itemButton} onClick={() => onWorkOrderPress(workOrder.id)}>
      <WorkOrderBody workOrder={workOrder} showStatus />
      <ChevronRight className={s.chevron} aria-hidden="true" />
    </button>
  );
};

export const WorkOrderInfoSection = ({
  workOrders,
  onWorkOrderPress,
  conversation,
  isStatic = false,
}: WorkOrderInfoSectionProps) => {
  if (workOrders.length === 0 && !conversation) {
    return null;
  }

  return (
    <div className={s.section}>
      <div className={s.header}>
        <span className={s.indicator} aria-hidden="true" />
        <span className={s.headerTitle}>服务记录</span>
      </div>
      {conversation && (
        <button
          type="button"
          className={s.conversationCard}
          onClick={conversation.onPress}
          aria-label={`${CASE_CONVERSATION_LABEL}，飞利浦服务工程师${conversation.unread > 0 ? `，${conversation.unread}条未读消息` : ''}`}
        >
          <Chat className={s.conversationIcon} aria-hidden="true" />
          <span className={s.conversationBody}>
            <span className={s.conversationTitle}>{CASE_CONVERSATION_LABEL}</span>
            <span className={s.conversationMeta}>飞利浦服务工程师</span>
          </span>
          {conversation.unread > 0 && (
            <Badge value={conversation.unread} maxValue={99} aria-hidden="true" />
          )}
          <span className={s.conversationTime}>{conversation.time}</span>
          <ChevronRight className={s.conversationChevron} aria-hidden="true" />
        </button>
      )}
      {workOrders.length > 0 && (
        <>
          <span className={clsx(s.groupLabel, conversation && s.groupLabelSpaced)}>工单信息</span>
          {workOrders.map((workOrder) => (
            <WorkOrderRow
              key={workOrder.id}
              workOrder={workOrder}
              isStatic={isStatic}
              onWorkOrderPress={onWorkOrderPress}
            />
          ))}
        </>
      )}
    </div>
  );
};
