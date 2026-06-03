import { Button } from '@filament/react/button';
import { Item } from '@filament/react/common';
import { ChevronRight } from '@filament/react/icons/chevron-right';
import { Search } from '@filament/react/search';
import { Tag } from '@filament/react/tag';
import { useMemo, useState } from 'react';
import { useLoadMore } from '../hooks/use-load-more';
import { WORK_ORDER_TYPE_LABEL } from '../types/work-order';
import type { WorkOrder, WorkOrderGroup } from '../types/work-order';
import { workOrderData } from '../utils/work-order-data';
import { useRoleStore } from '../stores/role-store';
import { woStyles } from './work-order-list-page.css';

const EMPTY_RESULTS: never[] = [];

const TYPE_SIGNAL: Record<WorkOrder['type'], 'success' | 'warning' | 'caution' | 'error' | undefined> = {
  repair: 'error',
  maintenance: 'success',
  fco: 'caution',
  install: 'warning',
};

interface WorkOrderCardProps {
  order: WorkOrder;
  isAdmin: boolean;
  onWorkOrderPress?: (orderId: string) => void;
}

const WorkOrderCard = ({ order, isAdmin, onWorkOrderPress }: WorkOrderCardProps) => {
  const isExpired = order.status === 'expired';
  const isPendingSign = order.status === 'pending-sign';
  const isCompleted = order.status === 'completed';
  const isInProgress = order.status === 'in-progress';

  const handleWorkOrderPress = () => onWorkOrderPress?.(order.id);

  return (
    <div className={isExpired ? woStyles.cardExpired : woStyles.card}>
      <div className={woStyles.cardBody}>
        <div className={woStyles.headerRow}>
          <Tag signal={TYPE_SIGNAL[order.type]} selectionMode="single" isSelected>
            {WORK_ORDER_TYPE_LABEL[order.type]}
          </Tag>
          <span className={woStyles.deviceName}>{order.deviceName}</span>
        </div>
        <div className={woStyles.metaRows}>
          <div className={woStyles.metaRow}>
            <span className={woStyles.metaLabel}>医院名称</span>
            <span className={woStyles.metaValue}>{order.hospital}</span>
          </div>
          <div className={woStyles.metaRow}>
            <span className={woStyles.metaLabel}>工单编号</span>
            <span className={woStyles.metaValue}>{order.workOrderNo}</span>
          </div>
          <div className={woStyles.metaRow}>
            <span className={woStyles.metaLabel}>请求时间</span>
            <span className={woStyles.metaValue}>{order.requestTime}</span>
          </div>
        </div>
      </div>

      <div className={isExpired ? woStyles.cardFooterExpired : woStyles.cardFooter}>
        {isExpired && <Tag>请求已失效</Tag>}
        {isPendingSign && (
          isAdmin ? (
            <button className={woStyles.detailActionBtn} onClick={handleWorkOrderPress} aria-label="查看详情">
              <span className={woStyles.metaLabel}>查看详情</span>
              <div className={woStyles.chevronWrap}>
                <ChevronRight aria-hidden="true" />
              </div>
            </button>
          ) : (
            <Button variant="primary" shape="round" onPress={handleWorkOrderPress}>
              去签字
            </Button>
          )
        )}
        {(isInProgress || isCompleted) && (
          <button className={woStyles.detailActionBtn} onClick={handleWorkOrderPress} aria-label="查看详情">
            <div className={woStyles.chevronWrap}>
              <ChevronRight aria-hidden="true" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

interface WorkOrderListPageProps {
  onWorkOrderPress?: (orderId: string) => void;
}

export const WorkOrderListPage = ({ onWorkOrderPress }: WorkOrderListPageProps) => {
  const { role } = useRoleStore();
  const isAdmin = role === 'admin';
  const [searchValue, setSearchValue] = useState('');

  const pendingCount = workOrderData.reduce(
    (acc, g) => acc + g.orders.filter((o) => o.status === 'pending-sign').length,
    0
  );

  const filteredGroups = workOrderData
    .map((g) => ({
      ...g,
      orders: g.orders.filter((o) => {
        if (!searchValue.trim()) return true;
        const q = searchValue.trim().toLowerCase();
        return (
          o.deviceName.toLowerCase().includes(q) ||
          o.workOrderNo.toLowerCase().includes(q) ||
          o.hospital.toLowerCase().includes(q)
        );
      }),
    }))
    .filter((g) => g.orders.length > 0);

  const allOrders = useMemo(() => filteredGroups.flatMap((g) => g.orders), [filteredGroups]);
  const { hasMore: ordersHasMore, loadMore: ordersLoadMore, total: ordersTotal, shown: ordersShown } = useLoadMore(allOrders, 5);

  const visibleGroups = useMemo((): WorkOrderGroup[] => {
    let remaining = ordersShown;
    const result: WorkOrderGroup[] = [];
    for (const g of filteredGroups) {
      if (remaining <= 0) break;
      const take = Math.min(g.orders.length, remaining);
      result.push({ ...g, orders: g.orders.slice(0, take) });
      remaining -= take;
    }
    return result;
  }, [filteredGroups, ordersShown]);

  return (
    <div className={woStyles.page}>
      <div className={woStyles.topBar}>
        <div className={woStyles.topBarSub}>
          {isAdmin
            ? `全院视图 · ${pendingCount} 条待签字`
            : `本人工单 · ${pendingCount} 条待签字`}
        </div>
      </div>

      <div className={woStyles.searchRow}>
        <Search
          items={EMPTY_RESULTS}
          aria-label="搜索工单"
          placeholder={isAdmin ? '设备名称 / 工单编号 / 医院' : '设备名称 / 工单编号'}
          onInputChange={setSearchValue}
          inputValue={searchValue}
          isFullWidth
        >
          {() => <Item key="empty">{null}</Item>}
        </Search>
      </div>

      <div className={woStyles.listSection}>
        {visibleGroups.map((group) => (
          <div key={group.month} className={woStyles.monthGroup}>
            <div className={woStyles.monthTitle}>{group.month}</div>
            {group.orders.map((order) => (
              <WorkOrderCard
                key={order.id}
                order={order}
                isAdmin={isAdmin}
                onWorkOrderPress={onWorkOrderPress}
              />
            ))}
          </div>
        ))}
        {ordersTotal === 0 && (
          <div className={woStyles.emptyState}>暂无工单记录</div>
        )}
        {ordersHasMore && (
          <div className={woStyles.loadMoreWrap}>
            <button type="button" className={woStyles.loadMoreBtn} onClick={ordersLoadMore}>
              加载更多
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
