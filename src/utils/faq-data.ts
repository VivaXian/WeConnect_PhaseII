import type { FaqItem } from '../types/faq';

export const faqData: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'repair',
    question: '设备出现故障，怎么最快提交报修？',
    answer: '在「设备」页扫码或输入设备编号，确认设备后填写故障现象即可提交。提交后可在「报修」页查看进展，也可以在报修详情里直接和工程师沟通。',
    priority: 1,
  },
  {
    id: 'faq-2',
    category: 'repair',
    question: '提交报修后多久会有人联系我？',
    answer: '客户响应中心 7x24 小时受理，收到报修后会先做初步判断。需要工程师介入时会为您分配远程服务工程师，工程师加入对话后您会在这里收到提醒。',
    priority: 2,
  },
  {
    id: 'faq-3',
    category: 'repair',
    question: '可以上传故障照片或视频吗？',
    answer: '可以。在对话中点击图片按钮上传故障照片，能帮助工程师更快判断问题。视频和语音将在后续版本支持。',
    priority: 3,
  },
  {
    id: 'faq-4',
    category: 'device',
    question: '设备列表里找不到我的设备怎么办？',
    answer: '请先在「设备」页通过扫码或输入设备编号绑定设备。如果提示查无此设备，请核对设备铭牌上的编号，或联系飞利浦服务热线 400-810-0038。',
    priority: 4,
  },
  {
    id: 'faq-5',
    category: 'work-order',
    question: '工单待签字是什么意思？',
    answer: '工程师完成现场服务后会生成服务工单，需要您在「工单」页确认服务内容并签字，签字后本次服务才算完成归档。',
    priority: 5,
  },
  {
    id: 'faq-6',
    category: 'maintenance',
    question: '怎么查看设备的保养计划？',
    answer: '进入设备详情页的「保养」标签，可以查看最近一次保养记录和下一次计划保养时间。如需调整保养安排，可在这里发起咨询。',
    priority: 6,
  },
  {
    id: 'faq-7',
    category: 'account',
    question: '为什么有些设备信息我看不到？',
    answer: '可见范围与您的账号权限和设备归属有关。如需查看本院区更多设备，可在「我的」页申请权限升级，由院方管理员审核。',
    priority: 7,
  },
  {
    id: 'faq-8',
    category: 'account',
    question: '服务已经结束了，还能继续提问吗？',
    answer: '已结束的报修对话会保留供您查阅，但不再接收新消息。如果同一台设备再次出现问题，可以在这里发起新的咨询，我们会带上原报修的记录。',
    priority: 8,
  },
];
