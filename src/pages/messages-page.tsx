import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { AppMessage, MessageCategory, ReadFilter, TypeFilter } from '../types/message';
import { CATEGORY_LABEL } from '../types/message';
import { useMessageStore } from '../stores/message-store';
import { useRoleStore } from '../stores/role-store';
import { useShallow } from 'zustand/react/shallow';
import { msgStyles } from './messages-page.css';

const CATEGORY_ICON: Record<MessageCategory, string> = {
  'contract-expired': '📋',
  'contract-expiry': '📋',
  'acceptance': '🔖',
  'pm-plan': '📅',
  'pm-risk': '⚠️',
  'permission-upgrade': '✅',
  'order-update': '🔔',
};

const ICON_STYLE: Record<MessageCategory, string> = {
  'contract-expired': msgStyles.iconDanger,
  'contract-expiry': msgStyles.iconWarn,
  'acceptance': msgStyles.iconWarn,
  'pm-plan': msgStyles.iconBlue,
  'pm-risk': msgStyles.iconWarn,
  'permission-upgrade': msgStyles.iconGreen,
  'order-update': msgStyles.iconBlue,
};

const BADGE_STYLE: Record<MessageCategory, string> = {
  'contract-expired': msgStyles.badgeDanger,
  'contract-expiry': msgStyles.badgeWarn,
  'acceptance': msgStyles.badgeWarn,
  'pm-plan': msgStyles.badgeBlue,
  'pm-risk': msgStyles.badgeWarn,
  'permission-upgrade': msgStyles.badgeGreen,
  'order-update': msgStyles.badgeBlue,
};

const TYPE_FILTER_GROUPS: { key: TypeFilter; label: string; adminOnly?: boolean }[] = [
  { key: 'all', label: '全部' },
  { key: 'contract-expired', label: '合同提醒', adminOnly: true },
  { key: 'acceptance', label: '验收提醒', adminOnly: true },
  { key: 'pm-plan', label: 'PM 计划', adminOnly: true },
  { key: 'pm-risk', label: 'PM 风险' },
  { key: 'order-update', label: '服务提醒' },
];

const CONTRACT_CATS = new Set<MessageCategory>(['contract-expired', 'contract-expiry']);
const MESSAGE_BATCH_SIZE = 10;

// Digest view: priority-ordered risk sections (方案B)
const DIGEST_SECTIONS: {
  cats: MessageCategory[];
  label: string;
  icon: string;
  summaryStyle: 'danger' | 'warn' | 'neutral';
}[] = [
  { cats: ['contract-expired'], label: '已出保', icon: '📋', summaryStyle: 'danger' },
  { cats: ['pm-risk'], label: 'PM 风险', icon: '⚠️', summaryStyle: 'warn' },
  { cats: ['contract-expiry'], label: '即将出保', icon: '📋', summaryStyle: 'warn' },
  { cats: ['acceptance'], label: '待验收', icon: '🔖', summaryStyle: 'warn' },
  { cats: ['pm-plan'], label: '本月保养计划', icon: '📅', summaryStyle: 'neutral' },
  { cats: ['order-update'], label: '服务提醒', icon: '🔔', summaryStyle: 'neutral' },
  { cats: ['permission-upgrade'], label: '系统通知', icon: '✅', summaryStyle: 'neutral' },
];

function groupByDate(messages: AppMessage[]): { label: string; items: AppMessage[] }[] {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const todayItems = messages.filter((m) => m.time === todayStr);
  const weekItems = messages.filter((m) => {
    const d = new Date(m.time);
    return d < today && d >= weekAgo && m.time !== todayStr;
  });
  const olderItems = messages.filter((m) => new Date(m.time) < weekAgo);

  return [
    todayItems.length > 0 ? { label: '今日', items: todayItems } : null,
    weekItems.length > 0 ? { label: '本周', items: weekItems } : null,
    olderItems.length > 0 ? { label: '更早', items: olderItems } : null,
  ].filter(Boolean) as { label: string; items: AppMessage[] }[];
}

// ─── 方案A: Compact card (list view) ─────────────────────────────────

interface CompactCardProps {
  msg: AppMessage;
  editMode: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onMessagePress: (id: string) => void;
}

const CompactCard = ({
  msg, editMode, isSelected, onToggleSelect, onMessagePress,
}: CompactCardProps) => {
  const devices = msg.devices ?? [];
  const departments = devices.map((d) => d.department).filter(Boolean) as string[];
  const metaText = msg.isAggregated && departments.length > 0
    ? departments.slice(0, 2).join('、') + (departments.length > 2 ? ' 等' : '')
    : (msg.deviceName ?? '');

  const handleClick = () => {
    if (editMode) { onToggleSelect(msg.id); return; }
    onMessagePress(msg.id);
  };

  return (
    <button
      type="button"
      className={clsx(
        msg.isRead ? msgStyles.compactCardRead : msgStyles.compactCard,
        isSelected && msgStyles.cardSelected,
      )}
      onClick={handleClick}
      role={editMode ? 'checkbox' : undefined}
      aria-checked={editMode ? isSelected : undefined}
      aria-label={msg.title}
    >
      {editMode ? (
        <div className={isSelected ? msgStyles.selectRingChecked : msgStyles.selectRing}>
          {isSelected && '✓'}
        </div>
      ) : (
        <div className={clsx(msgStyles.iconCircle, ICON_STYLE[msg.category])}>
          {CATEGORY_ICON[msg.category]}
        </div>
      )}
      <div className={msgStyles.compactContent}>
        <div className={msgStyles.compactTopRow}>
          <span className={clsx(msgStyles.categoryBadge, BADGE_STYLE[msg.category])}>
            {CATEGORY_LABEL[msg.category]}
          </span>
          {msg.isAggregated && devices.length > 0 && (
            <span className={msgStyles.deviceCountBadge}>{devices.length} 台</span>
          )}
          {!msg.isRead && <div className={msgStyles.unreadDot} />}
        </div>
        <div className={msg.isRead ? msgStyles.compactTitleRead : msgStyles.compactTitle}>
          {msg.title}
        </div>
        <div className={msgStyles.compactMeta}>
          {msg.time}{metaText ? ` · ${metaText}` : ''}
        </div>
      </div>
      {!editMode && <span className={msgStyles.compactChevron}>›</span>}
    </button>
  );
};

// ─── 方案B: Digest view (SU risk dashboard) ───────────────────────────

interface DigestViewProps {
  messages: AppMessage[];
  onDevicePress: (deviceId: string) => void;
  onMessagePress: (id: string) => void;
}

const DigestView = ({ messages, onDevicePress, onMessagePress }: DigestViewProps) => {
  const hasAny = DIGEST_SECTIONS.some(({ cats }) => messages.some((m) => cats.includes(m.category)));

  if (!hasAny) {
    return (
      <div className={msgStyles.emptyState}>
        <div className={msgStyles.emptyIcon}>✅</div>
        <div>目前没有需要关注的风险</div>
      </div>
    );
  }

  return (
    <div className={msgStyles.digestView}>
      {DIGEST_SECTIONS.map(({ cats, label, icon, summaryStyle }) => {
        const sectionMessages = messages.filter((m) => cats.includes(m.category));
        if (sectionMessages.length === 0) return null;

        const hasUnread = sectionMessages.some((m) => !m.isRead);
        const deviceRows = sectionMessages.flatMap((m) => {
          if (m.isAggregated) {
            return (m.devices ?? []).map((d) => ({
              id: d.id, name: d.name, department: d.department, summary: d.summary,
              messageId: m.id, isDevice: true,
            }));
          }
          if (m.deviceId) {
            return [{ id: m.deviceId, name: m.deviceName ?? m.title, department: undefined,
              summary: undefined, messageId: m.id, isDevice: true }];
          }
          return [{ id: m.id, name: m.title, department: undefined,
            summary: undefined, messageId: m.id, isDevice: false }];
        });

        return (
          <div key={cats.join()} className={msgStyles.digestSection}>
            <div className={msgStyles.digestHeader}>
              <span className={msgStyles.digestIcon}>{icon}</span>
              <span className={msgStyles.digestLabel}>{label}</span>
              <span className={msgStyles.digestCount}>{deviceRows.length} 台</span>
              {hasUnread && <div className={msgStyles.digestUnreadDot} />}
            </div>
            <div className={msgStyles.digestList}>
              {deviceRows.map((row, idx) => (
                <button
                  key={`${row.id}-${idx}`}
                  className={clsx(
                    msgStyles.digestRow,
                    idx < deviceRows.length - 1 && msgStyles.digestRowBorder,
                  )}
                  onClick={() => { if (row.isDevice) onDevicePress(row.id); else onMessagePress(row.messageId); }}
                  aria-label={`查看 ${row.name}`}
                >
                  <div className={msgStyles.digestRowLeft}>
                    <span className={msgStyles.digestRowName}>{row.name}</span>
                    {row.department && <span className={msgStyles.digestRowDept}>{row.department}</span>}
                    {row.summary && (
                      <span className={clsx(
                        msgStyles.digestRowSummary,
                        summaryStyle === 'danger' && msgStyles.digestSummaryDanger,
                        summaryStyle === 'warn' && msgStyles.digestSummaryWarn,
                      )}>{row.summary}</span>
                    )}
                  </div>
                  <span className={msgStyles.compactChevron}>›</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export interface MessagesPageProps {
  onBack?: () => void;
  onMessagePress?: (messageId: string) => void;
  onDevicePress?: (deviceId: string) => void;
}

export const MessagesPage = ({ onBack, onMessagePress, onDevicePress }: MessagesPageProps) => {
  const { role } = useRoleStore();
  const { deleteMessages, markAllRead, markRead, messages } = useMessageStore(
    useShallow((state) => ({
      deleteMessages: state.deleteMessages,
      markAllRead: state.markAllRead,
      markRead: state.markRead,
      messages: state.messages,
    }))
  );

  const [readFilter, setReadFilter] = useState<ReadFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'digest'>('list');
  const [loadedCount, setLoadedCount] = useState(MESSAGE_BATCH_SIZE);

  const isAdmin = role === 'admin';

  const visibleMessages = messages.filter((msg) => {
    if (!isAdmin && msg.forAdminOnly) return false;
    if (readFilter === 'unread' && msg.isRead) return false;
    if (readFilter === 'read' && !msg.isRead) return false;
    if (typeFilter !== 'all') {
      if (typeFilter === 'contract-expired') return CONTRACT_CATS.has(msg.category);
      return msg.category === typeFilter;
    }
    return true;
  });

  useEffect(() => {
    setLoadedCount(MESSAGE_BATCH_SIZE);
    setSelectedIds(new Set());
    setEditMode(false);
  }, [readFilter, typeFilter, viewMode, role]);

  const unreadCount = messages.filter((m) => !m.isRead && (isAdmin || !m.forAdminOnly)).length;
  const listMessages = viewMode === 'list' ? visibleMessages.slice(0, loadedCount) : visibleMessages;
  const groups = groupByDate(listMessages);
  const canLoadMore = viewMode === 'list' && visibleMessages.length > loadedCount;
  const selectedInScopeCount = visibleMessages.filter((m) => selectedIds.has(m.id)).length;
  const allInScopeSelected = visibleMessages.length > 0 && selectedInScopeCount === visibleMessages.length;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const exitEditMode = () => { setEditMode(false); setSelectedIds(new Set()); };
  const handleDeleteSelected = () => { deleteMessages(Array.from(selectedIds)); exitEditMode(); };
  const toggleSelectAllInScope = () => {
    if (allInScopeSelected) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(visibleMessages.map((m) => m.id)));
  };

  const handleLoadMore = () => {
    setLoadedCount((prev) => prev + MESSAGE_BATCH_SIZE);
  };

  const availableFilters = TYPE_FILTER_GROUPS.filter((f) => !f.adminOnly || isAdmin);

  return (
    <div className={msgStyles.page}>
      {/* Top bar */}
      <div className={msgStyles.topBar}>
        <div className={msgStyles.topBarLeft}>
          {onBack && !editMode && (
            <button className={msgStyles.backBtn} onClick={onBack} aria-label="返回">
              ‹ 返回
            </button>
          )}
          <div className={msgStyles.topBarTitle}>
            消息中心{!editMode && unreadCount > 0 ? ` (${unreadCount})` : ''}
          </div>
          <div className={msgStyles.topBarSub}>
            {editMode
              ? selectedIds.size > 0 ? `已选 ${selectedIds.size} 条` : '点击消息以选择'
              : unreadCount > 0 ? `${unreadCount} 条未读` : '全部已读'}
          </div>
        </div>
        <div className={msgStyles.topBarActions}>
          {editMode ? (
            <>
              {visibleMessages.length > 0 && (
                <button className={msgStyles.selectAllBtn} onClick={toggleSelectAllInScope}>
                  {allInScopeSelected ? '取消全选' : '全选'}
                </button>
              )}
              {selectedIds.size > 0 && (
                <button className={msgStyles.deleteSelectedBtn} onClick={handleDeleteSelected}>
                  删除 ({selectedIds.size})
                </button>
              )}
              <button className={msgStyles.doneBtn} onClick={exitEditMode}>
                完成
              </button>
            </>
          ) : (
            <>
              {unreadCount > 0 && (
                <button
                  className={msgStyles.markAllBtn}
                  onClick={() =>
                    markAllRead(
                      messages
                        .filter((m) => !m.isRead && (isAdmin || !m.forAdminOnly))
                        .map((m) => m.id)
                    )
                  }
                >
                  全部已读
                </button>
              )}
              {visibleMessages.length > 0 && viewMode === 'list' && (
                <button className={msgStyles.editBtn} onClick={() => setEditMode(true)}>
                  编辑
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* View toggle (SU) + filter chips */}
      {!editMode && (
        <div className={msgStyles.filterSection}>
          {isAdmin && (
            <div className={msgStyles.viewToggleRow}>
              <button
                className={viewMode === 'list' ? msgStyles.viewToggleActive : msgStyles.viewToggle}
                onClick={() => setViewMode('list')}
              >
                消息列表
              </button>
              <button
                className={viewMode === 'digest' ? msgStyles.viewToggleActive : msgStyles.viewToggle}
                onClick={() => setViewMode('digest')}
              >
                风险摘要
              </button>
            </div>
          )}
          {viewMode === 'list' && (
            <>
              <div className={msgStyles.filterRow}>
                {(['all', 'unread', 'read'] as ReadFilter[]).map((key) => {
                  const label = key === 'all' ? '全部' : key === 'unread' ? '未读' : '已读';
                  return (
                    <button key={key}
                      className={readFilter === key ? msgStyles.filterChipActive : msgStyles.filterChip}
                      onClick={() => setReadFilter(key)}
                    >{label}</button>
                  );
                })}
              </div>
              <div className={msgStyles.filterRow}>
                {availableFilters.map((f) => (
                  <button key={f.key}
                    className={typeFilter === f.key || (typeFilter === 'contract-expiry' && f.key === 'contract-expired')
                      ? msgStyles.filterChipActive : msgStyles.filterChip}
                    onClick={() => setTypeFilter(f.key)}
                  >{f.label}</button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Content: digest or list */}
      {viewMode === 'digest' && isAdmin ? (
        <DigestView
          messages={visibleMessages}
          onDevicePress={onDevicePress ?? (() => undefined)}
          onMessagePress={onMessagePress ?? (() => undefined)}
        />
      ) : (
        <div className={msgStyles.listSection}>
          {groups.length === 0 ? (
            <div className={msgStyles.emptyState}>
              <div className={msgStyles.emptyIcon}>💬</div>
              <div>暂无消息</div>
              {(readFilter !== 'all' || typeFilter !== 'all') && (
                <button
                  className={msgStyles.clearFilterBtn}
                  onClick={() => { setReadFilter('all'); setTypeFilter('all'); }}
                >
                  清除筛选条件
                </button>
              )}
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.label} className={msgStyles.group}>
                <div className={msgStyles.groupTitle}>{group.label}</div>
                {group.items.map((msg) => (
                  <CompactCard
                    key={msg.id}
                    msg={msg}
                    editMode={editMode}
                    isSelected={selectedIds.has(msg.id)}
                    onToggleSelect={toggleSelect}
                    onMessagePress={onMessagePress ?? (() => undefined)}
                  />
                ))}
              </div>
            ))
          )}
          {canLoadMore && !editMode && (
            <div className={msgStyles.loadMoreWrap}>
              <button className={msgStyles.loadMoreBtn} onClick={handleLoadMore}>
                加载更多
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

