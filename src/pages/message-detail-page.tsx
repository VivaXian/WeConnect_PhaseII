import { useEffect } from 'react';
import clsx from 'clsx';
import type { MessageCategory } from '../types/message';
import { CATEGORY_LABEL } from '../types/message';
import { useMessageStore } from '../stores/message-store';
import { detailStyles } from './message-detail-page.css';

const CATEGORY_ICON: Record<MessageCategory, string> = {
  'contract-expired': '📋',
  'contract-expiry': '📋',
  'acceptance': '🔖',
  'pm-plan': '📅',
  'pm-risk': '⚠️',
  'permission-upgrade': '✅',
  'order-update': '🔔',
};

const HEADER_BADGE_BG: Record<MessageCategory, string> = {
  'contract-expired': 'rgba(255,80,80,0.2)',
  'contract-expiry': 'rgba(255,165,0,0.2)',
  'acceptance': 'rgba(255,165,0,0.2)',
  'pm-plan': 'rgba(255,255,255,0.15)',
  'pm-risk': 'rgba(255,165,0,0.2)',
  'permission-upgrade': 'rgba(80,220,120,0.2)',
  'order-update': 'rgba(255,255,255,0.15)',
};

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
}

export const MessageDetailPage = ({ messageId, onBack, onDevicePress }: MessageDetailPageProps) => {
  const msg = useMessageStore((state) => state.messages.find((m) => m.id === messageId));
  const markRead = useMessageStore((state) => state.markRead);

  useEffect(() => {
    if (msg && !msg.isRead) markRead(msg.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg?.id]);

  if (!msg) return null;

  const devices = msg.devices ?? [];
  const summaryStyle = SUMMARY_STYLE[msg.category];

  return (
    <div className={detailStyles.page}>
      {/* Blue header */}
      <div className={detailStyles.header}>
        <button className={detailStyles.backBtn} onClick={onBack} aria-label="返回消息中心">
          ‹ 消息中心
        </button>
        <div
          className={detailStyles.headerBadge}
          style={{ backgroundColor: HEADER_BADGE_BG[msg.category] }}
        >
          {CATEGORY_ICON[msg.category]}&ensp;{CATEGORY_LABEL[msg.category]}
        </div>
        <div className={detailStyles.headerTitle}>{msg.title}</div>
        <div className={detailStyles.headerMeta}>{msg.time}</div>
      </div>

      {/* Body */}
      <div className={detailStyles.body}>
        {/* Description card */}
        {msg.body && (
          <div className={detailStyles.descCard}>
            <div className={detailStyles.descText}>{msg.body}</div>
          </div>
        )}

        {/* Aggregated: device list */}
        {devices.length > 0 && (
          <div>
            <div className={detailStyles.sectionLabel}>涉及设备（{devices.length} 台）</div>
            <div className={detailStyles.deviceListCard}>
              {devices.map((device, idx) => (
                <button
                  key={device.id}
                  className={clsx(
                    detailStyles.deviceItem,
                    idx < devices.length - 1 && detailStyles.deviceItemBorder,
                  )}
                  onClick={() => onDevicePress(device.id)}
                  aria-label={`查看 ${device.name} 设备详情`}
                >
                  <div className={detailStyles.deviceLeft}>
                    <span className={detailStyles.deviceName}>{device.name}</span>
                    {device.department && (
                      <span className={detailStyles.deviceDept}>{device.department}</span>
                    )}
                    {device.summary && (
                      <span className={detailStyles[summaryStyle]}>{device.summary}</span>
                    )}
                  </div>
                  <span className={detailStyles.chevron}>›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Single message: navigate to device button */}
        {!msg.isAggregated && msg.deviceId && (
          <div>
            <div className={detailStyles.sectionLabel}>关联设备</div>
            <div className={detailStyles.singleAction}>
              <button
                className={detailStyles.goToDeviceBtn}
                onClick={() => onDevicePress(msg.deviceId!)}
              >
                <span className={detailStyles.goToDeviceName}>{msg.deviceName}</span>
                <span className={detailStyles.goToDeviceChevron}>›</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
