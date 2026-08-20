import type { Conversation, ConversationMessage, ConversationSegment } from '../types/conversation';
import { CURRENT_USER_ID, GENERAL_CONVERSATION_ID, repairConversationId } from '../types/conversation';

const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

export const CONVERSATION_SEED_VERSION = 8;

type MessageSeed = Omit<ConversationMessage, 'isRead'> & { isRead?: boolean };

const message = (seed: MessageSeed): ConversationMessage => ({ isRead: true, ...seed });

const segment = (
  seed: Omit<ConversationSegment, 'messages'> & { messages: MessageSeed[] }
): ConversationSegment => ({ ...seed, messages: seed.messages.map(message) });

const OWNER_ME = { ownerId: CURRENT_USER_ID, ownerName: '我' };
const OWNER_COLLEAGUE = { ownerId: 'colleague-zhang', ownerName: '张主任' };

const generalConversation: Conversation = {
  id: GENERAL_CONVERSATION_ID,
  scope: 'general',
  ...OWNER_ME,
  createdAt: '2026-05-08T09:00:00',
  updatedAt: '2026-06-04T08:30:00',
  segments: [
    segment({
      id: 'seg-inq-1',
      kind: 'inquiry',
      caseId: 'inq-2605-0421',
      status: 'closed',
      startedAt: '2026-05-08T09:00:00',
      closedAt: '2026-05-08T09:20:00',
      messages: [
        {
          id: 'gen-1',
          senderRole: 'ccc',
          type: 'text',
          content: '您好，这里是飞利浦客户响应中心，7x24 小时为您服务。请描述您遇到的问题，也可以直接上传设备照片。',
          createdAt: '2026-05-08T09:00:00',
        },
        {
          id: 'gen-2',
          senderRole: 'customer',
          type: 'text',
          content: '我们南院超声科的保修合同什么时候到期？想提前了解续保。',
          createdAt: '2026-05-08T09:06:00',
        },
        {
          id: 'gen-3',
          senderRole: 'ccc',
          type: 'text',
          content: '已为您查询，南院超声科 3 台设备合同于 2026 年 9 月 30 日到期。续保方案会由服务顾问在两个工作日内与您联系。',
          createdAt: '2026-05-08T09:14:00',
        },
      ],
    }),
    segment({
      id: 'seg-inq-2',
      kind: 'inquiry',
      caseId: 'inq-2605-0518',
      status: 'closed',
      startedAt: '2026-05-20T08:52:00',
      closedAt: '2026-05-20T09:12:00',
      messages: [
        {
          id: 'gen-4',
          senderRole: 'customer',
          type: 'text',
          content: 'EPIQ Elite 昨天报修过，今天图像还是有噪点，能帮忙看一下吗？',
          createdAt: '2026-05-20T08:52:00',
        },
        {
          id: 'gen-5',
          senderRole: 'ccc',
          type: 'text',
          content: '已为您找到这台设备进行中的报修单，我把这次沟通转到该报修单下，工程师可以直接看到之前的处理记录。',
          createdAt: '2026-05-20T09:04:00',
        },
        {
          id: 'gen-6',
          senderRole: 'system',
          type: 'system',
          content: '已转到报修 D-12126615 的对话',
          createdAt: '2026-05-20T09:12:00',
          transferTo: {
            conversationId: repairConversationId('may26-1', CURRENT_USER_ID),
            displayNo: 'D-12126615',
            deviceName: 'EPIQ Elite',
          },
        },
      ],
    }),
    segment({
      id: 'seg-inq-3',
      kind: 'inquiry',
      caseId: 'inq-2606-0604',
      status: 'open',
      startedAt: '2026-06-04T08:30:00',
      messages: [
        {
          id: 'gen-7',
          senderRole: 'ccc',
          type: 'text',
          content: '您好，这里是飞利浦客户响应中心，7×24 小时为您服务。客户响应中心正在为您接入，请稍作等待。',
          createdAt: '2026-06-04T08:30:00',
        },
      ],
    }),
  ],
};

const epiqConversation: Conversation = {
  id: repairConversationId('may26-1', CURRENT_USER_ID),
  scope: 'repair',
  caseRef: { kind: 'repair', id: 'may26-1', displayNo: 'D-12126615', deviceName: 'EPIQ Elite' },
  ...OWNER_ME,
  createdAt: '2026-05-20T09:12:00',
  updatedAt: '2026-05-22T10:41:00',
  segments: [
    segment({
      id: 'seg-wo-1',
      kind: 'work-order',
      caseId: 'may26-1',
      workOrderNo: 'W0128923901',
      engineerName: '周工',
      status: 'closed',
      startedAt: '2026-05-20T09:12:00',
      closedAt: '2026-05-21T17:30:00',
      messages: [
        {
          id: 'epiq-1',
          senderRole: 'ccc',
          type: 'text',
          content: '您好，关于报修 D-12126615（EPIQ Elite），已为您安排远程服务工程师跟进。',
          createdAt: '2026-05-20T09:12:00',
        },
        {
          id: 'epiq-2',
          senderRole: 'rse',
          senderName: '周工',
          type: 'text',
          content: '您好，我是远程服务工程师周工。请先确认探头型号，并把开机自检界面拍给我看一下。',
          createdAt: '2026-05-20T09:40:00',
        },
        {
          id: 'epiq-3',
          senderRole: 'customer',
          type: 'text',
          content: '探头是 C5-1，自检没有报错，但图像右上角一直有横向条纹。',
          createdAt: '2026-05-20T10:05:00',
        },
        {
          id: 'epiq-4',
          senderRole: 'rse',
          senderName: '周工',
          type: 'text',
          content: '收到。请先换一个探头接口测试，如果条纹跟着探头走，基本可以判断是探头问题。',
          createdAt: '2026-05-20T10:22:00',
        },
      ],
    }),
    segment({
      id: 'seg-wo-2',
      kind: 'work-order',
      caseId: 'may26-1',
      workOrderNo: 'W0128924017',
      engineerName: '周工',
      status: 'open',
      startedAt: '2026-05-22T09:50:00',
      messages: [
        {
          id: 'epiq-6',
          senderRole: 'customer',
          type: 'text',
          content: '换了接口还是有条纹，今天更明显了。',
          createdAt: '2026-05-22T09:50:00',
        },
        {
          id: 'epiq-7',
          senderRole: 'ccc',
          type: 'text',
          content: '已重新为您安排工程师跟进，稍后会有工程师与您联系。',
          createdAt: '2026-05-22T09:58:00',
        },
        {
          id: 'epiq-8',
          senderRole: 'rse',
          senderName: '周工',
          type: 'text',
          content: '换探头后仍然存在，基本可以排除探头本身，我先安排现场工程师带板卡过来。麻烦确认一下明天上午科室是否方便进机房？',
          createdAt: '2026-05-22T10:36:00',
          isRead: false,
        },
        {
          id: 'epiq-9',
          senderRole: 'customer',
          type: 'text',
          content: '明天上午 9 点后可以进机房，麻烦提前半小时告知。',
          createdAt: '2026-05-22T10:41:00',
          deliveryStatus: 'failed',
        },
      ],
    }),
  ],
};

const colleagueElitionConversation: Conversation = {
  id: repairConversationId('apr26-1', OWNER_COLLEAGUE.ownerId),
  scope: 'repair',
  caseRef: { kind: 'repair', id: 'apr26-1', displayNo: 'D-12126601', deviceName: 'Elition 磁共振' },
  ...OWNER_COLLEAGUE,
  createdAt: '2026-04-26T08:30:00',
  updatedAt: '2026-04-26T11:05:00',
  segments: [
    segment({
      id: 'seg-wo-eli-1',
      kind: 'work-order',
      caseId: 'apr26-1',
      workOrderNo: 'W0128923955',
      engineerName: '周工',
      status: 'open',
      startedAt: '2026-04-26T08:30:00',
      messages: [
        {
          id: 'eli-1',
          senderRole: 'customer',
          type: 'text',
          content: '设备今天早上无法进入扫描界面，已经影响排班了。',
          createdAt: '2026-04-26T08:30:00',
        },
        {
          id: 'eli-2',
          senderRole: 'ccc',
          type: 'text',
          content: '已升级为紧急处理，正在为您联系远程服务工程师。',
          createdAt: '2026-04-26T08:38:00',
        },
        {
          id: 'eli-3',
          senderRole: 'rse',
          senderName: '周工',
          type: 'text',
          content: '已远程接入，正在检查主控日志。请科室先不要断电。',
          createdAt: '2026-04-26T11:05:00',
        },
      ],
    }),
  ],
};

const azurionConversation: Conversation = {
  id: repairConversationId('jul26-1', CURRENT_USER_ID),
  scope: 'repair',
  caseRef: { kind: 'repair', id: 'jul26-1', displayNo: 'D-12126628', deviceName: 'Azurion M3' },
  ...OWNER_ME,
  createdAt: '2026-07-06T11:35:00',
  updatedAt: '2026-07-13T16:52:00',
  segments: [
    segment({
      id: 'seg-wo-az-1',
      kind: 'work-order',
      caseId: 'jul26-1',
      workOrderNo: 'W0128923869',
      engineerName: '赵工',
      status: 'closed',
      startedAt: '2026-07-06T11:35:00',
      closedAt: '2026-07-13T16:52:00',
      messages: [
        {
          id: 'az-1',
          senderRole: 'ccc',
          type: 'text',
          content: '您好，关于报修 D-12126628（Azurion M3），已为您安排服务工程师赵工跟进。',
          createdAt: '2026-07-06T11:35:00',
        },
        {
          id: 'az-2',
          senderRole: 'rse',
          senderName: '赵工',
          type: 'text',
          content: '您好，我是服务工程师赵工。麻烦把报错界面拍一张给我，我先判断是否需要带件上门。',
          createdAt: '2026-07-06T15:52:00',
        },
        {
          id: 'az-3',
          senderRole: 'customer',
          type: 'text',
          content: '错误码 E-207，开机自检到一半就停住了。',
          createdAt: '2026-07-06T16:10:00',
        },
        {
          id: 'az-4',
          senderRole: 'rse',
          senderName: '赵工',
          type: 'text',
          content: '已远程读取日志，判断为高压发生器控制板故障，备件已申请，预计 7 月 13 日前到货，到货当天上门更换。',
          createdAt: '2026-07-09T10:20:00',
        },
        {
          id: 'az-5',
          senderRole: 'rse',
          senderName: '赵工',
          type: 'text',
          content: '备件已更换完毕，各项自检通过，服务报告已上传，麻烦在工单里确认签字。',
          createdAt: '2026-07-13T16:40:00',
        },
        {
          id: 'az-6',
          senderRole: 'customer',
          type: 'text',
          content: '已签字，设备运行正常，辛苦了。',
          createdAt: '2026-07-13T16:52:00',
        },
      ],
    }),
  ],
};

export const conversationSeed: Conversation[] = [
  generalConversation,
  epiqConversation,
  colleagueElitionConversation,
  azurionConversation,
];
