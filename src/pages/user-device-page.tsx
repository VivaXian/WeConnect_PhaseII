import { Item } from '@filament/react/common';
import { Search } from '@filament/react/search';
import { Text } from '@filament/react/text';
import { useState } from 'react';
import { DeviceCard } from '../components/device-card';
import type { Device } from '../types/device';
import { DEVICE_STATUS_LABEL, DEVICE_STATUS_SIGNAL } from '../types/device';
import { deviceList } from '../utils/device-data';
import { userDeviceStyles } from './user-device-page.css';

const EMPTY_RESULTS: never[] = [];

const MY_DEVICES = deviceList.slice(0, 2);
const RECENT_DEVICES = deviceList.slice(3, 5);

const TODAY = new Date();

function pmThisMonth(d: Device): boolean {
  if (!d.pmNextDate) return false;
  const target = new Date(d.pmNextDate);
  const days = Math.round((target.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
  return days >= 0 && days <= 30;
}

function statusTag(d: Device) {
  const tags: { label: string; signal?: 'success' | 'warning' | 'caution' | 'error' }[] = [
    { label: DEVICE_STATUS_LABEL[d.status], signal: DEVICE_STATUS_SIGNAL[d.status] as 'success' | 'warning' | 'caution' | 'error' },
  ];
  if (pmThisMonth(d) && d.pmNextDate) {
    const [, month, day] = d.pmNextDate.split('-');
    tags.push({ label: `本月PM · ${month}-${day}` });
  }
  return tags;
}

interface UserDevicePageProps {
  onDevicePress?: (device: Device) => void;
}

export const UserDevicePage = ({ onDevicePress }: UserDevicePageProps) => {
  const [searchValue, setSearchValue] = useState('');

  const query = searchValue.trim().toLowerCase();
  const searchResults = query
    ? deviceList.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.type.toLowerCase().includes(query) ||
          d.department.toLowerCase().includes(query)
      )
    : null;

  return (
    <div className={userDeviceStyles.page}>
      <div className={userDeviceStyles.topBar}>
        <div className={userDeviceStyles.topBarTitle}>设备</div>
        <div className={userDeviceStyles.topBarSub}>WeConnect医院 · 我的设备</div>
      </div>

      <div className={userDeviceStyles.searchRow}>
        <Search
          items={EMPTY_RESULTS}
          aria-label="搜索设备"
          placeholder="设备名称 / 科室"
          onInputChange={setSearchValue}
          inputValue={searchValue}
          isFullWidth
        >
          {() => <Item key="empty">{null}</Item>}
        </Search>
      </div>

      {searchResults ? (
        <div className={userDeviceStyles.section}>
          <div className={userDeviceStyles.sectionTitle}>搜索结果（{searchResults.length} 台）</div>
          <div className={userDeviceStyles.list}>
            {searchResults.length > 0 ? (
              searchResults.map((d) => <DeviceCard key={d.id} device={d} tags={statusTag(d)} onPress={() => onDevicePress?.(d)} />)
            ) : (
              <div className={userDeviceStyles.emptyState}>
                <Text variant="body-m" color="secondary">未找到匹配设备</Text>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className={userDeviceStyles.section}>
            <div className={userDeviceStyles.sectionTitle}>我的设备</div>
            <div className={userDeviceStyles.list}>
              {MY_DEVICES.map((d) => (
                <DeviceCard key={d.id} device={d} tags={statusTag(d)} onPress={() => onDevicePress?.(d)} />
              ))}
            </div>
          </div>
          <div className={userDeviceStyles.section}>
            <div className={userDeviceStyles.sectionTitle}>最近查看</div>
            <div className={userDeviceStyles.list}>
              {RECENT_DEVICES.map((d) => (
                <DeviceCard key={d.id} device={d} tags={statusTag(d)} onPress={() => onDevicePress?.(d)} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
