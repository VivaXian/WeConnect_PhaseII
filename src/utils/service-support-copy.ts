export const REPAIR_CHAT_LABEL = '报修沟通';

export const CASE_CONVERSATION_LABEL = '沟通记录';

export const repairChatSummary = (unreadCount: number): string =>
  unreadCount > 0 ? '服务工程师发来新消息' : '报修期间远程技术支持';

export const serviceSupportSummary = (engineerName: string | undefined, unreadCount: number): string =>
  unreadCount > 0
    ? `服务工程师${engineerName ?? ''}发来 ${unreadCount} 条新消息`
    : `服务工程师${engineerName ?? ''}正在跟进`;
