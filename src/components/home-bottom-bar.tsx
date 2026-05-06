import { Badge } from '@filament/react/badge';
import { BottomBar } from '@filament/react/bottom-bar';
import { Item } from '@filament/react/common';
import { ClipboardPerson } from '@filament/react/icons/clipboard-person';
import { PersonPortraitCircle } from '@filament/react/icons/person-portrait-circle';
import { Placeholder } from '@filament/react/icons/placeholder';
import { TabContext, TabPanels, Tabs } from '@filament/react/tabs';

const EMPTY_PANEL_STYLE = { display: 'none' };

export const HomeBottomBar = () => (
  <TabContext>
    <TabPanels style={EMPTY_PANEL_STYLE}>
      <Item key="my-repairs">{null}</Item>
      <Item key="work-orders">{null}</Item>
      <Item key="profile">{null}</Item>
    </TabPanels>
    <BottomBar>
      <Tabs placement="bottom" alignment="center">
        <Item key="my-repairs">
          <Placeholder aria-hidden="true" />
          我的报修
        </Item>
        <Item key="work-orders" aria-label="工单列表，3条待处理">
          <Badge value={3} aria-hidden="true">
            <ClipboardPerson aria-hidden="true" />
          </Badge>
          工单列表
        </Item>
        <Item key="profile">
          <PersonPortraitCircle aria-hidden="true" />
          我的
        </Item>
      </Tabs>
    </BottomBar>
  </TabContext>
);
