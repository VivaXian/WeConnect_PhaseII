import { useMemo, useState } from 'react';
import { Avatar } from '@filament/react/avatar';
import { Badge } from '@filament/react/badge';
import { Button } from '@filament/react/button';
import { Card } from '@filament/react/card';
import { Item, ItemSuffix, Section } from '@filament/react/common';
import { ChevronRight } from '@filament/react/icons/chevron-right';
import { List } from '@filament/react/list';
import { Text } from '@filament/react/text';
import { useShallow } from 'zustand/react/shallow';
import type { AppMessage } from '../types/message';
import { useRoleStore } from '../stores/role-store';
import { repairData } from '../utils/repair-data';
import { deviceList } from '../utils/device-data';
import { UpgradeFormSheet } from '../components/upgrade-form-sheet';
import { UsernameEditSheet } from '../components/username-edit-sheet';
import { profileStyles } from './profile-page.css';

const SETTINGS_ITEMS = [
  { key: 'devices', label: '常用设备管理' },
  { key: 'notifications', label: '消息通知设置' },
  { key: 'feedback', label: '帮助与反馈' },
];

interface ProfilePageProps {
  unreadMessageCount?: number;
  recentMessages?: AppMessage[];
  onMessagesPress?: () => void;
  onMessagePress?: (messageId: string) => void;
  onCommonDevicesPress?: () => void;
  onScanPress?: () => void;
  onInputDevicePress?: () => void;
  onSparePartsAuthPress?: () => void;
  onEngineerVerifyPress?: () => void;
  onEngineerChatPress?: () => void;
}

export const ProfilePage = ({
  unreadMessageCount = 0,
  recentMessages = [],
  onMessagesPress,
  onMessagePress,
  onCommonDevicesPress,
  onScanPress,
  onInputDevicePress,
  onSparePartsAuthPress,
  onEngineerVerifyPress,
  onEngineerChatPress,
}: ProfilePageProps) => {
  const {
    role,
    upgradeStatus,
    upgradeSubmittedAt,
    upgradeHospitals,
    submitUpgrade,
    approveUpgrade,
    rejectUpgrade,
    resetUpgrade,
    username,
    setUsername,
  } = useRoleStore(
    useShallow((state) => ({
      role: state.role,
      upgradeStatus: state.upgradeStatus,
      upgradeSubmittedAt: state.upgradeSubmittedAt,
      upgradeHospitals: state.upgradeHospitals,
      submitUpgrade: state.submitUpgrade,
      approveUpgrade: state.approveUpgrade,
      rejectUpgrade: state.rejectUpgrade,
      resetUpgrade: state.resetUpgrade,
      username: state.username,
      setUsername: state.setUsername,
    }))
  );

  const [showForm, setShowForm] = useState(false);
  const [showUsernameEdit, setShowUsernameEdit] = useState(false);
  const isAdmin = role === 'admin';
  const deviceSummaryLabel = useMemo(() => {
    const campusCount = new Set(deviceList.map((d) => d.campus).filter(Boolean)).size;
    return `${campusCount}个院区 | ${deviceList.length}台设备`;
  }, []);

  /** 显示条件：认证用户且有至少一条服务完成的报修记录 */
  const hasCompletedRepair = useMemo(
    () =>
      repairData.some((group) =>
        group.records.some((r) => r.status === 'completed-pending')
      ),
    []
  );

  /** Unique hospitals derived from repair records — available for selection */
  const hospitalOptions = useMemo(() => {
    const seen = new Set<string>();
    repairData.forEach((group) => group.records.forEach((r) => seen.add(r.hospital)));
    return Array.from(seen);
  }, []);

  const handleFormSubmit = (hospitals: string[]) => {
    submitUpgrade(hospitals);
    setShowForm(false);
  };

  return (
    <div className={profileStyles.page}>

      {/* ── Form sheet overlay ── */}
      {showForm && (
        <UpgradeFormSheet
          availableHospitals={hospitalOptions}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* ── Username edit overlay ── */}
      {showUsernameEdit && (
        <UsernameEditSheet
          currentUsername={username}
          onClose={() => setShowUsernameEdit(false)}
          onSave={setUsername}
        />
      )}

      {/* ── Hero ── */}
      <div className={profileStyles.hero}>
        <Avatar size={48} backgroundColor="rgba(255,255,255,0.25)" color="#ffffff">
          {username.charAt(0).toUpperCase() || 'U'}
        </Avatar>
        <div className={profileStyles.heroTextGroup}>
          <Text variant="heading-s" color="inherit" className={profileStyles.heroName}>{username}</Text>
          <div className={profileStyles.roleRow}>
            <span className={isAdmin ? profileStyles.roleTagAdmin : profileStyles.roleTagUser}>
              {isAdmin ? '授权用户' : '认证用户'}
            </span>
            <button
              type="button"
              className={profileStyles.deviceSummaryChipBtn}
              onClick={onCommonDevicesPress}
            >
              <span className={profileStyles.deviceSummaryChip}>{deviceSummaryLabel}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Quick tools ── */}
      <Card className={profileStyles.sectionCard}>
        <div className={profileStyles.toolSectionTitle}>
          <span className={profileStyles.cardSectionTitle}>快捷工具</span>
        </div>
        <div className={profileStyles.toolGrid}>
          <button type="button" className={profileStyles.toolItem} onClick={onScanPress}>
            <div className={profileStyles.toolIconWrap}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M2 7V4a1 1 0 0 1 1-1h3" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M22 7V4a1 1 0 0 0-1-1h-3" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M2 17v3a1 1 0 0 0 1 1h3" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M22 17v3a1 1 0 0 1-1 1h-3" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="2" y1="12" x2="22" y2="12" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span className={profileStyles.toolLabel}>扫设备码</span>
            <span className={profileStyles.toolSub}>报修 / 绑定</span>
          </button>

          <button type="button" className={profileStyles.toolItem} onClick={onInputDevicePress}>
            <div className={profileStyles.toolIconWrap}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="#0161de" strokeWidth="1.8"/>
                <path d="M7 9h2M11 9h2M15 9h2M7 13h2M11 13h2M15 13h2" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span className={profileStyles.toolLabel}>输入编号</span>
            <span className={profileStyles.toolSub}>报修 / 绑定</span>
          </button>

          <button type="button" className={profileStyles.toolItem} onClick={onEngineerChatPress}>
            <div className={profileStyles.toolIconWrap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 9h8M8 13h5" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span className={profileStyles.toolLabel}>对话工程师</span>
            <span className={profileStyles.toolSub}>在线聊天室</span>
          </button>
        </div>

        <div className={profileStyles.toolLinks}>
          <button type="button" className={profileStyles.toolLinkRow} onClick={onSparePartsAuthPress}>
            <div className={profileStyles.toolLinkLeft}>
              <div className={profileStyles.toolLinkIconWrap}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2L4 6v6c0 4.42 3.45 8.56 8 9.56C16.55 20.56 20 16.42 20 12V6l-8-4z" stroke="#0161de" strokeWidth="1.8" strokeLinejoin="round"/>
                  <path d="M9 12l2 2 4-4" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={profileStyles.toolLinkInfo}>
                <span className={profileStyles.toolLinkLabel}>备件防伪</span>
                <span className={profileStyles.toolLinkSub}>验证正品</span>
              </div>
            </div>
            <ChevronRight />
          </button>
          <button type="button" className={profileStyles.toolLinkRow} onClick={onEngineerVerifyPress}>
            <div className={profileStyles.toolLinkLeft}>
              <div className={profileStyles.toolLinkIconWrap}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="10" cy="7" r="3.5" stroke="#0161de" strokeWidth="1.8"/>
                  <path d="M3 20c0-3.87 3.13-7 7-7" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M15 13.5l2 2 4-4" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={profileStyles.toolLinkInfo}>
                <span className={profileStyles.toolLinkLabel}>工程师验证</span>
                <span className={profileStyles.toolLinkSub}>资质核实</span>
              </div>
            </div>
            <ChevronRight />
          </button>
        </div>
      </Card>

      {/* ── Messages preview ── */}
      <Card className={profileStyles.sectionCard}>
        <div className={profileStyles.sectionHeaderRow}>
          <span className={profileStyles.cardSectionTitle}>消息中心</span>
          {unreadMessageCount > 0 && (
            <Badge value={unreadMessageCount} aria-label={`${unreadMessageCount}条未读消息`} />
          )}
          <button type="button" className={profileStyles.sectionLink} onClick={onMessagesPress}>
            全部 ›
          </button>
        </div>
        {recentMessages.length === 0 ? (
          <div className={profileStyles.msgEmpty}>
            <Text variant="body-s" color="secondary">暂无消息</Text>
          </div>
        ) : (
          recentMessages.map((msg) => (
            <button
              key={msg.id}
              type="button"
              className={`${profileStyles.msgRow} ${profileStyles.msgRowBordered}`}
              onClick={() => onMessagePress?.(msg.id)}
            >
              <div className={profileStyles.msgRowTop}>
                {!msg.isRead && <div className={profileStyles.msgUnreadDot} />}
                <span className={profileStyles.msgTitle}>{msg.title}</span>
                <span className={profileStyles.msgTime}>{msg.time.slice(5)}</span>
              </div>
              <div className={profileStyles.msgBody}>{msg.body}</div>
            </button>
          ))
        )}
      </Card>

      {/* ── Account & Permission ── */}
      <Card className={profileStyles.sectionCard}>
        <div className={profileStyles.accountHeader}>账户与权限</div>
        <button
          type="button"
          className={`${profileStyles.accountRow} ${profileStyles.accountRowBtn}`}
          onClick={() => setShowUsernameEdit(true)}
        >
          <span className={profileStyles.accountLabel}>用户名</span>
          <span className={profileStyles.accountRight}>
            <span className={profileStyles.accountValue}>{username}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#aab0bc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#aab0bc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </button>
        <div className={profileStyles.accountRow}>
          <span className={profileStyles.accountLabel}>手机号</span>
          <span className={profileStyles.accountValue}>138****8888</span>
        </div>
        <div className={profileStyles.accountRow}>
          <span className={profileStyles.accountLabel}>角色</span>
          <span className={`${profileStyles.accountValue} ${profileStyles.infoValueBold}`}>
            {isAdmin ? '授权用户' : '认证用户'}
          </span>
        </div>
        <div className={profileStyles.accountRow}>
          <span className={profileStyles.accountLabel}>权限范围</span>
          <span className={profileStyles.accountValue}>
            {isAdmin ? 'WeConnect医院 · 全院' : '与本人相关'}
          </span>
        </div>
        {isAdmin && (
          <div className={profileStyles.accountRow}>
            <span className={profileStyles.accountLabel}>权限有效期</span>
            <span className={profileStyles.accountValue}>至 2025-12-31</span>
          </div>
        )}
        {!isAdmin && hasCompletedRepair && (
          <div className={profileStyles.upgradeInAccount}>
            <UpgradeBlock
              upgradeStatus={upgradeStatus}
              upgradeSubmittedAt={upgradeSubmittedAt}
              upgradeHospitals={upgradeHospitals}
              onApply={() => setShowForm(true)}
              onApprove={approveUpgrade}
              onReject={rejectUpgrade}
              onReset={resetUpgrade}
            />
          </div>
        )}
      </Card>

      {/* ── Settings ── */}
      <Card className={profileStyles.sectionCard}>
        <List selectionMode="none" aria-label="设置">
          <Section title="设置">
            {SETTINGS_ITEMS.map((item) => (
              <Item key={item.key} textValue={item.label}>
                {item.key === 'devices' ? (
                  <button
                    type="button"
                    className={profileStyles.settingInlineBtn}
                    onClick={onCommonDevicesPress}
                  >
                    <span>{item.label}</span>
                    <ChevronRight />
                  </button>
                ) : (
                  <>
                    {item.label}
                    <ItemSuffix><ChevronRight /></ItemSuffix>
                  </>
                )}
              </Item>
            ))}
          </Section>
        </List>
      </Card>

      {/* ── Logout ── */}
      <Card className={profileStyles.sectionCard}>
        <button type="button" className={profileStyles.logoutBtn}>
          <Text color="signalError">退出登录</Text>
        </button>
      </Card>

    </div>
  );
};

// ─── Upgrade block (extracted for clarity) ────────────────────────────────────

interface UpgradeBlockProps {
  upgradeStatus: ReturnType<typeof useRoleStore.getState>['upgradeStatus'];
  upgradeSubmittedAt: string | null;
  upgradeHospitals: string[];
  onApply: () => void;
  onApprove: () => void;
  onReject: () => void;
  onReset: () => void;
}

const UpgradeBlock = ({
  upgradeStatus,
  upgradeSubmittedAt,
  upgradeHospitals,
  onApply,
  onApprove,
  onReject,
  onReset,
}: UpgradeBlockProps) => (
  <div className={profileStyles.upgradeContent}>
    <span className={profileStyles.cardSectionTitle}>申请升级账号权限</span>

    {/* ── State 1: can apply ── */}
    {upgradeStatus === 'not-applied' && (
      <>
        <Text variant="body-s" color="secondary">
          升级后可查看授权院区的全院设备与报修、合同及保养计划。申请由飞利浦售后服务团队审批，预计需 1–7 个工作日。
        </Text>
        <Button variant="primary" onPress={onApply}>申请升级账号</Button>
      </>
    )}

    {/* ── Pending or silently-rejected — user always sees "审核中" ── */}
    {(upgradeStatus === 'pending' || upgradeStatus === 'cooldown') && (
      <>
        <div className={profileStyles.upgradeStatusBadge}>
          <span className={profileStyles.upgradeStatusDot} />
          <Text variant="body-s">审核中</Text>
        </div>
        <div className={profileStyles.upgradeMeta}>
          <div className={profileStyles.upgradeMetaRow}>
            <span className={profileStyles.upgradeMetaLabel}>提交日期</span>
            <span className={profileStyles.upgradeMetaValue}>{upgradeSubmittedAt}</span>
          </div>
          {upgradeHospitals.length > 0 && (
            <div className={profileStyles.upgradeMetaRow}>
              <span className={profileStyles.upgradeMetaLabel}>申请院区</span>
              <span className={profileStyles.upgradeMetaValue}>{upgradeHospitals.join('、')}</span>
            </div>
          )}
        </div>
        <div className={profileStyles.upgradeNote}>
          <Text variant="body-s">等待飞利浦团队完成资质核实，审批结果将通过消息中心通知您</Text>
        </div>
        <div className={profileStyles.demoRow}>
          <span className={profileStyles.demoLabel}>演示</span>
          <button type="button" className={profileStyles.demoBtnApprove} onClick={onApprove}>
            模拟通过
          </button>
          {upgradeStatus === 'pending' ? (
            <button type="button" className={profileStyles.demoBtnReject} onClick={onReject}>
              模拟拒绝
            </button>
          ) : (
            <button type="button" className={profileStyles.demoBtnApprove} onClick={onReset}>
              重置申请
            </button>
          )}
        </div>
      </>
    )}
  </div>
);
