import { useState, useMemo } from 'react';
import { Button } from '@filament/react/button';
import { Text } from '@filament/react/text';
import { useShallow } from 'zustand/react/shallow';
import { useRoleStore } from '../stores/role-store';
import type { UpgradeStatus, CampusStatus } from '../stores/role-store';
import { repairData } from '../utils/repair-data';
import { UpgradeFormSheet } from './upgrade-form-sheet';
import { CampusExpansionSheet } from './campus-expansion-sheet';
import { UsernameEditSheet } from './username-edit-sheet';
import { SubscriptionSheet } from './subscription-sheet';
import { accountSheetStyles as s } from './account-sheet.css';

interface AccountSheetProps {
  onClose: () => void;
}

export const AccountSheet = ({ onClose }: AccountSheetProps) => {
  const {
    role, username, setUsername, adminCampuses,
    upgradeStatus, upgradeSubmittedAt, upgradeHospitals, upgradeSalesName, upgradeSalesPhone,
    submitUpgrade, approveUpgrade, rejectUpgrade, resetUpgrade,
    campusStatus, campusPendingAt, campusPendingList, campusSalesName, campusSalesPhone,
    submitCampusExpansion, approveCampusExpansion, rejectCampusExpansion, resetCampusExpansion,
  } = useRoleStore(
    useShallow((state) => ({
      role: state.role,
      username: state.username,
      setUsername: state.setUsername,
      adminCampuses: state.adminCampuses,
      upgradeStatus: state.upgradeStatus,
      upgradeSubmittedAt: state.upgradeSubmittedAt,
      upgradeHospitals: state.upgradeHospitals,
      upgradeSalesName: state.upgradeSalesName,
      upgradeSalesPhone: state.upgradeSalesPhone,
      submitUpgrade: state.submitUpgrade,
      approveUpgrade: state.approveUpgrade,
      rejectUpgrade: state.rejectUpgrade,
      resetUpgrade: state.resetUpgrade,
      campusStatus: state.campusStatus,
      campusPendingAt: state.campusPendingAt,
      campusPendingList: state.campusPendingList,
      campusSalesName: state.campusSalesName,
      campusSalesPhone: state.campusSalesPhone,
      submitCampusExpansion: state.submitCampusExpansion,
      approveCampusExpansion: state.approveCampusExpansion,
      rejectCampusExpansion: state.rejectCampusExpansion,
      resetCampusExpansion: state.resetCampusExpansion,
    }))
  );

  const [showUsernameEdit, setShowUsernameEdit] = useState(false);
  const [showUpgradeForm, setShowUpgradeForm] = useState(false);
  const [showCampusForm, setShowCampusForm] = useState(false);
  const [showSubscriptionSheet, setShowSubscriptionSheet] = useState(false);

  const isAdmin = role === 'admin';

  const hospitalOptions = useMemo(() => {
    const seen = new Set<string>();
    repairData.forEach((group) => group.records.forEach((r) => seen.add(r.hospital)));
    return Array.from(seen);
  }, []);

  const hasCompletedRepair = useMemo(
    () => repairData.some((group) => group.records.some((r) => r.status === 'completed-pending')),
    []
  );

  return (
    <>
      <div className={s.overlay} onClick={onClose} role="presentation">
        <div
          className={s.panel}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="账号与权限"
        >
          <div className={s.handle} />
          <div className={s.header}>
            <Text variant="heading-s">账号与权限</Text>
            <button type="button" className={s.closeBtn} onClick={onClose} aria-label="关闭">✕</button>
          </div>
          <div className={s.divider} />

          <button type="button" className={`${s.row} ${s.rowBtn}`} onClick={() => setShowUsernameEdit(true)}>
            <span className={s.label}>用户名</span>
            <span className={s.rowRight}>
              <span className={s.value}>{username}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
          <div className={s.row}>
            <span className={s.label}>手机号</span>
            <span className={s.value}>138****8888</span>
          </div>
          <div className={s.row}>
            <span className={s.label}>角色</span>
            <span className={s.valuePrimary}>{isAdmin ? '授权用户' : '认证用户'}</span>
          </div>
          {isAdmin ? (
            <>
              <div className={s.row}>
                <span className={s.label}>权限范围</span>
                <span className={s.scopeRowValue}>授权院区全部设备的<br />服务记录、合同及保养计划</span>
              </div>
              <div className={s.row}>
                <span className={s.label}>权限有效期</span>
                <span className={s.value}>至 2025-12-31</span>
              </div>
              <div className={s.divider} />
              <button type="button" className={`${s.row} ${s.rowBtn}`} onClick={() => setShowCampusForm(true)}>
                <span className={s.label}>授权院区</span>
                <span className={s.rowRight}>
                  <span className={s.valuePrimary}>已授权 {adminCampuses.length} 个院区</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" stroke="#0161de" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
            </>
          ) : (
            <div className={s.row}>
              <span className={s.label}>权限范围</span>
              <span className={s.scopeRowValue}>与本人相关的服务记录</span>
            </div>
          )}
          {isAdmin && (
            <AdminAdjustmentBlock
              campusStatus={campusStatus}
              campusPendingAt={campusPendingAt}
              campusPendingList={campusPendingList}
              campusSalesName={campusSalesName}
              campusSalesPhone={campusSalesPhone}
              onApply={() => setShowCampusForm(true)}
              onApprove={approveCampusExpansion}
              onReject={rejectCampusExpansion}
              onReset={resetCampusExpansion}
            />
          )}
          {!isAdmin && hasCompletedRepair && (
            <UserUpgradeBlock
              upgradeStatus={upgradeStatus}
              upgradeSubmittedAt={upgradeSubmittedAt}
              upgradeHospitals={upgradeHospitals}
              upgradeSalesName={upgradeSalesName}
              upgradeSalesPhone={upgradeSalesPhone}
              onApply={() => setShowUpgradeForm(true)}
              onApprove={approveUpgrade}
              onReject={rejectUpgrade}
              onReset={resetUpgrade}
            />
          )}
          <div className={s.bottomPad} />
        </div>
      </div>
      {showUsernameEdit && (
        <UsernameEditSheet
          currentUsername={username}
          onClose={() => setShowUsernameEdit(false)}
          onSave={setUsername}
        />
      )}
      {showUpgradeForm && (
        <UpgradeFormSheet
          availableHospitals={hospitalOptions}
          onClose={() => setShowUpgradeForm(false)}
          onSubmit={(h, sn, sp) => { submitUpgrade(h, sn, sp); setShowUpgradeForm(false); setShowSubscriptionSheet(true); }}
        />
      )}
      {showCampusForm && (
        <CampusExpansionSheet
          availableHospitals={hospitalOptions}
          currentCampuses={adminCampuses}
          onClose={() => setShowCampusForm(false)}
          onSubmit={(h, sn, sp) => { submitCampusExpansion(h, sn, sp); setShowCampusForm(false); setShowSubscriptionSheet(true); }}
        />
      )}
      {showSubscriptionSheet && (
        <SubscriptionSheet
          role={role}
          filterKeys={['account-notify']}
          onClose={() => setShowSubscriptionSheet(false)}
        />
      )}
    </>
  );
};

// ─── Admin campus expansion block ─────────────────────────────────────────────

interface AdminAdjustmentBlockProps {
  campusStatus: CampusStatus;
  campusPendingAt: string | null;
  campusPendingList: string[];
  campusSalesName: string;
  campusSalesPhone: string;
  onApply: () => void;
  onApprove: () => void;
  onReject: () => void;
  onReset: () => void;
}

const AdminAdjustmentBlock = ({ campusStatus, campusPendingAt, campusPendingList, campusSalesName, campusSalesPhone, onApply, onApprove, onReject, onReset }: AdminAdjustmentBlockProps) => (
  <div className={s.blockWrap}>
    <span className={s.blockTitle}>调整授权院区</span>
    {campusStatus === 'not-applied' && (
      <>
        <Text variant="body-s" color="secondary">
          如需调整授权院区，可发起申请。申请将由飞利浦售后服务团队审核，预计需 1–7 个工作日。
        </Text>
        <Button variant="primary" onPress={onApply}>调整授权</Button>
      </>
    )}
    {(campusStatus === 'pending' || campusStatus === 'cooldown') && (
      <>
        <div className={s.statusBadge}>
          <span className={s.statusDot} />
          <Text variant="body-s">审核中</Text>
          <span className={s.statusHint}>· 预计需 1–7 个工作日</span>
        </div>
        <div className={s.metaCard}>
          {campusPendingAt && (
            <div className={s.metaRow}>
              <span className={s.metaLabel}>提交日期</span>
              <span className={s.metaValue}>{campusPendingAt}</span>
            </div>
          )}
          {campusPendingList.length > 0 && (
            <div className={s.metaRow}>
              <span className={s.metaLabel}>申请院区</span>
              <span className={s.metaValue}>{campusPendingList.join('、')}</span>
            </div>
          )}
          {campusSalesName && (
            <div className={s.metaRow}>
              <span className={s.metaLabel}>对接销售</span>
              <span className={s.metaValue}>{campusSalesName}{campusSalesPhone ? `（${campusSalesPhone}）` : ''}</span>
            </div>
          )}
        </div>
        <div className={s.demoRow}>
          <span className={s.demoLabel}>演示</span>
          <button type="button" className={s.demoBtnApprove} onClick={onApprove}>模拟通过</button>
          {campusStatus === 'pending' ? (
            <button type="button" className={s.demoBtnReject} onClick={onReject}>模拟拒绝</button>
          ) : (
            <button type="button" className={s.demoBtnApprove} onClick={onReset}>重置申请</button>
          )}
        </div>
      </>
    )}
  </div>
);

// ─── User upgrade block ───────────────────────────────────────────────────────

interface UserUpgradeBlockProps {
  upgradeStatus: UpgradeStatus;
  upgradeSubmittedAt: string | null;
  upgradeHospitals: string[];
  upgradeSalesName: string;
  upgradeSalesPhone: string;
  onApply: () => void;
  onApprove: () => void;
  onReject: () => void;
  onReset: () => void;
}

const UserUpgradeBlock = ({
  upgradeStatus, upgradeSubmittedAt, upgradeHospitals,
  upgradeSalesName, upgradeSalesPhone,
  onApply, onApprove, onReject, onReset,
}: UserUpgradeBlockProps) => (
  <div className={s.blockWrap}>
    <span className={s.blockTitle}>申请升级账号权限</span>
    {upgradeStatus === 'not-applied' && (
      <>
        <Text variant="body-s" color="secondary">
          升级后可查看授权院区内的全部设备及相关报修、合同与保养计划。申请将由飞利浦售后服务团队审核，预计需 1–7 个工作日。
        </Text>
        <Button variant="primary" onPress={onApply}>申请升级账号</Button>
      </>
    )}
    {(upgradeStatus === 'pending' || upgradeStatus === 'cooldown') && (
      <>
        <div className={s.statusBadge}>
          <span className={s.statusDot} />
          <Text variant="body-s">审核中</Text>
          <span className={s.statusHint}>· 预计需 1–7 个工作日</span>
        </div>
        <div className={s.metaCard}>
          <div className={s.metaRow}>
            <span className={s.metaLabel}>提交日期</span>
            <span className={s.metaValue}>{upgradeSubmittedAt}</span>
          </div>
          {upgradeHospitals.length > 0 && (
            <div className={s.metaRow}>
              <span className={s.metaLabel}>申请院区</span>
              <span className={s.metaValue}>{upgradeHospitals.join('、')}</span>
            </div>
          )}
          {upgradeSalesName && (
            <div className={s.metaRow}>
              <span className={s.metaLabel}>对接销售</span>
              <span className={s.metaValue}>{upgradeSalesName}{upgradeSalesPhone ? `（${upgradeSalesPhone}）` : ''}</span>
            </div>
          )}
        </div>
        <div className={s.demoRow}>
          <span className={s.demoLabel}>演示</span>
          <button type="button" className={s.demoBtnApprove} onClick={onApprove}>模拟通过</button>
          {upgradeStatus === 'pending' ? (
            <button type="button" className={s.demoBtnReject} onClick={onReject}>模拟拒绝</button>
          ) : (
            <button type="button" className={s.demoBtnApprove} onClick={onReset}>重置申请</button>
          )}
        </div>
      </>
    )}
  </div>
);


