import type { Conversation, ConversationMessage, ConversationSegment } from '../types/conversation';
import { CURRENT_USER_ID, GENERAL_CONVERSATION_ID, repairConversationId } from '../types/conversation';

const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

export const CONVERSATION_SEED_VERSION = 21;

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

/** 演示全链路：用户发问 → CCC 接入并回复 → CCC 分配工程师 → 工程师接手 */
const elitionConversation: Conversation = {
  id: repairConversationId('apr26-1', CURRENT_USER_ID),
  scope: 'repair',
  caseRef: { kind: 'repair', id: 'apr26-1', displayNo: 'D-12126601', deviceName: 'Elition 磁共振' },
  ...OWNER_ME,
  audience: 'user',
  createdAt: `${daysAgo(1)}T10:12:00`,
  updatedAt: `${daysAgo(1)}T10:41:00`,
  segments: [
    segment({
      id: 'seg-wo-eli-me-1',
      kind: 'work-order',
      caseId: 'apr26-1',
      workOrderNo: 'W0128923815',
      engineerName: '刘工',
      status: 'open',
      startedAt: `${daysAgo(1)}T10:12:00`,
      messages: [
        {
          id: 'eli-me-1',
          senderRole: 'customer',
          type: 'text',
          content: '这台磁共振今天又进不去扫描界面了，上周处理过一次，现在又复发。',
          createdAt: `${daysAgo(1)}T10:12:00`,
        },
        {
          id: 'eli-me-2',
          senderRole: 'ccc',
          type: 'text',
          content: '您好，这里是飞利浦客户响应中心，已收到您的信息，正在为您查看。',
          createdAt: `${daysAgo(1)}T10:19:00`,
        },
        {
          id: 'eli-me-3',
          senderRole: 'ccc',
          type: 'text',
          content: '查到该设备 4 月曾因梯度放大器过温报修过。这次复发需要远程服务工程师协助，我来为您安排。',
          createdAt: `${daysAgo(1)}T10:26:00`,
        },
        {
          id: 'eli-me-4',
          senderRole: 'rse',
          senderName: '刘工',
          type: 'text',
          content: '您好，我是服务工程师刘工，4 月那次也是我跟进的。麻烦先把报错界面拍一张给我，设备先保持开机不要断电。',
          createdAt: `${daysAgo(1)}T10:41:00`,
          isRead: false,
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

const generalConversation: Conversation = {
  id: GENERAL_CONVERSATION_ID,
  scope: 'general',
  ...OWNER_ME,
  createdAt: `${daysAgo(6)}T14:20:00`,
  updatedAt: `${daysAgo(0)}T09:00:00`,
  segments: [
    segment({
      id: 'seg-inquiry-biz',
      kind: 'inquiry',
      caseId: 'inq-biz',
      status: 'closed',
      startedAt: `${daysAgo(6)}T14:20:00`,
      closedAt: `${daysAgo(6)}T15:02:00`,
      messages: [
        {
          id: 'inq-biz-1',
          senderRole: 'customer',
          type: 'text',
          content: '咨询采购报价',
          createdAt: `${daysAgo(6)}T14:20:00`,
        },
        {
          id: 'inq-biz-2',
          senderRole: 'ccc',
          type: 'text',
          content: '已收到您关于「采购报价」的咨询。客户响应中心正在为您接入，请稍作等待。',
          createdAt: `${daysAgo(6)}T14:22:00`,
        },
        {
          id: 'inq-biz-3',
          senderRole: 'customer',
          type: 'text',
          content: '想了解超声科再增配一台便携超声的价格区间和交付周期。',
          createdAt: `${daysAgo(6)}T14:31:00`,
        },
        {
          id: 'inq-biz-4',
          senderRole: 'ccc',
          type: 'text',
          content: '已转给华东区商务同事，会在 1 个工作日内与您联系。如需加急可拨打 400-810-0038。',
          createdAt: `${daysAgo(6)}T15:02:00`,
        },
      ],
    }),
    segment({
      id: 'seg-inquiry-contract',
      kind: 'inquiry',
      caseId: 'inq-contract',
      status: 'closed',
      startedAt: `${daysAgo(3)}T10:08:00`,
      closedAt: `${daysAgo(3)}T10:35:00`,
      messages: [
        {
          id: 'inq-contract-1',
          senderRole: 'customer',
          type: 'text',
          content: 'Affiniti 70 的服务合同什么时候到期？续保要走什么流程？',
          createdAt: `${daysAgo(3)}T10:08:00`,
        },
        {
          id: 'inq-contract-2',
          senderRole: 'ccc',
          type: 'text',
          content: '您好，这里是飞利浦客户响应中心，已收到您的信息，正在为您查看。',
          createdAt: `${daysAgo(3)}T10:12:00`,
        },
        {
          id: 'inq-contract-3',
          senderRole: 'ccc',
          type: 'text',
          content: '该设备服务合同剩余 52 天。续保需要科室提交申请，商务同事会把报价和合同一并发给您。',
          createdAt: `${daysAgo(3)}T10:35:00`,
        },
      ],
    }),
    segment({
      id: 'seg-inquiry-device',
      kind: 'inquiry',
      caseId: 'inq-device',
      status: 'closed',
      startedAt: `${daysAgo(1)}T16:05:00`,
      closedAt: `${daysAgo(1)}T16:48:00`,
      messages: [
        {
          id: 'inq-device-1',
          senderRole: 'customer',
          type: 'text',
          content: '咨询设备 BigBore CT 7500（EQ 2093720）',
          createdAt: `${daysAgo(1)}T16:05:00`,
        },
        {
          id: 'inq-device-2',
          senderRole: 'system',
          type: 'device-summary',
          content: '[设备状态]',
          deviceId: 'dev-005',
          repairSnapshot: null,
          createdAt: `${daysAgo(1)}T16:05:00`,
        },
        {
          id: 'inq-device-3',
          senderRole: 'ccc',
          type: 'text',
          content: '客户响应中心正在为您接入，请稍作等待。您可以先补充说明遇到的问题，或直接上传照片。',
          createdAt: `${daysAgo(1)}T16:07:00`,
        },
        {
          id: 'inq-device-4',
          senderRole: 'customer',
          type: 'text',
          content: '这台机器下周三要做年度保养，想确认一下工程师几点到、大概停机多久。',
          createdAt: `${daysAgo(1)}T16:12:00`,
        },
        {
          id: 'inq-device-5',
          senderRole: 'ccc',
          type: 'text',
          content: '已查到保养工单 WM0125120101，工程师预计上午 9 点到场，停机约 3 小时。前一天我们会再和科室确认一次。',
          createdAt: `${daysAgo(1)}T16:48:00`,
        },
      ],
    }),
    segment({
      id: 'seg-inquiry-open',
      kind: 'inquiry',
      caseId: 'inq-open',
      status: 'open',
      startedAt: `${daysAgo(0)}T09:00:00`,
      messages: [],
    }),
  ],
};

export const conversationSeed: Conversation[] = [
  generalConversation,
  epiqConversation,
  vereosConversation,
  elitionConversation,
  colleagueElitionConversation,
  azurionConversation,
];
