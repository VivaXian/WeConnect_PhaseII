import { useMemo } from 'react';
import type { Conversation } from '../types/conversation';
import { useConversationStore } from '../stores/conversation-store';
import { useRoleStore } from '../stores/role-store';

/** 唯一的会话读取入口：过滤掉不属于当前演示角色的会话。 */
export const useVisibleConversations = (): Conversation[] => {
  const conversations = useConversationStore((state) => state.conversations);
  const role = useRoleStore((state) => state.role);

  return useMemo(
    () => conversations.filter((item) => item.audience === undefined || item.audience === role),
    [conversations, role]
  );
};
