import { Button } from '@filament/react/button';
import { Call } from '@filament/react/icons/call';
import { CheckmarkCircle } from '@filament/react/icons/checkmark-circle';
import { Cube3D } from '@filament/react/icons/cube3-d';
import { PersonPortrait } from '@filament/react/icons/person-portrait';
import type { RepairStatus } from '../types/repair';
import { WORK_ORDER_TYPE_LABEL } from '../types/work-order';
import { repairData } from '../utils/repair-data';
import { MiniProgramNav } from '../components/mini-program-nav';
import { rdStyles } from './repair-detail-page.css';

const SOURCE_LABEL: Record<string, string> = {
  'mini-program': '小程序',
  phone: '电话',
  'service-account': '服务号',
};

interface RepairDetailPageProps {
  repairId: string;
  onBack: () => void;
  onWorkOrderPress: (orderId: string) => void;
}

const TimelineDotIcon = ({ icon }: { icon: string }) => {
  if (icon === 'check') return <CheckmarkCircle size="small" aria-hidden="true" />;
  if (icon === 'person') return <PersonPortrait size="small" aria-hidden="true" />;
  if (icon === 'cube') return <Cube3D size="small" aria-hidden="true" />;
  return <div className={rdStyles.timelineDotSmallDot} />;
};

type StepperNode = { label: string; active: boolean };

const getStepperNodes = (status: RepairStatus): StepperNode[] => {
  if (status === 'cancelled') {
    return [{ label: '报修', active: true }, { label: '已取消', active: true }];
  }
  const activeIndex = status === 'reported' ? 0 : status === 'in-service' ? 1 : 2;
  return ['报修', '服务中', '服务完成'].map((label, idx) => ({ label, active: idx <= activeIndex }));
};

const CoarseProgressStepper = ({ status }: { status: RepairStatus }) => {
  const nodes = getStepperNodes(status);
  return (
    <div className={rdStyles.progressStepper}>
      {nodes.flatMap((node, idx) => [
        <div key={`n${idx}`} className={rdStyles.progressStepNode}>
          <div className={node.active ? rdStyles.progressStepDot : rdStyles.progressStepDotInactive}>
            <CheckmarkCircle size="small" aria-hidden="true" />
          </div>
          <span className={rdStyles.progressStepLabel}>{node.label}</span>
        </div>,
        ...(idx < nodes.length - 1
          ? [<div key={`c${idx}`} className={node.active ? rdStyles.progressConnector : rdStyles.progressConnectorInactive} />]
          : []),
      ])}
    </div>
  );
};

export const RepairDetailPage = ({ repairId, onBack, onWorkOrderPress }: RepairDetailPageProps) => {
  const allRecords = repairData.flatMap((g) => g.records);
  const record = allRecords.find((r) => r.id === repairId);

  if (!record) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#6a7282' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0161de', fontSize: 14 }} onClick={onBack}>← 返回</button>
        <p>报修记录不存在</p>
      </div>
    );
  }

  const timeline = record.timeline ?? [];
  const linkedWorkOrders = record.linkedWorkOrders ?? [];

  return (
    <div className={rdStyles.page}>
      <MiniProgramNav variant="back" title="报修详情" onBack={onBack} />
      <div className={rdStyles.subHeader}>
        <div className={rdStyles.subHeaderMeta}>
          报修编号 &nbsp;{record.repairId}
        </div>
        <div className={rdStyles.subHeaderTitle}>{record.statusTitle ?? record.status}</div>
        {record.tagline && (
          <div className={rdStyles.subHeaderTagline}>{record.tagline}</div>
        )}
      </div>

      <div className={rdStyles.sections}>
        {/* 服务工程师 */}
        {record.progress.engineer && record.status === 'in-service' && (
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
                <Button
                  variant="quiet"
                  shape="round"
                  aria-label="拨打电话"
                  onPress={() => { window.location.href = `tel:${record.progress.engineer?.phone}`; }}
                >
                  <Call aria-hidden="true" />
                </Button>
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
        {(timeline.length > 0 || record.legacyProgress) && (
          <div className={rdStyles.section}>
            <div className={rdStyles.sectionTitle}>维修进度</div>
            {record.legacyProgress ? (
              <div className={rdStyles.legacyNotice}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="7" cy="7" r="6" stroke="#b45309" strokeWidth="1.2" />
                  <path d="M7 4.5v3M7 9.5v.5" stroke="#b45309" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <span>由于系统升级，2026年4月18日前的电话报修进度无法追溯。</span>
              </div>
            ) : (
              <>
                <CoarseProgressStepper status={record.status} />
                <div className={rdStyles.timeline}>
                  {[...timeline].reverse().map((node, idx, arr) => {
                    const isLast = idx === arr.length - 1;
                    const nextNode = arr[idx + 1];
                    return (
                      <div key={idx} className={rdStyles.timelineNode}>
                        <div className={rdStyles.timelineLeft}>
                          <div className={node.isCompleted ? rdStyles.timelineDot : rdStyles.timelineDotInactive}>
                            <TimelineDotIcon icon={node.icon} />
                          </div>
                          {!isLast && (
                            <div className={nextNode?.isCompleted ? rdStyles.timelineLine : rdStyles.timelineLineInactive} />
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
              </>
            )}
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
          {record.source && (
            <div className={rdStyles.descRow}>
              <span className={rdStyles.descLabel}>报修渠道</span>
              <span className={rdStyles.descValue}>{SOURCE_LABEL[record.source] ?? record.source}</span>
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
