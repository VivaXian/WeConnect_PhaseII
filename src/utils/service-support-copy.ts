export const SERVICE_SUPPORT_LABEL = '服务支持';

export const CASE_CONVERSATION_LABEL = '沟通记录';

export const serviceSupportSummary = (engineerName: string | undefined, unreadCount: number): string =>
  unreadCount > 0
    ? `服务工程师${engineerName ?? ''}发来 ${unreadCount} 条新消息`
    : `服务工程师${engineerName ?? ''}正在跟进`;
