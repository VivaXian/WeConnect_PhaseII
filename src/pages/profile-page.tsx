import { Avatar } from '@filament/react/avatar';
import { Badge } from '@filament/react/badge';
import { Button } from '@filament/react/button';
import { Card, CardBody } from '@filament/react/card';
import { Item, ItemSuffix, Section } from '@filament/react/common';
import { ChevronRight } from '@filament/react/icons/chevron-right';
import { List } from '@filament/react/list';
import { Text } from '@filament/react/text';
import { useShallow } from 'zustand/react/shallow';
import type { AppMessage } from '../types/message';
import { useRoleStore } from '../stores/role-store';
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
  onScanPress?: () => void;
  onInputDevicePress?: () => void;
  onSparePartsAuthPress?: () => void;
}

export const ProfilePage = ({
  unreadMessageCount = 0,
  recentMessages = [],
  onMessagesPress,
  onMessagePress,
  onScanPress,
  onInputDevicePress,
  onSparePartsAuthPress,
}: ProfilePageProps) => {
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

      {/* ── Hero ── */}
      <div className={profileStyles.hero}>
        <Avatar size={48} backgroundColor="rgba(255,255,255,0.25)" color="#ffffff">张</Avatar>
        <Text variant="heading-s" color="inherit" className={profileStyles.heroName}>张设备科长</Text>
        <div className={profileStyles.roleRow}>
          <span className={isAdmin ? profileStyles.roleTagAdmin : profileStyles.roleTagUser}>
            {isAdmin ? 'Super User · 设备科科长' : '普通用户'}
          </span>
          <span className={profileStyles.permissionTag}>
            <span className={profileStyles.permissionDotSmall} />
            权限已激活
          </span>
        </div>
      </div>

      {/* ── Messages preview ── */}
      <Card className={profileStyles.sectionCard}>
        <div className={profileStyles.sectionHeaderRow}>
          <Text variant="heading-xs">消息中心</Text>
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

      {/* ── Quick tools ── */}
      <Card className={profileStyles.sectionCard}>
        <Text variant="heading-xs" className={profileStyles.toolSectionTitle}>快捷工具</Text>
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
            <span className={profileStyles.toolLabel}>扫码</span>
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

          <button type="button" className={profileStyles.toolItem} onClick={onSparePartsAuthPress}>
            <div className={profileStyles.toolIconWrap}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2L4 6v6c0 4.42 3.45 8.56 8 9.56C16.55 20.56 20 16.42 20 12V6l-8-4z" stroke="#0161de" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M9 12l2 2 4-4" stroke="#0161de" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className={profileStyles.toolLabel}>备件防伪</span>
            <span className={profileStyles.toolSub}>验证正品</span>
          </button>
        </div>
      </Card>

      {/* ── Account & Permission ── */}
      <Card className={profileStyles.sectionCard}>
        <List selectionMode="none" aria-label="账户与权限" className={profileStyles.infoList}>
          <Section title="账户与权限">
            <Item key="hospital" textValue="所属医院">
              所属医院
              <ItemSuffix>
                <Text variant="body-m" color="secondary">WeConnect医院</Text>
              </ItemSuffix>
            </Item>
            <Item key="dept" textValue="科室">
              科室
              <ItemSuffix>
                <Text variant="body-m" color="secondary">{isAdmin ? '设备科' : '影像科'}</Text>
              </ItemSuffix>
            </Item>
            <Item key="phone" textValue="手机号">
              手机号
              <ItemSuffix>
                <Text variant="body-m" color="secondary">138****8888</Text>
              </ItemSuffix>
            </Item>
            <Item key="role" textValue="角色">
              角色
              <ItemSuffix>
                <Text variant="body-m" weight="bold" className={profileStyles.infoValueBold}>
                  {isAdmin ? 'Super User' : '普通用户'}
                </Text>
              </ItemSuffix>
            </Item>
            <Item key="scope" textValue="权限范围">
              权限范围
              <ItemSuffix>
                <Text variant="body-m" color="secondary">
                  {isAdmin ? 'WeConnect医院 · 全院' : '与本人相关'}
                </Text>
              </ItemSuffix>
            </Item>
            <Item key="validity" textValue={isAdmin ? '权限有效期' : '权限状态'}>
              {isAdmin ? '权限有效期' : '权限状态'}
              <ItemSuffix>
                <Text variant="body-m" color="secondary">
                  {isAdmin ? '至 2025-12-31' : '已激活'}
                </Text>
              </ItemSuffix>
            </Item>
          </Section>
        </List>
      </Card>

      {/* ── Upgrade — regular users only ── */}
      {!isAdmin && (
        <Card className={profileStyles.sectionCard}>
          <CardBody>
            <div className={profileStyles.upgradeContent}>
              <Text variant="heading-xs">权限升级</Text>
              <Text variant="heading-s">申请成为 Super User</Text>
              <Text variant="body-s" color="secondary">
                审核通过后可查看全院设备、合同信息与 PM 风险提醒。提交后由医院管理员审核。
              </Text>
              {!upgradeRequestSubmitted ? (
                <Button variant="primary" onPress={requestUpgrade}>申请升级账号</Button>
              ) : (
                <div className={profileStyles.upgradeStatusPending}>
                  <Text variant="body-s">申请审核中 · 预计 1-3 个工作日内处理</Text>
                  <Text variant="body-s" className={profileStyles.upgradeSubmitDate}>
                    提交时间：2026-04-29
                  </Text>
                  <div className={profileStyles.upgradeNote}>
                    <Text variant="body-s">审核通过后将发送消息通知</Text>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* ── Settings ── */}
      <Card className={profileStyles.sectionCard}>
        <List selectionMode="none" aria-label="设置">
          <Section title="设置">
            {SETTINGS_ITEMS.map((item) => (
              <Item key={item.key} textValue={item.label}>
                {item.label}
                <ItemSuffix><ChevronRight /></ItemSuffix>
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
