import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { MessageCategory } from '../types/message';
import { useMessageStore } from '../stores/message-store';
import { useDeviceCustomNamesStore } from '../stores/device-custom-names-store';
import { detailStyles } from './message-detail-page.css';

// Summary text color for device risk notes
const SUMMARY_STYLE: Record<MessageCategory, keyof typeof detailStyles> = {
  'contract-expired': 'deviceSummaryDanger',
  'contract-expiry': 'deviceSummaryWarn',
  'acceptance': 'deviceSummaryWarn',
  'pm-plan': 'deviceSummaryNeutral',
  'pm-risk': 'deviceSummaryWarn',
  'permission-upgrade': 'deviceSummaryNeutral',
  'order-update': 'deviceSummaryNeutral',
};

export interface MessageDetailPageProps {
  messageId: string;
  onBack: () => void;
  onDevicePress: (deviceId: string) => void;
  onWorkOrderPress?: (orderId: string) => void;
}

export const MessageDetailPage = ({ messageId, onBack, onDevicePress, onWorkOrderPress }: MessageDetailPageProps) => {
  const msg = useMessageStore((state) => state.messages.find((m) => m.id === messageId));
  const markRead = useMessageStore((state) => state.markRead);
  const customNames = useDeviceCustomNamesStore((state) => state.names);
  const resolveName = (deviceId: string, fallback: string) => customNames[deviceId] || fallback;

  useEffect(() => {
    if (msg && !msg.isRead) markRead(msg.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg?.id]);

  if (!msg) return null;

  const aggregatedDevices = msg.devices ?? [];
  const singleDeviceItem = !msg.isAggregated && msg.deviceId
    ? [{ id: msg.deviceId, name: resolveName(msg.deviceId, msg.deviceName ?? ''), department: msg.deviceDept, campus: msg.deviceCampus, summary: msg.deviceSummary }]
    : [];
  const displayDevices = aggregatedDevices.length > 0
    ? aggregatedDevices.map((d) => ({ ...d, name: resolveName(d.id, d.name) }))
    : singleDeviceItem;
  const summaryStyle = SUMMARY_STYLE[msg.category];
  const [devicesExpanded, setDevicesExpanded] = useState(false);

  return (
    <div className={detailStyles.page}>
      {/* Body */}
      <div className={detailStyles.body}>
        {msg.category === 'order-update' && msg.workOrderId ? (
          <>
            {/* Work order sign card — primary action */}
            <div className={detailStyles.workOrderCard}>
              <div className={detailStyles.workOrderTopRow}>
                <span className={detailStyles.workOrderTypeBadge}>{msg.workOrderType ?? '服务工单'}</span>
                <span className={detailStyles.workOrderOrderNo}>{msg.workOrderId}</span>
              </div>
              <div className={detailStyles.workOrderDeviceRow}>
                <span className={detailStyles.workOrderDevice}>
                  {resolveName(msg.deviceId ?? '', msg.deviceName ?? '')}
                </span>
                {(msg.deviceDept || msg.deviceCampus) && (
                  <span className={detailStyles.workOrderDeviceMeta}>
                    {msg.deviceDept}{msg.deviceCampus ? `（${msg.deviceCampus}）` : ''}
                  </span>
                )}
              </div>
              <span className={detailStyles.workOrderReqTime}>签字请求时间：{msg.time}</span>
              <button
                className={detailStyles.signBtnFull}
                onClick={() => onWorkOrderPress?.(msg.workOrderId!)}
                aria-label="前往工单签字确认"
              >
                前往签字确认 ›
              </button>
            </div>

            {/* Device reference — secondary */}
            {displayDevices.length > 0 && (
              <div>
                <div className={detailStyles.sectionLabel}>涉及设备（{displayDevices.length} 台）</div>
                <div className={detailStyles.deviceListCard}>
                  {displayDevices.map((device, idx, arr) => (
                    <button
                      key={device.id}
                      className={clsx(
                        detailStyles.deviceItem,
                        idx < arr.length - 1 && detailStyles.deviceItemBorder,
                      )}
                      onClick={() => onDevicePress(device.id)}
                      aria-label={`查看 ${device.name} 设备详情`}
                    >
                      <div className={detailStyles.deviceLeft}>
                        <span className={detailStyles.deviceName}>{device.name}</span>
                        {device.department && (
                          <span className={detailStyles.deviceDept}>
                            {device.department}{device.campus ? `（${device.campus}）` : ''}
                          </span>
                        )}
                      </div>
                      <span className={detailStyles.chevron}>›</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Description card */}
            {msg.body && (
              <div className={detailStyles.descCard}>
                <div className={detailStyles.descText}>{msg.body}</div>
              </div>
            )}

            {/* Device list — unified for single and aggregated */}
            {displayDevices.length > 0 && (
              <div>
                <div className={detailStyles.sectionLabel}>涉及设备（{displayDevices.length} 台）</div>
                <div className={detailStyles.deviceListCard}>
                  {(devicesExpanded ? displayDevices : displayDevices.slice(0, 3)).map((device, idx, arr) => (
                    <button
                      key={device.id}
                      className={clsx(
                        detailStyles.deviceItem,
                        idx < arr.length - 1 && detailStyles.deviceItemBorder,
                      )}
                      onClick={() => onDevicePress(device.id)}
                      aria-label={`查看 ${device.name} 设备详情`}
                    >
                      <div className={detailStyles.deviceLeft}>
                        <span className={detailStyles.deviceName}>{device.name}</span>
                        {device.department && (
                          <span className={detailStyles.deviceDept}>
                            {device.department}{device.campus ? `（${device.campus}）` : ''}
                          </span>
                        )}
                        {device.summary && (
                          <span className={detailStyles[summaryStyle]}>{device.summary}</span>
                        )}
                      </div>
                      <span className={detailStyles.chevron}>›</span>
                    </button>
                  ))}
                  {displayDevices.length > 3 && !devicesExpanded && (
                    <button
                      className={detailStyles.expandDevicesBtn}
                      onClick={() => setDevicesExpanded(true)}
                      aria-label={`展开全部 ${displayDevices.length} 台设备`}
                    >
                      查看全部 {displayDevices.length} 台 ›
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
