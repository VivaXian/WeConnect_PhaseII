import type { Conversation, ConversationMessage, ConversationSegment } from '../types/conversation';
import { CURRENT_USER_ID, repairConversationId } from '../types/conversation';

const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

export const CONVERSATION_SEED_VERSION = 15;

type MessageSeed = Omit<ConversationMessage, 'isRead'> & { isRead?: boolean };

const message = (seed: MessageSeed): ConversationMessage => ({ isRead: true, ...seed });

const segment = (
  seed: Omit<ConversationSegment, 'messages'> & { messages: MessageSeed[] }
): ConversationSegment => ({ ...seed, messages: seed.messages.map(message) });

const OWNER_ME = { ownerId: CURRENT_USER_ID, ownerName: '我' };
const OWNER_COLLEAGUE = { ownerId: 'colleague-li', ownerName: '李主任' };

const epiqConversation: Conversation = {
  id: repairConversationId('may26-1', CURRENT_USER_ID),
  scope: 'repair',
  caseRef: { kind: 'repair', id: 'may26-1', displayNo: 'D-12126615', deviceName: 'EPIQ Elite' },
  ...OWNER_ME,
  audience: 'user',
  createdAt: '2026-05-20T09:40:00',
  updatedAt: '2026-05-22T10:41:00',
  segments: [
    segment({
      id: 'seg-wo-1',
      kind: 'work-order',
      caseId: 'may26-1',
      workOrderNo: 'W0128923901',
      engineerName: '周工',
      status: 'closed',
      startedAt: '2026-05-20T09:40:00',
      closedAt: '2026-05-21T17:30:00',
      messages: [
        {
          id: 'epiq-1',
          senderRole: 'rse',
          senderName: '周工',
          type: 'text',
          content: '您好，我是服务工程师周工，负责跟进您报修的 EPIQ Elite 图像异常。麻烦确认一下探头型号，并把开机自检界面拍给我看一下。',
          createdAt: '2026-05-20T09:40:00',
        },
        {
          id: 'epiq-2',
          senderRole: 'customer',
          type: 'text',
          content: '探头是 C5-1，自检没有报错，但图像右上角一直有横向条纹。',
          createdAt: '2026-05-20T10:05:00',
        },
        {
          id: 'epiq-3',
          senderRole: 'rse',
          senderName: '周工',
          type: 'text',
          content: '收到。我先远程调取图像板日志，有结论后回复您。',
          createdAt: '2026-05-20T10:22:00',
        },
        {
          id: 'epiq-4',
          senderRole: 'rse',
          senderName: '周工',
          type: 'text',
          content: '日志确认图像板通道存在干扰，与探头无关。已提交板卡备件申请，后续安排工程师上门更换，在线这边先到这里。',
          createdAt: '2026-05-21T17:12:00',
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
      startedAt: '2026-05-22T10:36:00',
      messages: [
        {
          id: 'epiq-5',
          senderRole: 'rse',
          senderName: '周工',
          type: 'text',
          content: '板卡备件已调拨到位，工程师计划明天上午上门更换。麻烦确认一下科室明天上午是否方便停机进机房？',
          createdAt: '2026-05-22T10:36:00',
          isRead: false,
        },
        {
          id: 'epiq-6',
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

const vereosConversation: Conversation = {
  id: repairConversationId('feb26-1', CURRENT_USER_ID),
  scope: 'repair',
  caseRef: { kind: 'repair', id: 'feb26-1', displayNo: 'D-12126572', deviceName: 'Vereos PET/CT' },
  ...OWNER_ME,
  audience: 'user',
  createdAt: '2026-05-09T09:12:00',
  updatedAt: '2026-05-10T09:05:00',
  segments: [
    segment({
      id: 'seg-wo-ver-1',
      kind: 'work-order',
      caseId: 'feb26-1',
      workOrderNo: 'W0128923799',
      engineerName: '陈工',
      status: 'closed',
      startedAt: '2026-05-09T09:12:00',
      closedAt: '2026-05-10T09:05:00',
      messages: [
        {
          id: 'ver-1',
          senderRole: 'rse',
          senderName: '陈工',
          type: 'text',
          content: '您好，我是服务工程师陈工，负责跟进您报修的 Vereos PET/CT 图像重建失败。麻烦先保持设备开机，我远程读一下探测器日志。',
          createdAt: '2026-05-09T09:12:00',
        },
        {
          id: 'ver-2',
          senderRole: 'customer',
          type: 'text',
          content: '设备已重新开机并保持待机，日志需要我们导出吗？',
          createdAt: '2026-05-09T09:35:00',
        },
        {
          id: 'ver-3',
          senderRole: 'rse',
          senderName: '陈工',
          type: 'text',
          content: '不用，我这边可以直接读取。有结论后回复您。',
          createdAt: '2026-05-09T10:02:00',
        },
        {
          id: 'ver-4',
          senderRole: 'rse',
          senderName: '陈工',
          type: 'text',
          content: '日志确认探测器模块通道失效，远程无法恢复，需要上门更换模块。已安排工程师到现场处理，在线这边先到这里。',
          createdAt: '2026-05-10T09:05:00',
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
  createdAt: '2026-04-26T08:52:00',
  updatedAt: '2026-04-26T11:05:00',
  segments: [
    segment({
      id: 'seg-wo-eli-1',
      kind: 'work-order',
      caseId: 'apr26-1',
      workOrderNo: 'W0128923810',
      engineerName: '刘工',
      status: 'open',
      startedAt: '2026-04-26T08:52:00',
      messages: [
        {
          id: 'eli-1',
          senderRole: 'rse',
          senderName: '刘工',
          type: 'text',
          content: '您好，我是服务工程师刘工，负责跟进 Elition 磁共振无法进入扫描界面的报修。已远程接入，正在检查主控日志，请科室先不要断电。',
          createdAt: '2026-04-26T08:52:00',
        },
        {
          id: 'eli-2',
          senderRole: 'customer',
          type: 'text',
          content: '好的，设备保持开机。今天上午的排班已经先转到北院了。',
          createdAt: '2026-04-26T09:14:00',
        },
        {
          id: 'eli-3',
          senderRole: 'rse',
          senderName: '刘工',
          type: 'text',
          content: '日志已定位到梯度放大器过温保护，正在确认处理方案，稍后回复您。',
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
  createdAt: '2026-07-06T15:52:00',
  updatedAt: '2026-07-13T16:52:00',
  segments: [
    segment({
      id: 'seg-wo-az-1',
      kind: 'work-order',
      caseId: 'jul26-1',
      workOrderNo: 'W0128923869',
      engineerName: '赵工',
      status: 'closed',
      startedAt: '2026-07-06T15:52:00',
      closedAt: '2026-07-13T16:52:00',
      messages: [
        {
          id: 'az-1',
          senderRole: 'rse',
          senderName: '赵工',
          type: 'text',
          content: '您好，我是服务工程师赵工，负责跟进您报修的 Azurion M3。麻烦把报错界面拍一张给我，我先判断是否需要带件上门。',
          createdAt: '2026-07-06T15:52:00',
        },
        {
          id: 'az-2',
          senderRole: 'customer',
          type: 'text',
          content: '错误码 E-207，开机自检到一半就停住了。',
          createdAt: '2026-07-06T16:10:00',
        },
        {
          id: 'az-3',
          senderRole: 'rse',
          senderName: '赵工',
          type: 'text',
          content: '已远程读取日志，判断为高压发生器控制板故障，备件已申请，预计 7 月 13 日前到货，到货当天上门更换。',
          createdAt: '2026-07-09T10:20:00',
        },
        {
          id: 'az-4',
          senderRole: 'rse',
          senderName: '赵工',
          type: 'text',
          content: '备件已更换完毕，各项自检通过，服务报告已上传，麻烦在工单里确认签字。',
          createdAt: '2026-07-13T16:40:00',
        },
        {
          id: 'az-5',
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
  epiqConversation,
  vereosConversation,
  colleagueElitionConversation,
  azurionConversation,
];
