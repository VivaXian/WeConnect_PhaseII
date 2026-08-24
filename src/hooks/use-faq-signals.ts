import { useMemo } from 'react';
import { useVisibleConversations } from './use-visible-conversations';
import { useDeviceBindingStore } from '../stores/device-binding-store';
import type { FaqSignals } from '../utils/faq-ranking';
import { isConversationClosed } from '../utils/conversation-status';
import { deviceList } from '../utils/device-data';
import { repairData } from '../utils/repair-data';
import { workOrderData } from '../utils/work-order-data';

export const useFaqSignals = (): FaqSignals => {
  const conversations = useVisibleConversations();
  const removedIds = useDeviceBindingStore((state) => state.removedIds);

  return useMemo(
    () => ({
      hasPendingSignOrder: workOrderData.some((group) =>
        group.orders.some((order) => order.status === 'pending-sign')
      ),
      hasActiveRepair: repairData.some((group) =>
        group.records.some((record) => record.status === 'in-service')
      ),
      hasArchivedConversation: conversations.some((item) => isConversationClosed(item)),
      hasBoundDevice: deviceList.some((device) => !removedIds.includes(device.id)),
    }),
    [conversations, removedIds]
  );
};
