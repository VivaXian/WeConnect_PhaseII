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
import { ProfilePage } from './profile-page';
import { RepairDetailPage } from './repair-detail-page';
import { ServiceEvaluationPage } from './service-evaluation-page';
import { SuperUserServicePage } from './super-user-service-page';
import { UserDevicePage } from './user-device-page';
import { WorkOrderDetailPage } from './work-order-detail-page';
import { WorkOrderListPage } from './work-order-list-page';

type NavState =
  | { type: 'tab-content' }
  | { type: 'device-detail'; device: Device }
  | { type: 'repair-detail'; repairId: string }
  | { type: 'work-order-detail'; orderId: string }
  | { type: 'service-eval'; repairId: string };

type ProfileSubPage = 'messages' | null;

export const AppShell = () => {
  const { role } = useRoleStore();
  const messages = useMessageStore((state) => state.messages);
  const isAdmin = role === 'admin';

  const [activeTab, setActiveTab] = useState<AppTab>('devices');
  const [navStack, setNavStack] = useState<NavState[]>([{ type: 'tab-content' }]);
  const [profileSubPage, setProfileSubPage] = useState<ProfileSubPage>(null);

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
          />
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
            ? <DeviceListPage onDevicePress={(device) => navigate({ type: 'device-detail', device })} />
            : <UserDevicePage onDevicePress={(device) => navigate({ type: 'device-detail', device })} />
        )}
        {activeTab === 'orders' && (
          <WorkOrderListPage onWorkOrderPress={(orderId) => navigate({ type: 'work-order-detail', orderId })} />
        )}
        {activeTab === 'profile' && profileSubPage === 'messages' && (
          <MessagesPage onBack={() => setProfileSubPage(null)} />
        )}
        {activeTab === 'profile' && profileSubPage === null && (
          <ProfilePage
            unreadMessageCount={unreadMessageCount}
            onMessagesPress={() => setProfileSubPage('messages')}
          />
        )}
      </div>
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

