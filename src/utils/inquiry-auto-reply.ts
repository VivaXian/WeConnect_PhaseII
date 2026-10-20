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
  /** 这一步不是发消息，而是 CCC 建单并把用户转到报修对话 */
  escalateCaseId?: string;
}

export interface QuickEntryPayload {
  topic?: string;
  deviceId?: string;
  caseId?: string;
}

const CCC_QUEUE = '客户响应中心正在为您接入，请稍作等待。';

/** 演示升级链路只绑这一台设备，对应种子里已有的报修单 */
const ESCALATION_DEVICE_ID = 'dev-012';
const ESCALATION_CASE_ID = 'may26-2';
const ESCALATION_REPAIR_NO = 'D-12126619';
export const ESCALATION_ENGINEER = '王工';

const deviceIntake: ScheduledReply = {
  delayMs: 2000,
  senderRole: 'ccc',
  type: 'text',
  content: `${CCC_QUEUE}您可以先补充说明遇到的问题，或直接上传照片。`,
};

/** 选完设备后自动演示的一轮来回，讲方案时不用现场打字 */
const DEVICE_DEMO_SCRIPT: ScheduledReply[] = [
  deviceIntake,
  {
    delayMs: 5000,
    senderRole: 'customer',
    type: 'text',
    content: '最近两天开机后图像上有一条横向干扰纹，换了探头也没改善。',
  },
  {
    delayMs: 7500,
    senderRole: 'ccc',
    type: 'text',
    content: '收到，我先调取这台设备近 7 天的运行日志，稍等。',
  },
  {
    delayMs: 11000,
    senderRole: 'ccc',
    type: 'text',
    content: '已了解您的情况，我们核实后尽快回复您。如需紧急支持可拨打服务热线 400-810-0038。',
  },
];

/** 工程师一出现就一定有报修单：CCC 先建单，再把人转过去 */
const ESCALATION_SCRIPT: ScheduledReply[] = [
  deviceIntake,
  {
    delayMs: 5000,
    senderRole: 'customer',
    type: 'text',
    content: '开机后触摸屏没反应，要反复重启好几次才能进操作界面。',
  },
  {
    delayMs: 7500,
    senderRole: 'ccc',
    type: 'text',
    content: '收到，我先调取这台设备近 7 天的运行日志，稍等。',
  },
  {
    delayMs: 11000,
    senderRole: 'ccc',
    type: 'text',
    content: `触摸屏控制板需要远程服务工程师进一步排查。已为您创建报修 ${ESCALATION_REPAIR_NO}，后续沟通都在该报修的对话里。`,
  },
  {
    delayMs: 11600,
    senderRole: 'system',
    type: 'system',
    content: '',
    escalateCaseId: ESCALATION_CASE_ID,
  },
];

/** 转过去之后工程师在**报修对话**里开口，顺带让顶部横条亮起来 */
export const planEngineerIntro = (): ScheduledReply[] => [
  {
    delayMs: 4000,
    senderRole: 'rse',
    senderName: ESCALATION_ENGINEER,
    type: 'text',
    content: `您好，我是服务工程师${ESCALATION_ENGINEER}，已接手这张报修单。麻烦把触摸屏没反应时的界面拍一张给我，设备先保持开机不要断电。`,
  },
];

/** 信息卡是系统自动调的，要排在「客户响应中心已接入」之前 */
export const planQuickEntryReply = (payload: QuickEntryPayload): ScheduledReply[] => {
  if (payload.deviceId) {
    return [
      {
        delayMs: 300,
        senderRole: 'system',
        type: 'device-summary',
        content: '[设备状态]',
        deviceId: payload.deviceId,
        caseId: payload.caseId,
      },
      ...(payload.deviceId === ESCALATION_DEVICE_ID ? ESCALATION_SCRIPT : DEVICE_DEMO_SCRIPT),
    ];
  }

  return [
    {
      delayMs: 2000,
      senderRole: 'ccc',
      type: 'text',
      content: `已收到您关于「${payload.topic ?? '其他'}」的咨询。${CCC_QUEUE}`,
    },
  ];
};

const ENGINEER_KEYWORDS = [
  '故障', '报错', '无法', '开机', '黑屏', '图像', '伪影', '异响',
  '停机', '报警', '死机', '维修', '坏', '不能', '异常',
];

const CCC_ACK = '您好，这里是飞利浦客户响应中心，已收到您的信息，正在为您查看。';
const CCC_HANDLE = '已了解您的情况，我们核实后尽快回复您。如需紧急支持可拨打服务热线 400-810-0038。';
const CCC_ASSIGN = '这个情况需要远程服务工程师协助，我来为您安排。';
const RSE_ECHO = '收到，我看一下您发的信息，稍后回复您。';
const RSE_INTRO = '您好，我是服务工程师。为了更快判断问题，麻烦补充一下设备编号，并拍一张故障画面的照片。';

const needsEngineer = (text: string): boolean =>
  ENGINEER_KEYWORDS.some((keyword) => text.includes(keyword));

interface ReplyContext {
  /** 当前开放段上的工程师——有即代表远程工单进行中，由 RSE 接；没有则 CCC 是前台 */
  engineerName?: string;
  originWorkOrderId?: string;
  fallbackEngineerName?: string;
  /** 主对话里永远不出现工程师：工程师一出现就一定已经有报修单了 */
  isGeneral?: boolean;
}

export const planAutoReply = (text: string, context: ReplyContext): ScheduledReply[] => {
  const { engineerName, originWorkOrderId, fallbackEngineerName, isGeneral } = context;

  if (engineerName) {
    return [
      {
        delayMs: 1200,
        senderRole: 'rse',
        senderName: engineerName,
        type: 'text',
        content: RSE_ECHO,
        originWorkOrderId,
      },
    ];
  }

  // CCC 是消息池，不是待命的人——首条回复要有明显的等待感
  const ack: ScheduledReply = { delayMs: 2400, senderRole: 'ccc', type: 'text', content: CCC_ACK };

  if (!needsEngineer(text)) {
    return [ack, { delayMs: 4000, senderRole: 'ccc', type: 'text', content: CCC_HANDLE }];
  }

  const assign: ScheduledReply = { delayMs: 4200, senderRole: 'ccc', type: 'text', content: CCC_ASSIGN };

  if (isGeneral) return [ack, assign];

  const assignedName = fallbackEngineerName ?? '周工';

  return [
    ack,
    assign,
    {
      delayMs: 6000,
      senderRole: 'rse',
      senderName: assignedName,
      type: 'text',
      content: RSE_INTRO,
      originWorkOrderId,
    },
  ];
};
