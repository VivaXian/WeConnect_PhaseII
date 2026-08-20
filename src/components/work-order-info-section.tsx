import { Button } from '@filament/react/button';
import { Text } from '@filament/react/text';
import { ChevronRight } from '@filament/react/icons/chevron-right';
import type { LinkedWorkOrder } from '../types/repair';
import { WORK_ORDER_SERVICE_MODE_LABEL } from '../types/work-order';
import { workOrderInfoStyles as s } from './work-order-info-section.css';

interface WorkOrderInfoSectionProps {
  workOrders: LinkedWorkOrder[];
  onWorkOrderPress: (workOrderId: string) => void;
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
  isStatic = false,
}: WorkOrderInfoSectionProps) => {
  if (workOrders.length === 0) {
    return null;
  }

  return (
    <div className={s.section}>
      <div className={s.header}>
        <span className={s.indicator} aria-hidden="true" />
        <span className={s.headerTitle}>工单信息</span>
      </div>
      {workOrders.map((workOrder) => (
        <WorkOrderRow
          key={workOrder.id}
          workOrder={workOrder}
          isStatic={isStatic}
          onWorkOrderPress={onWorkOrderPress}
        />
      ))}
    </div>
  );
};
