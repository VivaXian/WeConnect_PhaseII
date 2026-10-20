export const CUSTOMER_SERVICE_LABEL = '客服';

/** 页面标题用完整名，tab 标签受宽度限制用短名 */
export const CUSTOMER_SERVICE_TITLE = '客户响应中心';

export const CASE_CONVERSATION_LABEL = '沟通记录';

export const serviceSupportSummary = (engineerName: string | undefined, unreadCount: number): string =>
  unreadCount > 0
    ? `服务工程师${engineerName ?? ''}发来 ${unreadCount} 条新消息`
    : `服务工程师${engineerName ?? ''}正在跟进`;
