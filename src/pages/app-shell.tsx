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
import { ScanCameraPage } from './scan-camera-page';
import { ScanDeviceInputPage } from './scan-device-input-page';
import { ServiceEvaluationPage } from './service-evaluation-page';
import { SparePartsAuthPage } from './spare-parts-auth-page';
import { EngineerVerifyPage } from './engineer-verify-page';
import { EngineerChatPage } from './engineer-chat-page';
import { SuperUserServicePage } from './super-user-service-page';
import { UserDevicePage } from './user-device-page';
import { WorkOrderDetailPage } from './work-order-detail-page';
import { WorkOrderListPage } from './work-order-list-page';
import { PrivacyPolicyPage } from './privacy-policy-page';
import { deviceList } from '../utils/device-data';

type NavState =
  | { type: 'tab-content' }
  | { type: 'device-detail'; device: Device; initialTab?: 'repair' | 'pm' | 'workorder' | 'contract' | 'info' }
  | { type: 'repair-form'; device: Device }
  | { type: 'spare-parts-auth' }
  | { type: 'engineer-verify' }
  | { type: 'engineer-chat' }
  | { type: 'scan-camera' }
  | { type: 'scan-device-input'; confirmDevice?: Device }
  | { type: 'repair-detail'; repairId: string }
  | { type: 'work-order-detail'; orderId: string }
  | { type: 'service-eval'; repairId: string }
  | { type: 'privacy-policy' };

type ProfileSubPage = null | 'messages' | { type: 'message-detail'; messageId: string; backTarget: 'profile' | 'messages' };

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
  const replaceCurrentAndNavigate = (current: NavState, next: NavState) =>
    setNavStack((prev) => [...prev.slice(0, -1), current, next]);

  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    setNavStack([{ type: 'tab-content' }]);
    setProfileSubPage(null);
  };

  const visibleMessages = useMemo(
    () => messages.filter((m) => isAdmin || !m.forAdminOnly),
    [isAdmin, messages]
  );

  const unreadMessageCount = useMemo(
    () => visibleMessages.filter((m) => !m.isRead).length,
    [visibleMessages]
  );

  const recentMessages = useMemo(() => visibleMessages.slice(0, 3), [visibleMessages]);

  // Fullscreen overlay pages (no bottom bar)
  if (currentNav.type === 'device-detail') {
    return (
      <div className={shellStyles.shell}>
        <div className={shellStyles.content}>
          <DeviceDetailPage
            device={currentNav.device}
            initialTab={currentNav.initialTab}
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

  if (currentNav.type === 'engineer-verify') {
    return (
      <div className={shellStyles.shell}>
        <div className={shellStyles.content}>
          <EngineerVerifyPage onBack={goBack} />
        </div>
      </div>
    );
  }

  if (currentNav.type === 'engineer-chat') {
    return (
      <div className={shellStyles.shell}>
        <div className={shellStyles.content}>
          <EngineerChatPage onBack={goBack} />
        </div>
      </div>
    );
  }

  if (currentNav.type === 'scan-camera') {
    return (
      <div className={shellStyles.shell}>
        <div className={shellStyles.content}>
          <ScanCameraPage
            onBack={goBack}
          />
        </div>
      </div>
    );
  }

  if (currentNav.type === 'scan-device-input') {
    return (
      <div className={shellStyles.shell}>
        <div className={shellStyles.content}>
          <ScanDeviceInputPage
            onBack={goBack}
            onScanPress={() => navigate({ type: 'scan-camera' })}
            onRepairPress={(device) =>
              replaceCurrentAndNavigate(
                { type: 'scan-device-input', confirmDevice: device },
                { type: 'repair-form', device }
              )
            }
            onRepairProgressPress={(device) =>
              replaceCurrentAndNavigate(
                { type: 'scan-device-input', confirmDevice: device },
                { type: 'device-detail', device, initialTab: 'repair' }
              )
            }
            initialDevice={currentNav.confirmDevice}
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

  if (currentNav.type === 'privacy-policy') {
    return (
      <div className={shellStyles.shell}>
        <div className={shellStyles.content}>
          <PrivacyPolicyPage onBack={goBack} />
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
            ? <DeviceListPage onDevicePress={(device) => navigate({ type: 'device-detail', device })} onScanRepair={() => navigate({ type: 'scan-camera' })} />
            : <UserDevicePage onDevicePress={(device) => navigate({ type: 'device-detail', device })} onScanRepair={() => navigate({ type: 'scan-camera' })} />
        )}
        {activeTab === 'orders' && (
          <WorkOrderListPage onWorkOrderPress={(orderId) => navigate({ type: 'work-order-detail', orderId })} />
        )}
        {activeTab === 'profile' && typeof profileSubPage === 'object' && profileSubPage !== null && profileSubPage.type === 'message-detail' && (
          <MessageDetailPage
            messageId={profileSubPage.messageId}
            onBack={() => setProfileSubPage(profileSubPage.backTarget === 'profile' ? null : 'messages')}
            onDevicePress={(deviceId) => {
              const device = deviceList.find((d) => d.id === deviceId);
              if (device) navigate({ type: 'device-detail', device });
            }}
            onWorkOrderPress={(orderId) => navigate({ type: 'work-order-detail', orderId })}
          />
        )}
        {activeTab === 'profile' && profileSubPage === 'messages' && (
          <MessagesPage
            onBack={() => setProfileSubPage(null)}
            onMessagePress={(messageId) => setProfileSubPage({ type: 'message-detail', messageId, backTarget: 'messages' })}
            onDevicePress={(deviceId) => {
              const device = deviceList.find((d) => d.id === deviceId);
              if (device) navigate({ type: 'device-detail', device });
            }}
          />
        )}
        {activeTab === 'profile' && profileSubPage === null && (
          <ProfilePage
            unreadMessageCount={unreadMessageCount}
            recentMessages={recentMessages}
            onMessagesPress={() => setProfileSubPage('messages')}
            onMessagePress={(messageId) => setProfileSubPage({ type: 'message-detail', messageId, backTarget: 'profile' })}
            onCommonDevicesPress={() => handleTabChange('devices')}
            onScanPress={() => navigate({ type: 'scan-camera' })}
            onInputDevicePress={() => navigate({ type: 'scan-device-input' })}
            onSparePartsAuthPress={() => navigate({ type: 'spare-parts-auth' })}
            onEngineerVerifyPress={() => navigate({ type: 'engineer-verify' })}
            onPrivacyPolicyPress={() => navigate({ type: 'privacy-policy' })}
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

