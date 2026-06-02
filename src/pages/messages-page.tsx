import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { AppMessage, MessageCategory, ReadFilter, TypeFilter } from '../types/message';
import { CATEGORY_LABEL } from '../types/message';
import { useMessageStore } from '../stores/message-store';
import { useRoleStore } from '../stores/role-store';
import { useSubscriptionStore } from '../stores/subscription-store';
import { useShallow } from 'zustand/react/shallow';
import { msgStyles } from './messages-page.css';
import { SubscriptionSheet } from '../components/subscription-sheet';

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
  { key: 'pm-plan', label: '保养计划', adminOnly: true },
  { key: 'pm-risk', label: '保养风险' },
  { key: 'permission-upgrade', label: '账号通知' },
];

const CONTRACT_CATS = new Set<MessageCategory>(['contract-expired', 'contract-expiry']);
const MESSAGE_BATCH_SIZE = 10;

// Digest view: priority-ordered risk sections (方案B)
const DIGEST_SECTIONS: {
  cats: MessageCategory[];
  label: string;
  summaryStyle: 'danger' | 'warn' | 'neutral';
}[] = [
  { cats: ['contract-expired'], label: '已出保', summaryStyle: 'danger' },
  { cats: ['pm-risk'], label: '保养风险', summaryStyle: 'warn' },
  { cats: ['contract-expiry'], label: '即将出保', summaryStyle: 'warn' },
  { cats: ['acceptance'], label: '待验收', summaryStyle: 'warn' },
  { cats: ['pm-plan'], label: '本月保养计划', summaryStyle: 'neutral' },
  { cats: ['permission-upgrade'], label: '账号通知', summaryStyle: 'neutral' },
];

function groupByDate(messages: AppMessage[]): { label: string; items: AppMessage[] }[] {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisMonthItems = messages.filter((m) => new Date(m.time) >= thisMonthStart);
  const olderItems = messages.filter((m) => new Date(m.time) < thisMonthStart);

  return [
    thisMonthItems.length > 0 ? { label: '本月', items: thisMonthItems } : null,
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
  const metaText = msg.body;

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
      {editMode && (
        <div className={isSelected ? msgStyles.selectRingChecked : msgStyles.selectRing}>
          {isSelected && '✓'}
        </div>
      )}
      <div className={msgStyles.compactContent}>
        <div className={msgStyles.compactTopRow}>
          <span className={clsx(msgStyles.categoryBadge, BADGE_STYLE[msg.category])}>
            {CATEGORY_LABEL[msg.category]}
          </span>
          {!msg.isRead && <div className={msgStyles.unreadDot} />}
          <span className={msgStyles.compactTime}>{msg.time.slice(5).replace('-', '/')}</span>
        </div>
        <div className={msg.isRead ? msgStyles.compactTitleRead : msgStyles.compactTitle}>
          {msg.title}
        </div>
        {metaText && <div className={msgStyles.compactMeta}>{metaText}</div>}
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
        <div className={msgStyles.emptyIconSvg}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#c8d0dc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 4L12 14.01l-3-3" stroke="#c8d0dc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>目前没有需要关注的风险</div>
      </div>
    );
  }

  return (
    <div className={msgStyles.digestView}>
      {DIGEST_SECTIONS.map(({ cats, label, summaryStyle }) => {
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
              <div className={clsx(
                msgStyles.digestTypeDot,
                summaryStyle === 'danger' ? msgStyles.digestTypeDotDanger :
                summaryStyle === 'warn' ? msgStyles.digestTypeDotWarn :
                msgStyles.digestTypeDotNeutral,
              )} />
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

  const { hasSeenPrompt, markPromptSeen, subscriptions } = useSubscriptionStore(
    useShallow((state) => ({
      hasSeenPrompt: state.hasSeenPrompt,
      markPromptSeen: state.markPromptSeen,
      subscriptions: state.subscriptions,
    }))
  );
  const [showSubscriptionSheet, setShowSubscriptionSheet] = useState(false);
  const [pendingMessageId, setPendingMessageId] = useState<string | null>(null);

  const nothingSubscribed = Object.values(subscriptions).every((v) => !v);

  const handleMessagePress = (id: string) => {
    if (nothingSubscribed) {
      setPendingMessageId(id);
      setShowSubscriptionSheet(true);
      return;
    }
    onMessagePress?.(id);
  };

  const handleSubscriptionClose = () => {
    setShowSubscriptionSheet(false);
    if (pendingMessageId) {
      onMessagePress?.(pendingMessageId);
      setPendingMessageId(null);
    }
  };

  useEffect(() => {
    if (!hasSeenPrompt) {
      setShowSubscriptionSheet(true);
      markPromptSeen();
    }
  // run once on mount only
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unreadCount = messages.filter((m) => !m.isRead && (isAdmin || !m.forAdminOnly)).length;
  const sortedMessages = [...visibleMessages].sort((a, b) => b.time.localeCompare(a.time));
  const listMessages = viewMode === 'list' ? sortedMessages.slice(0, loadedCount) : sortedMessages;
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
      {showSubscriptionSheet && (
        <SubscriptionSheet
          role={role}
          onClose={handleSubscriptionClose}
        />
      )}
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
              <button className={msgStyles.subscribeBtn} onClick={() => setShowSubscriptionSheet(true)}>
                订阅
              </button>
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
            <div className={msgStyles.filterRow}>
              <span className={msgStyles.filterGroupLabel}>状态</span>
              {(['unread', 'read'] as const).map((key) => {
                const label = key === 'unread' ? '未读' : '已读';
                return (
                  <button key={key}
                    className={readFilter === key ? msgStyles.filterChipActive : msgStyles.filterChip}
                    onClick={() => setReadFilter((prev) => prev === key ? 'all' : key)}
                  >{label}</button>
                );
              })}
              <div className={msgStyles.filterDivider} />
              <span className={msgStyles.filterGroupLabel}>类型</span>
              {availableFilters.filter((f) => f.key !== 'all').map((f) => (
                <button key={f.key}
                  className={typeFilter === f.key ? msgStyles.filterChipActive : msgStyles.filterChip}
                  onClick={() => setTypeFilter((prev) => prev === f.key ? 'all' : f.key)}
                >{f.label}</button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content: digest or list */}
      {viewMode === 'digest' && isAdmin ? (
        <DigestView
          messages={visibleMessages}
          onDevicePress={onDevicePress ?? (() => undefined)}
          onMessagePress={handleMessagePress}
        />
      ) : (
        <div className={msgStyles.listSection}>
          {groups.length === 0 ? (
            <div className={msgStyles.emptyState}>
              <div className={msgStyles.emptyIconSvg}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#c8d0dc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
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
                    onMessagePress={handleMessagePress}
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

