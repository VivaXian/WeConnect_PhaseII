import { WORK_ORDER_TYPE_LABEL } from '../types/work-order';
import { repairData } from '../utils/repair-data';
import { rdStyles } from './repair-detail-page.css';

interface RepairDetailPageProps {
  repairId: string;
  onBack: () => void;
  onWorkOrderPress: (orderId: string) => void;
}

const TimelineDotIcon = ({ icon }: { icon: string }) => {
  if (icon === 'check') {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (icon === 'person') {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <circle cx="6" cy="4" r="2" fill="#fff" />
        <path d="M2 10c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (icon === 'cube') {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="8" height="8" rx="1" stroke="#fff" strokeWidth="1.2" />
        <path d="M2 5h8M5 2v8" stroke="#fff" strokeWidth="1" />
      </svg>
    );
  }
  return <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />;
};

export const RepairDetailPage = ({ repairId, onBack, onWorkOrderPress }: RepairDetailPageProps) => {
  const allRecords = repairData.flatMap((g) => g.records);
  const record = allRecords.find((r) => r.id === repairId);

  if (!record) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#6a7282' }}>
        <button className={rdStyles.backBtn} onClick={onBack}>← 返回</button>
        <p>报修记录不存在</p>
      </div>
    );
  }

  const timeline = record.timeline ?? [];
  const linkedWorkOrders = record.linkedWorkOrders ?? [];

  return (
    <div className={rdStyles.page}>
      {/* Header */}
      <div className={rdStyles.header}>
        <button className={rdStyles.backBtn} onClick={onBack}>
          ← 返回
        </button>
        <div className={rdStyles.headerMeta}>
          报修编号 &nbsp;{record.repairId}
        </div>
        <div className={rdStyles.headerTitle}>
          {record.statusTitle ?? record.status}
        </div>
        {record.tagline && (
          <div className={rdStyles.headerTagline}>{record.tagline}</div>
        )}
      </div>

      <div className={rdStyles.sections}>
        {/* 服务工程师 */}
        {record.progress.engineer && (
          <div className={rdStyles.section}>
            <div className={rdStyles.sectionTitle}>服务工程师</div>
            <div className={rdStyles.engineerRow}>
              <div className={rdStyles.engineerInfo}>
                <div>
                  <div className={rdStyles.engineerName}>{record.progress.engineer.name}</div>
                  <div className={rdStyles.engineerRole}>{record.progress.engineer.role}</div>
                </div>
              </div>
              {record.progress.engineer.phone && (
                <a
                  href={`tel:${record.progress.engineer.phone}`}
                  className={rdStyles.callBtn}
                  aria-label="拨打电话"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3 2C3 1.4 3.4 1 4 1h2.5c.4 0 .7.3.8.7l.7 3c.1.3 0 .7-.3.9L6.2 7c.9 1.9 2.5 3.4 4.3 4.3l1.4-1.5c.2-.3.6-.4.9-.3l3 .7c.4.1.7.4.7.8V13c0 .6-.4 1-1 1C5.4 14 2 10.6 2 5c0-.6-.1-1.2-.2-1.8"
                      stroke="#0072db"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}

        {/* 工单信息 */}
        {linkedWorkOrders.length > 0 && (
          <div className={rdStyles.section}>
            <div className={rdStyles.sectionTitle}>工单信息</div>
            {linkedWorkOrders.map((wo) => (
              <div
                key={wo.id}
                className={rdStyles.woItem}
                onClick={() => onWorkOrderPress(wo.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onWorkOrderPress(wo.id)}
              >
                <div className={rdStyles.woItemLeft}>
                  <div className={rdStyles.woItemHeader}>
                    <span className={rdStyles.woTag}>{WORK_ORDER_TYPE_LABEL[wo.type]}</span>
                    <span className={rdStyles.woItemNo}>{wo.workOrderNo}</span>
                  </div>
                  <div className={rdStyles.woItemStatus}>
                    <span style={{ color: '#9ca3af', marginRight: 4 }}>工单状态</span>
                    {wo.status}
                  </div>
                </div>
                <span className={rdStyles.chevron}>›</span>
              </div>
            ))}
          </div>
        )}

        {/* 维修进度 */}
        {timeline.length > 0 && (
          <div className={rdStyles.section}>
            <div className={rdStyles.sectionTitle}>维修进度</div>
            <div className={rdStyles.timeline}>
              {timeline.map((node, idx) => {
                const isLast = idx === timeline.length - 1;
                return (
                  <div key={idx} className={rdStyles.timelineNode}>
                    <div className={rdStyles.timelineLeft}>
                      <div className={node.isCompleted ? rdStyles.timelineDot : rdStyles.timelineDotInactive}>
                        <TimelineDotIcon icon={node.icon} />
                      </div>
                      {!isLast && (
                        <div className={node.isCompleted ? rdStyles.timelineLine : rdStyles.timelineLineInactive} />
                      )}
                    </div>
                    <div className={rdStyles.timelineContent}>
                      <div className={rdStyles.timelineLabel}>{node.label}</div>
                      {node.date && (
                        <div className={rdStyles.timelineDate}>{node.date}</div>
                      )}
                      {node.detail && (
                        <div className={rdStyles.timelineDetail}>{node.detail}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 报修描述 */}
        <div className={rdStyles.section}>
          <div className={rdStyles.sectionTitle}>报修描述</div>
          <div className={rdStyles.descRow}>
            <span className={rdStyles.descLabel}>报修设备</span>
            <span className={rdStyles.descValue}>{record.deviceName}</span>
          </div>
          {record.eq && (
            <div className={rdStyles.descRow}>
              <span className={rdStyles.descLabel}>EQ</span>
              <span className={rdStyles.descValue}>{record.eq}</span>
            </div>
          )}
          {record.serialNo && (
            <div className={rdStyles.descRow}>
              <span className={rdStyles.descLabel}>序列号</span>
              <span className={rdStyles.descValue}>{record.serialNo}</span>
            </div>
          )}
          <div className={rdStyles.descRow}>
            <span className={rdStyles.descLabel}>医院</span>
            <span className={rdStyles.descValue}>
              {record.hospital}{record.department ? ` · ${record.department}` : ''}
            </span>
          </div>
          {record.contactPerson && (
            <div className={rdStyles.descRow}>
              <span className={rdStyles.descLabel}>报修联系人</span>
              <span className={rdStyles.descValue}>
                {record.contactPerson}
                {record.contactPhone ? ` · ${record.contactPhone}` : ''}
              </span>
            </div>
          )}
          {record.repairTime && (
            <div className={rdStyles.descRow}>
              <span className={rdStyles.descLabel}>报修时间</span>
              <span className={rdStyles.descValue}>{record.repairTime}</span>
            </div>
          )}
          {record.problemDescription && (
            <div className={rdStyles.descRow}>
              <span className={rdStyles.descLabel}>问题描述</span>
              <span className={rdStyles.descValue}>{record.problemDescription}</span>
            </div>
          )}
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 13, color: '#6a7282', marginBottom: 6 }}>补充材料</div>
            <div className={rdStyles.photoGrid}>
              <div className={rdStyles.photoPlaceholder}>📷</div>
              <div className={rdStyles.photoPlaceholder}>📷</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
