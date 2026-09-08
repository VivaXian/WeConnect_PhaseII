import type { Key, ReactNode } from 'react';
import { Badge } from '@filament/react/badge';
import { BottomBar } from '@filament/react/bottom-bar';
import { Item } from '@filament/react/common';
import { TabContext, Tabs } from '@filament/react/tabs';
import { ClipboardList } from '@filament/react/icons/clipboard-list';
import { ClipboardPerson } from '@filament/react/icons/clipboard-person';
import { Compass } from '@filament/react/icons/compass';
import { PersonPortraitCircle } from '@filament/react/icons/person-portrait-circle';
import { bottomBarStyles as s } from './shared-bottom-bar.css';

export type AppTab = 'repair' | 'devices' | 'orders' | 'profile';

interface SharedBottomBarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  pendingOrderCount?: number;
  unreadMessageCount?: number;
  unreadConversationCount?: number;
}

const withCount = (label: string, count: number, countLabel: string) =>
  count > 0 ? `${label}，${count}${countLabel}` : label;

const TabIcon = ({
  icon,
  count,
  variant = 'default',
}: {
  icon: ReactNode;
  count: number;
  variant?: 'default' | 'dot';
}) => {
  const slot = <span className={s.iconSlot}>{icon}</span>;
  return count > 0 ? (
    <Badge value={count} maxValue={99} variant={variant} aria-hidden="true">
      {slot}
    </Badge>
  ) : (
    slot
  );
};

export const SharedBottomBar = ({
  activeTab,
  onTabChange,
  pendingOrderCount = 0,
  unreadMessageCount = 0,
  unreadConversationCount = 0,
}: SharedBottomBarProps) => {
  // 远程服务支持的未读优先按数字展示；只有通知中心有未读时降级为红点
  const hasConversationUnread = unreadConversationCount > 0;
  const profileCount = hasConversationUnread
    ? unreadConversationCount
    : unreadMessageCount > 0
      ? 1
      : 0;
  const profileLabel = hasConversationUnread
    ? withCount('我的', unreadConversationCount, '条未读消息')
    : unreadMessageCount > 0
      ? '我的，有未读通知'
      : '我的';

  return (
    <TabContext
      selectedKey={activeTab}
      onSelectionChange={(key: Key) => onTabChange(key as AppTab)}
    >
      <BottomBar background="primary" className={s.bar}>
        <Tabs
          isFullWidth
          iconPosition="top"
          placement="bottom"
          alignment="center"
          aria-label="主导航"
        >
          <Item key="devices" textValue="设备" aria-label="设备">
            <TabIcon count={0} icon={<Compass />} />
            <span>设备</span>
          </Item>
          <Item key="repair" textValue="报修" aria-label="报修">
            <TabIcon count={0} icon={<ClipboardPerson />} />
            <span>报修</span>
          </Item>
          <Item
            key="orders"
            textValue="工单"
            aria-label={withCount('工单', pendingOrderCount, '条待签字')}
          >
            <TabIcon count={pendingOrderCount} icon={<ClipboardList />} />
            <span>工单</span>
          </Item>
          <Item key="profile" textValue="我的" aria-label={profileLabel}>
            <TabIcon
              count={profileCount}
              variant={hasConversationUnread ? 'default' : 'dot'}
              icon={<PersonPortraitCircle />}
            />
            <span>我的</span>
          </Item>
        </Tabs>
      </BottomBar>
    </TabContext>
  );
};
