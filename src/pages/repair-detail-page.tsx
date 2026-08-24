import { Button } from '@filament/react/button';
import { Call } from '@filament/react/icons/call';
import { CheckmarkCircle } from '@filament/react/icons/checkmark-circle';
import { Cube3D } from '@filament/react/icons/cube3-d';
import { PersonPortrait } from '@filament/react/icons/person-portrait';
import clsx from 'clsx';
import type { RepairStatus } from '../types/repair';
import { repairData } from '../utils/repair-data';
import { REPAIR_SYNC_CUTOFF_LABEL, isPreCutoffRepair } from '../utils/repair-cutoff';
import { caseConversations, isOwnConversation } from '../utils/conversation-grouping';
import { formatConversationTime } from '../utils/conversation-display';
import { useVisibleConversations } from '../hooks/use-visible-conversations';
import { useRoleStore } from '../stores/role-store';
import { useConversationUnread } from '../hooks/use-conversation-unread';
import { MiniProgramNav } from '../components/mini-program-nav';
import { SERVICE_HOTLINE } from '../components/contact-options-sheet';
import { WorkOrderInfoSection } from '../components/work-order-info-section';
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
  onConversationPress: (conversationId: string) => void;
  onCaseConversationsPress: (repairId: string) => void;
}

const TimelineDotIcon = ({ icon }: { icon: string }) => {
  if (icon === 'check') return <CheckmarkCircle size="small" aria-hidden="true" />;
  if (icon === 'person') return <PersonPortrait size="small" aria-hidden="true" />;
  if (icon === 'cube') return <Cube3D size="small" aria-hidden="true" />;
  return <div className={rdStyles.timelineDotSmallDot} />;
};

type StepperNode = { label: string; active: boolean };

const UnsyncedNotice = () => (
  <div className={rdStyles.noticeBar}>
    {`由于系统升级，${REPAIR_SYNC_CUTOFF_LABEL}前的报修记录无法完整同步。如需工单详情，`}
    <a className={rdStyles.noticeLink} href={`tel:${SERVICE_HOTLINE}`}>
      请致电飞利浦
    </a>
    。
  </div>
);

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

export const RepairDetailPage = ({
  repairId,
  onBack,
  onWorkOrderPress,
  onConversationPress,
  onCaseConversationsPress,
}: RepairDetailPageProps) => {
  const allRecords = repairData.flatMap((g) => g.records);
  const record = allRecords.find((r) => r.id === repairId);
  const conversations = useVisibleConversations();
  const { role } = useRoleStore();
  const { byCaseId } = useConversationUnread();
  const unreadCount = byCaseId[repairId] ?? 0;
  const visibleConversations = caseConversations(conversations, repairId).filter(
    (item) => isOwnConversation(item) || role === 'admin'
  );

  if (!record) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#6a7282' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0161de', fontSize: 14 }} onClick={onBack}>← 返回</button>
        <p>报修记录不存在</p>
      </div>
    );
  }

  const timeline = (record.timeline ?? []).filter((node) => node.isCompleted);
  const linkedWorkOrders = record.linkedWorkOrders ?? [];
  const isPreCutoff = isPreCutoffRepair(record);
  const engineer = isPreCutoff ? undefined : record.progress.engineer;
  const conversationCount = isPreCutoff ? 0 : visibleConversations.length;
  const latestConversation = visibleConversations[0];
  const openServiceSupport = () => {
    if (conversationCount === 1) {
      onConversationPress(visibleConversations[0].id);
      return;
    }
    onCaseConversationsPress(record.id);
  };

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
        {isPreCutoff && record.status !== 'cancelled' && <UnsyncedNotice />}
      </div>

      <div className={rdStyles.sections}>
        {/* 服务工程师 */}
        {engineer && (
          <div className={rdStyles.section}>
            <div className={rdStyles.sectionTitle}>服务工程师</div>
            <div className={rdStyles.engineerRow}>
              <div className={rdStyles.engineerInfo}>
                <span className={rdStyles.engineerName}>{engineer.name}</span>
                <span className={rdStyles.engineerRole}>{engineer.role}</span>
              </div>
              {engineer.phone && (
                <Button
                  variant="quiet"
                  shape="round"
                  isIconOnly
                  aria-label={`拨打电话给${engineer.name}`}
                  onPress={() => { window.location.href = `tel:${engineer.phone}`; }}
                >
                  <Call aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* 服务记录：维修工单 + 沟通记录 */}
        <WorkOrderInfoSection
          workOrders={linkedWorkOrders}
          onWorkOrderPress={onWorkOrderPress}
          conversation={
            latestConversation
              ? {
                  time: formatConversationTime(latestConversation.updatedAt),
                  unread: unreadCount,
                  onPress: openServiceSupport,
                }
              : undefined
          }
          isStatic={isPreCutoff}
        />

        {/* 维修进度 */}
        {(timeline.length > 0 || isPreCutoff) && (
          <div className={rdStyles.section}>
            <div className={rdStyles.sectionTitle}>维修进度</div>
            {isPreCutoff ? (
              <CoarseProgressStepper status={record.status} />
            ) : (
              <>
                <CoarseProgressStepper status={record.status} />
                <div className={rdStyles.timeline}>
                  {[...timeline].reverse().map((node, idx, arr) => {
                    const isLast = idx === arr.length - 1;
                    return (
                      <div key={idx} className={rdStyles.timelineNode}>
                        <div className={rdStyles.timelineLeft}>
                          <div className={rdStyles.timelineDot}>
                            <TimelineDotIcon icon={node.icon} />
                          </div>
                          {!isLast && <div className={rdStyles.timelineLine} />}
                        </div>
                        <div className={clsx(rdStyles.timelineContent, isLast && rdStyles.timelineContentLast)}>
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
          <div className={rdStyles.descExtra}>
            <div className={rdStyles.descExtraLabel}>补充材料</div>
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
