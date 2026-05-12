import { useMemo, useState } from 'react';
import { SharedBottomBar } from '../components/shared-bottom-bar';
import type { AppTab } from '../components/shared-bottom-bar';
import type { Device } from '../types/device';
import { useRoleStore } from '../stores/role-store';
import { useMessageStore } from '../stores/message-store';
import { shellStyles } from './app-shell.css';
import { DeviceDetailPage } from './device-detail-page';
import { DeviceListPage } from './device-list-page';
import { HomePage } from './home-page';
import { MessagesPage } from './messages-page';
import { MessageDetailPage } from './message-detail-page';
import { ProfilePage } from './profile-page';
import { RepairDetailPage } from './repair-detail-page';
import { RepairFormPage } from './repair-form-page';
import { ServiceEvaluationPage } from './service-evaluation-page';
import { SparePartsAuthPage } from './spare-parts-auth-page';
import { SuperUserServicePage } from './super-user-service-page';
import { UserDevicePage } from './user-device-page';
import { WorkOrderDetailPage } from './work-order-detail-page';
import { WorkOrderListPage } from './work-order-list-page';
import { deviceList } from '../utils/device-data';

type NavState =
  | { type: 'tab-content' }
  | { type: 'device-detail'; device: Device }
  | { type: 'repair-form'; device: Device }
  | { type: 'spare-parts-auth' }
  | { type: 'repair-detail'; repairId: string }
  | { type: 'work-order-detail'; orderId: string }
  | { type: 'service-eval'; repairId: string };

type ProfileSubPage = null | 'messages' | { type: 'message-detail'; messageId: string };

export const AppShell = () => {
  const { role } = useRoleStore();
  const messages = useMessageStore((state) => state.messages);
  const isAdmin = role === 'admin';

  const [activeTab, setActiveTab] = useState<AppTab>('devices');
  const [navStack, setNavStack] = useState<NavState[]>([{ type: 'tab-content' }]);
  const [profileSubPage, setProfileSubPage] = useState<ProfileSubPage>(null);
  const [showScanModal, setShowScanModal] = useState(false);

  const currentNav = navStack[navStack.length - 1];

  const navigate = (state: NavState) => setNavStack((prev) => [...prev, state]);
  const goBack = () => setNavStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));

  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    setNavStack([{ type: 'tab-content' }]);
    setProfileSubPage(null);
  };

  const unreadMessageCount = useMemo(() => {
    const visible = messages.filter((m) => isAdmin || !m.forAdminOnly);
    return visible.filter((m) => !m.isRead).length;
  }, [isAdmin, messages]);

  // Fullscreen overlay pages (no bottom bar)
  if (currentNav.type === 'device-detail') {
    return (
      <div className={shellStyles.shell}>
        <div className={shellStyles.content}>
          <DeviceDetailPage
            device={currentNav.device}
            onBack={goBack}
            onRepairDetailPress={(repairId) => navigate({ type: 'repair-detail', repairId })}
            onWorkOrderPress={(orderId) => navigate({ type: 'work-order-detail', orderId })}
            onQuickRepair={() => navigate({ type: 'repair-form', device: currentNav.device })}
          />
        </div>
      </div>
    );
  }

  if (currentNav.type === 'repair-form') {
    return (
      <div className={shellStyles.shell}>
        <div className={shellStyles.content}>
          <RepairFormPage
            device={currentNav.device}
            onBack={goBack}
            onSubmitSuccess={goBack}
          />
        </div>
      </div>
    );
  }

  if (currentNav.type === 'spare-parts-auth') {
    return (
      <div className={shellStyles.shell}>
        <div className={shellStyles.content}>
          <SparePartsAuthPage onBack={goBack} />
        </div>
      </div>
    );
  }

  if (currentNav.type === 'repair-detail') {
    return (
      <div className={shellStyles.shell}>
        <div className={shellStyles.content}>
          <RepairDetailPage
            repairId={currentNav.repairId}
            onBack={goBack}
            onWorkOrderPress={(orderId) => navigate({ type: 'work-order-detail', orderId })}
          />
        </div>
      </div>
    );
  }

  if (currentNav.type === 'work-order-detail') {
    return (
      <div className={shellStyles.shell}>
        <div className={shellStyles.content}>
          <WorkOrderDetailPage
            orderId={currentNav.orderId}
            onBack={goBack}
            onServiceEvalPress={() => navigate({ type: 'service-eval', repairId: currentNav.orderId })}
          />
        </div>
      </div>
    );
  }

  if (currentNav.type === 'service-eval') {
    return (
      <div className={shellStyles.shell}>
        <div className={shellStyles.content}>
          <ServiceEvaluationPage repairId={currentNav.repairId} onBack={goBack} />
        </div>
      </div>
    );
  }

  return (
    <div className={shellStyles.shell}>
      {showScanModal && (
        <div className={shellStyles.scanOverlay} onClick={() => setShowScanModal(false)}>
          <div className={shellStyles.scanSheet} onClick={(e) => e.stopPropagation()}>
            <div className={shellStyles.scanSheetTitle}>扫码</div>
            <button
              className={shellStyles.scanOptionBtn}
              onClick={() => { setShowScanModal(false); setActiveTab('repair'); setNavStack([{ type: 'tab-content' }]); }}
            >
              <div className={shellStyles.scanOptionIconWrap}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M10 2C6.13 2 3 5.13 3 9s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm-1-8v4l3.5 2.08-.72 1.18L8 11V6h1z" fill="white"/>
                </svg>
              </div>
              <div>
                <div className={shellStyles.scanOptionLabel}>扫码报修</div>
                <div className={shellStyles.scanOptionSub}>扫描设备二维码展开报修申请</div>
              </div>
            </button>
            <button
              className={shellStyles.scanOptionBtn}
              onClick={() => { setShowScanModal(false); setActiveTab('devices'); setNavStack([{ type: 'tab-content' }]); }}
            >
              <div className={shellStyles.scanOptionIconWrap}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <rect x="2" y="2" width="6" height="6" rx="1" stroke="white" strokeWidth="1.4" fill="none"/>
                  <rect x="3.5" y="3.5" width="3" height="3" fill="white"/>
                  <rect x="12" y="2" width="6" height="6" rx="1" stroke="white" strokeWidth="1.4" fill="none"/>
                  <rect x="13.5" y="3.5" width="3" height="3" fill="white"/>
                  <rect x="2" y="12" width="6" height="6" rx="1" stroke="white" strokeWidth="1.4" fill="none"/>
                  <rect x="3.5" y="13.5" width="3" height="3" fill="white"/>
                  <line x1="12" y1="12" x2="18" y2="12" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                  <line x1="12" y1="18" x2="18" y2="18" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                  <line x1="12" y1="12" x2="12" y2="18" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                  <line x1="18" y1="12" x2="18" y2="18" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className={shellStyles.scanOptionLabel}>扫码绑定设备</div>
                <div className={shellStyles.scanOptionSub}>扫描设备二维码快速关联设备信息</div>
              </div>
            </button>
            <button className={shellStyles.scanCancelBtn} onClick={() => setShowScanModal(false)}>取消</button>
          </div>
        </div>
      )}
      <div className={shellStyles.content}>
        {activeTab === 'repair' && (
          isAdmin
            ? (
              <SuperUserServicePage
                onDevicePress={(device) => navigate({ type: 'device-detail', device })}
                onRepairDetailPress={(repairId) => navigate({ type: 'repair-detail', repairId })}
                onServiceEvalPress={(repairId) => navigate({ type: 'service-eval', repairId })}
              />
            )
            : (
              <HomePage
                onDevicePress={(device) => navigate({ type: 'device-detail', device })}
                onRepairDetailPress={(repairId) => navigate({ type: 'repair-detail', repairId })}
                onServiceEvalPress={(repairId) => navigate({ type: 'service-eval', repairId })}
              />
            )
        )}
        {activeTab === 'devices' && (
          isAdmin
            ? <DeviceListPage onDevicePress={(device) => navigate({ type: 'device-detail', device })} onScanSparePartAuth={() => navigate({ type: 'spare-parts-auth' })} />
            : <UserDevicePage onDevicePress={(device) => navigate({ type: 'device-detail', device })} onScanSparePartAuth={() => navigate({ type: 'spare-parts-auth' })} />
        )}
        {activeTab === 'orders' && (
          <WorkOrderListPage onWorkOrderPress={(orderId) => navigate({ type: 'work-order-detail', orderId })} />
        )}
        {activeTab === 'profile' && typeof profileSubPage === 'object' && profileSubPage !== null && profileSubPage.type === 'message-detail' && (
          <MessageDetailPage
            messageId={profileSubPage.messageId}
            onBack={() => setProfileSubPage('messages')}
            onDevicePress={(deviceId) => {
              const device = deviceList.find((d) => d.id === deviceId);
              if (device) navigate({ type: 'device-detail', device });
            }}
          />
        )}
        {activeTab === 'profile' && profileSubPage === 'messages' && (
          <MessagesPage
            onBack={() => setProfileSubPage(null)}
            onMessagePress={(messageId) => setProfileSubPage({ type: 'message-detail', messageId })}
            onDevicePress={(deviceId) => {
              const device = deviceList.find((d) => d.id === deviceId);
              if (device) navigate({ type: 'device-detail', device });
            }}
          />
        )}
        {activeTab === 'profile' && profileSubPage === null && (
          <ProfilePage
            unreadMessageCount={unreadMessageCount}
            onMessagesPress={() => setProfileSubPage('messages')}
          />
        )}
      </div>
      <button
        className={shellStyles.scanFab}
        onClick={() => setShowScanModal(true)}
        aria-label="扫码"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="6" height="6" rx="1" stroke="white" strokeWidth="1.4" fill="none"/>
          <rect x="2.5" y="2.5" width="3" height="3" fill="white"/>
          <rect x="13" y="1" width="6" height="6" rx="1" stroke="white" strokeWidth="1.4" fill="none"/>
          <rect x="14.5" y="2.5" width="3" height="3" fill="white"/>
          <rect x="1" y="13" width="6" height="6" rx="1" stroke="white" strokeWidth="1.4" fill="none"/>
          <rect x="2.5" y="14.5" width="3" height="3" fill="white"/>
          <line x1="13" y1="13" x2="19" y2="13" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="13" y1="19" x2="19" y2="19" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="13" y1="13" x2="13" y2="19" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="19" y1="13" x2="19" y2="19" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </button>
      <div className={shellStyles.bottomBar}>
        <SharedBottomBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          pendingOrderCount={isAdmin ? 3 : 1}
          unreadMessageCount={unreadMessageCount}
        />
      </div>
    </div>
  );
};

