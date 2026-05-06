import { Badge } from '@filament/react/badge';
import { BottomBar } from '@filament/react/bottom-bar';
import { Item } from '@filament/react/common';
import { ClipboardPerson } from '@filament/react/icons/clipboard-person';
import { PersonPortraitCircle } from '@filament/react/icons/person-portrait-circle';
import { Settings } from '@filament/react/icons/settings';
import { TabContext, TabPanels, Tabs } from '@filament/react/tabs';

type AdminTab = 'devices' | 'work-orders' | 'profile';

interface AdminBottomBarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  pendingWorkOrders?: number;
}

const EMPTY_PANEL_STYLE = { display: 'none' };

export const AdminBottomBar = ({
  activeTab,
  onTabChange,
  pendingWorkOrders = 0,
}: AdminBottomBarProps) => (
  <TabContext selectedKey={activeTab} onSelectionChange={(key) => onTabChange(key as AdminTab)}>
    <TabPanels style={EMPTY_PANEL_STYLE}>
      <Item key="devices">{null}</Item>
      <Item key="work-orders">{null}</Item>
      <Item key="profile">{null}</Item>
    </TabPanels>
    <BottomBar>
      <Tabs placement="bottom" alignment="center">
        <Item key="devices">
          <Settings aria-hidden="true" />
          设备管理
        </Item>
        <Item key="work-orders" aria-label={`工单管理${pendingWorkOrders > 0 ? `，${pendingWorkOrders}条待处理` : ''}`}>
          <Badge value={pendingWorkOrders > 0 ? pendingWorkOrders : undefined} aria-hidden="true">
            <ClipboardPerson aria-hidden="true" />
          </Badge>
          工单管理
        </Item>
        <Item key="profile">
          <PersonPortraitCircle aria-hidden="true" />
          我的
        </Item>
      </Tabs>
    </BottomBar>
  </TabContext>
);
