import { useMemo, useState } from 'react';
import { Avatar } from '@filament/react/avatar';
import { Badge } from '@filament/react/badge';
import { Card } from '@filament/react/card';
import { ChevronRight } from '@filament/react/icons/chevron-right';
import { Text } from '@filament/react/text';
import { useShallow } from 'zustand/react/shallow';
import type { AppMessage } from '../types/message';
import { useRoleStore } from '../stores/role-store';
import { deviceList } from '../utils/device-data';
import { AccountSheet } from '../components/account-sheet';
import { SubscriptionSheet } from '../components/subscription-sheet';
import { UsernameEditSheet } from '../components/username-edit-sheet';
import { profileStyles } from './profile-page.css';



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
  onPrivacyPolicyPress?: () => void;
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
  onPrivacyPolicyPress,
}: ProfilePageProps) => {
  const { role, username, setUsername, adminCampuses } = useRoleStore(
    useShallow((state) => ({
      role: state.role,
      username: state.username,
      setUsername: state.setUsername,
      adminCampuses: state.adminCampuses,
    }))
  );

  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [showUsernameEdit, setShowUsernameEdit] = useState(false);
  const [showContactPhone, setShowContactPhone] = useState(false);
  const [showSubscriptionSheet, setShowSubscriptionSheet] = useState(false);
  const isAdmin = role === 'admin';
  const deviceSummaryLabel = useMemo(() => {
    const campusCount = new Set(deviceList.map((d) => d.campus).filter(Boolean)).size;
    return `关联 ${deviceList.length} 台设备 | 覆盖 ${campusCount} 个院区`;
  }, []);

  return (
    <div className={profileStyles.page}>

      {/* ── Account sheet ── */}
      {showAccountSheet && (
        <AccountSheet onClose={() => setShowAccountSheet(false)} />
      )}

      {/* ── Username edit sheet ── */}
      {showUsernameEdit && (
        <UsernameEditSheet
          currentUsername={username}
          onClose={() => setShowUsernameEdit(false)}
          onSave={setUsername}
        />
      )}

      {/* ── Subscription sheet ── */}
      {showSubscriptionSheet && (
        <SubscriptionSheet
          role={role}
          onClose={() => setShowSubscriptionSheet(false)}
        />
      )}

      {/* ── Hero ── */}
      <div className={profileStyles.hero}>
        <div className={profileStyles.heroTop}>
          <Avatar size={48} backgroundColor="rgba(255,255,255,0.2)" color="#ffffff">
            {username.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <div className={profileStyles.heroTextGroup}>
            <button type="button" className={profileStyles.heroUsernameBtn} onClick={() => setShowUsernameEdit(true)}>
              <Text variant="heading-s" color="inherit" className={profileStyles.heroName}>{username}</Text>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className={profileStyles.roleRow}>
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
        <button
          type="button"
          className={profileStyles.heroAccountRow}
          onClick={() => setShowAccountSheet(true)}
        >
          <span className={profileStyles.heroAccountLeft}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="#ffffff" strokeWidth="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            账号与权限
            <span className={profileStyles.heroRoleUser}>
              {isAdmin ? '授权用户' : '认证用户'}
            </span>
          </span>
          <span className={profileStyles.heroAccountRight}>
            {isAdmin ? `已授权 ${adminCampuses.length} 个院区` : '账号升级'} ›
          </span>
        </button>
      </div>

      <div className={profileStyles.contentPanel}>
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
        </div>

        <div className={profileStyles.toolLinks}>
          <button type="button" className={profileStyles.toolLinkRow} onClick={onSparePartsAuthPress}>
            <div className={profileStyles.toolLinkIconWrap}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2L4 6v6c0 4.42 3.45 8.56 8 9.56C16.55 20.56 20 16.42 20 12V6l-8-4z" stroke="#0161de" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M9 12l2 2 4-4" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={profileStyles.toolLinkInfo}>
              <span className={profileStyles.toolLinkLabel}>备件原厂验证</span>
              <span className={profileStyles.toolLinkSub}>验证正品</span>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{flexShrink:0}}>
              <path d="M9 6l6 6-6 6" stroke="#c4c9d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button type="button" className={profileStyles.toolLinkRow} onClick={onEngineerVerifyPress}>
            <div className={profileStyles.toolLinkIconWrap}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="10" cy="7" r="3.5" stroke="#0161de" strokeWidth="1.8"/>
                <path d="M3 20c0-3.87 3.13-7 7-7" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M15 13.5l2 2 4-4" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={profileStyles.toolLinkInfo}>
              <span className={profileStyles.toolLinkLabel}>工程师资质查询</span>
              <span className={profileStyles.toolLinkSub}>服务资质</span>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{flexShrink:0}}>
              <path d="M9 6l6 6-6 6" stroke="#c4c9d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button type="button" className={`${profileStyles.toolLinkRow} ${profileStyles.toolLinkWide}`}>
            <div className={profileStyles.toolLinkIconWrap}>
              <svg width="18" height="18" viewBox="0 -2.5 24 24" fill="none" aria-hidden="true">
                <path d="M3 6.5L12 3l9 3.5L12 10 3 6.5z" stroke="#0161de" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M7 8.5V13c0 1.66 2.24 3 5 3s5-1.34 5-3V8.5" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 6.5V12" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <div className={profileStyles.toolLinkInfo}>
              <span className={profileStyles.toolLinkLabel}>飞利浦超声微课堂</span>
              <span className={profileStyles.toolLinkSub}>仪器操作&临床应用</span>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{flexShrink:0}}>
              <path d="M9 6l6 6-6 6" stroke="#c4c9d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
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
          <div className={profileStyles.sectionSpacer} />
          <button type="button" className={profileStyles.subscribeBtn} onClick={() => setShowSubscriptionSheet(true)}>
            订阅
          </button>
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

      {/* ── About ── */}
      <Card className={profileStyles.sectionCard}>
        <button type="button" className={profileStyles.aboutRow} onClick={onPrivacyPolicyPress}>
          <span>隐私政策</span>
          <ChevronRight />
        </button>
        <button type="button" className={profileStyles.aboutRow} onClick={() => setShowContactPhone(true)}>
          <span>联系飞利浦</span>
          <ChevronRight />
        </button>
      </Card>

      {/* ── Logout ── */}
      <Card className={profileStyles.sectionCard}>
        <button type="button" className={profileStyles.logoutBtn}>
          <Text color="signalError">退出登录</Text>
        </button>
      </Card>
      </div>

      {/* ── Contact phone modal ── */}
      {showContactPhone && (
        <div className={profileStyles.modalBackdrop} onClick={() => setShowContactPhone(false)}>
          <div className={profileStyles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={profileStyles.modalTitle}>联系飞利浦</div>
            <div className={profileStyles.modalPhoneLabel}>售后服务热线</div>
            <div className={profileStyles.modalPhoneNumber}>400-810-0038</div>
            <div className={profileStyles.modalBtnRow}>
              <a href="tel:4008100038" className={profileStyles.modalCallBtn}>拨打电话</a>
              <button type="button" className={profileStyles.modalCancelBtn} onClick={() => setShowContactPhone(false)}>取消</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
