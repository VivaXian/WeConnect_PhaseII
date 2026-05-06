import { Button } from '@filament/react/button';
import { useShallow } from 'zustand/react/shallow';
import { useRoleStore } from '../stores/role-store';
import { profileStyles } from './profile-page.css';

const SETTINGS_ITEMS = [
  { label: '常用设备管理', danger: false },
  { label: '消息通知设置', danger: false },
  { label: '帮助与反馈', danger: false },
];

interface ProfilePageProps {
  unreadMessageCount?: number;
  onMessagesPress?: () => void;
}

export const ProfilePage = ({ unreadMessageCount = 0, onMessagesPress }: ProfilePageProps) => {
  const { requestUpgrade, role, upgradeRequestSubmitted } = useRoleStore(
    useShallow((state) => ({
      requestUpgrade: state.requestUpgrade,
      role: state.role,
      upgradeRequestSubmitted: state.upgradeRequestSubmitted,
    }))
  );
  const isAdmin = role === 'admin';

  return (
    <div className={profileStyles.page}>
      {/* Hero section */}
      <div className={profileStyles.hero}>
        <div className={profileStyles.avatar}>张</div>
        <div className={profileStyles.name}>张设备科长</div>
        <div className={profileStyles.roleRow}>
          <span className={isAdmin ? profileStyles.roleTagAdmin : profileStyles.roleTagUser}>
            {isAdmin ? 'Super User · 设备科科长' : '普通用户'}
          </span>
        </div>
      </div>

      {/* Permission status badge */}
      <div className={profileStyles.permissionBadge}>
        <div className={profileStyles.permissionDot} />
        <div className={profileStyles.permissionText}>
          {isAdmin
            ? '权限已生效 · 可查看全院设备及服务信息、合同信息和PM计划'
            : '权限已生效 · 可查看与本人相关的设备及服务记录'}
        </div>
      </div>

      {/* 消息中心 entry — navigates to messages sub-page */}
      <div className={profileStyles.section}>
        <div
          className={profileStyles.messagesEntryRow}
          onClick={onMessagesPress}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onMessagesPress?.()}
          aria-label={`消息中心${unreadMessageCount > 0 ? `，${unreadMessageCount}条未读` : ''}`}
        >
          <span className={profileStyles.messagesEntryLabel}>消息中心</span>
          {unreadMessageCount > 0 && (
            <span className={profileStyles.unreadBadge}>{unreadMessageCount}</span>
          )}
          <span className={profileStyles.chevron}>›</span>
        </div>
      </div>

      {/* Account info */}
      <div className={profileStyles.section}>
        <div className={profileStyles.sectionTitle}>账户信息</div>
        <div className={profileStyles.infoRow}>
          <span className={profileStyles.infoLabel}>所属医院</span>
          <span className={profileStyles.infoValue}>WeConnect医院</span>
        </div>
        <div className={profileStyles.infoRow}>
          <span className={profileStyles.infoLabel}>科室</span>
          <span className={profileStyles.infoValue}>{isAdmin ? '设备科' : '影像科'}</span>
        </div>
        <div className={profileStyles.infoRowLast}>
          <span className={profileStyles.infoLabel}>手机号</span>
          <span className={profileStyles.infoValue}>138****8888</span>
        </div>
      </div>

      {/* Permission info */}
      <div className={profileStyles.section}>
        <div className={profileStyles.sectionTitle}>权限信息</div>
        <div className={profileStyles.infoRow}>
          <span className={profileStyles.infoLabel}>角色</span>
          <span className={profileStyles.infoValueBold}>
            {isAdmin ? 'Super User' : '普通用户'}
          </span>
        </div>
        <div className={profileStyles.infoRow}>
          <span className={profileStyles.infoLabel}>权限范围</span>
          <span className={profileStyles.infoValue}>
            {isAdmin ? 'WeConnect医院 · 全院' : '与本人相关'}
          </span>
        </div>
        {isAdmin ? (
          <div className={profileStyles.infoRowLast}>
            <span className={profileStyles.infoLabel}>权限有效期</span>
            <span className={profileStyles.infoValue}>至 2025-12-31</span>
          </div>
        ) : (
          <div className={profileStyles.infoRowLast}>
            <span className={profileStyles.infoLabel}>权限状态</span>
            <span className={profileStyles.infoValue}>已激活</span>
          </div>
        )}
      </div>

      {/* Upgrade block — regular users only (3 states: 未提交 / 审核中 / 审核通过) */}
      {!isAdmin && (
        <div className={profileStyles.section}>
          <div className={profileStyles.sectionTitle}>权限升级</div>
          <div className={profileStyles.upgradeContent}>
            <div className={profileStyles.upgradeTitle}>申请成为 Super User</div>
            <div className={profileStyles.upgradeBody}>
              审核通过后可查看全院设备、合同信息与 PM 风险提醒。提交后由医院管理员审核。
            </div>
            {!upgradeRequestSubmitted ? (
              /* 状态 1: 未提交 */
              <Button variant="primary" onPress={requestUpgrade}>
                申请升级账号
              </Button>
            ) : (
              /* 状态 2: 审核中 */
              <div className={profileStyles.upgradeStatusPending}>
                <span>申请审核中 · 预计 1-3 个工作日内处理</span>
                <span className={profileStyles.upgradeSubmitDate}>提交时间：2026-04-29</span>
                <span className={profileStyles.upgradeNote}>审核通过后将发送消息通知</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings */}
      <div className={profileStyles.section}>
        <div className={profileStyles.sectionTitle}>设置</div>
        {SETTINGS_ITEMS.map((item) => (
          <div key={item.label} className={profileStyles.settingsRow}>
            <span className={profileStyles.settingsLabel}>{item.label}</span>
            <span className={profileStyles.chevron}>›</span>
          </div>
        ))}
        <div className={profileStyles.settingsRowLast}>
          <span className={profileStyles.settingsLabelDanger}>退出登录</span>
          <span className={profileStyles.chevron}>›</span>
        </div>
      </div>
    </div>
  );
};
