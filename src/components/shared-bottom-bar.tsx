import { Badge } from '@filament/react/badge';
import { BottomBar } from '@filament/react/bottom-bar';
import { Item } from '@filament/react/common';
import { ClipboardList } from '@filament/react/icons/clipboard-list';
import { ClipboardPerson } from '@filament/react/icons/clipboard-person';
import { Compass } from '@filament/react/icons/compass';
import { PersonPortraitCircle } from '@filament/react/icons/person-portrait-circle';
import { TabContext, TabPanels, Tabs } from '@filament/react/tabs';

// 报修 | 设备 | 工单 | 我的 — same for both roles, role-aware content within each tab
// 消息中心 is inside 我的, not a bottom tab
export type AppTab = 'repair' | 'devices' | 'orders' | 'profile';

interface SharedBottomBarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  pendingOrderCount?: number;
  unreadMessageCount?: number;
}

const EMPTY_PANEL_STYLE = { display: 'none' };

export const SharedBottomBar = ({
  activeTab,
  onTabChange,
  pendingOrderCount = 0,
  unreadMessageCount = 0,
}: SharedBottomBarProps) => (
  <TabContext
    selectedKey={activeTab}
    onSelectionChange={(key) => onTabChange(key as AppTab)}
  >
    <TabPanels style={EMPTY_PANEL_STYLE}>
      <Item key="repair">{null}</Item>
      <Item key="devices">{null}</Item>
      <Item key="orders">{null}</Item>
      <Item key="profile">{null}</Item>
    </TabPanels>
    <BottomBar>
      <Tabs placement="bottom" alignment="center">
        <Item key="devices">
          <Compass aria-hidden="true" />
          设备
        </Item>
        <Item key="repair">
          <ClipboardPerson aria-hidden="true" />
          报修
        </Item>
        <Item
          key="orders"
          aria-label={`工单${pendingOrderCount > 0 ? `，${pendingOrderCount}条待签字` : ''}`}
        >
          <Badge value={pendingOrderCount > 0 ? pendingOrderCount : undefined} aria-hidden="true">
            <ClipboardList aria-hidden="true" />
          </Badge>
          工单
        </Item>
        <Item
          key="profile"
          aria-label={`我的${unreadMessageCount > 0 ? `，${unreadMessageCount}条未读消息` : ''}`}
        >
          <Badge value={unreadMessageCount > 0 ? unreadMessageCount : undefined} aria-hidden="true">
            <PersonPortraitCircle aria-hidden="true" />
          </Badge>
          我的
        </Item>
      </Tabs>
    </BottomBar>
  </TabContext>
);
