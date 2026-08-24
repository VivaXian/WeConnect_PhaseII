import type { ConversationMessage, SenderRole } from '../types/conversation';

export interface ScheduledReply {
  delayMs: number;
  senderRole: SenderRole;
  senderName?: string;
  type: ConversationMessage['type'];
  content: string;
  originWorkOrderId?: string;
  deviceId?: string;
  caseId?: string;
}

export interface QuickEntryPayload {
  topic?: string;
  deviceId?: string;
  caseId?: string;
}

const CCC_QUEUE = '客户响应中心正在为您接入，请稍作等待。';

export const planQuickEntryReply = (payload: QuickEntryPayload): ScheduledReply[] => {
  if (payload.deviceId) {
    return [
      {
        delayMs: 600,
        senderRole: 'ccc',
        type: 'device-summary',
        content: '[设备状态]',
        deviceId: payload.deviceId,
        caseId: payload.caseId,
      },
      {
        delayMs: 1500,
        senderRole: 'ccc',
        type: 'text',
        content: `${CCC_QUEUE}您可以先补充说明遇到的问题，或直接上传照片。`,
      },
    ];
  }

  return [
    {
      delayMs: 700,
      senderRole: 'ccc',
      type: 'text',
      content: `已收到您关于「新设备 · ${payload.topic ?? '其他'}」的咨询。${CCC_QUEUE}`,
    },
  ];
};

const ENGINEER_KEYWORDS = [
  '故障', '报错', '无法', '开机', '黑屏', '图像', '伪影', '异响',
  '停机', '报警', '死机', '维修', '坏', '不能', '异常',
];

const CCC_ACK = '您好，已收到您的信息，客户响应中心正在为您查看，请稍候。';
const CCC_HANDLE = '您好，已收到您的问题。我们会在核实后尽快回复您，如需紧急支持可拨打服务热线 400-810-0038。';
const CCC_NO_RSE = '您好，已收到您的信息。当前远程服务工程师暂不在线，客户响应中心会先为您记录并跟进，有进展会第一时间通知您。';

const needsEngineer = (text: string): boolean =>
  ENGINEER_KEYWORDS.some((keyword) => text.includes(keyword));

interface ReplyContext {
  engineerName?: string;
  originWorkOrderId?: string;
  isRseAvailable: boolean;
  hasEngineerJoined: boolean;
}

export const planAutoReply = (text: string, context: ReplyContext): ScheduledReply[] => {
  const { engineerName, originWorkOrderId, isRseAvailable, hasEngineerJoined } = context;

  if (hasEngineerJoined && engineerName) {
    return [
      {
        delayMs: 1200,
        senderRole: 'rse',
        senderName: engineerName,
        type: 'text',
        content: '收到，我看一下您发的信息，稍后回复您。',
        originWorkOrderId,
      },
    ];
  }

  if (!needsEngineer(text)) {
    return [
      { delayMs: 1000, senderRole: 'ccc', type: 'text', content: CCC_HANDLE },
    ];
  }

  if (!isRseAvailable) {
    return [
      { delayMs: 1000, senderRole: 'ccc', type: 'text', content: CCC_NO_RSE },
    ];
  }

  const assignedName = engineerName ?? '周工';

  return [
    { delayMs: 1000, senderRole: 'ccc', type: 'text', content: CCC_ACK },
    { delayMs: 3000, senderRole: 'system', type: 'system', content: `远程服务工程师 ${assignedName} 已加入对话` },
    {
      delayMs: 4200,
      senderRole: 'rse',
      senderName: assignedName,
      type: 'text',
      content: '您好，我是远程服务工程师。为了更快判断问题，麻烦补充一下设备编号，并拍一张故障画面的照片。',
      originWorkOrderId,
    },
  ];
};
