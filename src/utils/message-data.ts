import type { AppMessage } from '../types/message';

// Reference date: May 9, 2026
export const messageData: AppMessage[] = [
  // === SU only: Contract alerts (aggregated) ===
  {
    id: 'msg-001',
    category: 'contract-expired',
    title: '2 台设备服务合同已到期',
    body: '以下设备服务合同已到期，设备处于无保障状态，建议尽快联系飞利浦销售安排续保，恢复设备保障。',
    time: '2026-05-01',
    isRead: false,
    forAdminOnly: true,
    isAggregated: true,
    devices: [
      { id: 'dev-004', name: 'MR 5300', department: '放射科', campus: '主院区', summary: '合同于 2025-12-31 到期' },
      { id: 'dev-007', name: 'Lumify 便携超声', department: '急诊科', campus: '东院区', summary: '合同于 2023-04-14 到期' },
    ],
  },
  {
    id: 'msg-002',
    category: 'contract-expiry',
    title: '3 台设备合同即将出保',
    body: '以下设备服务合同将在 4 个月内到期，建议提前联系飞利浦销售安排续保，避免设备进入无保障状态。',
    time: '2026-04-28',
    isRead: false,
    forAdminOnly: true,
    isAggregated: true,
    devices: [
      { id: 'dev-006', name: 'Affiniti 70', department: '心内科', campus: '主院区', summary: '合同于 2026-06-20 到期，还剩 42 天' },
      { id: 'dev-002', name: 'Azurion M3', department: '导管室', campus: '主院区', summary: '合同于 2026-07-15 到期，还剩 67 天' },
      { id: 'dev-005', name: 'BigBore CT 7500', department: '放射治疗科', campus: '东院区', summary: '合同于 2026-09-30 到期，还剩 144 天' },
    ],
  },
  // === SU only: Acceptance reminder (aggregated) ===
  {
    id: 'msg-003',
    category: 'acceptance',
    title: '3 台设备待验收',
    body: '验收前设备处于无保状态，请及时完成验收以开启保修服务。',
    time: '2026-05-01',
    isRead: false,
    forAdminOnly: true,
    isAggregated: true,
    devices: [
      { id: 'dev-006', name: 'Affiniti 70', department: '心内科', campus: '主院区', summary: '装机于 2026-03-01，待验收已 69 天' },
      { id: 'dev-010', name: 'EPIQ Elite', department: '妇产科', campus: '主院区', summary: '装机于 2026-02-15，待验收已 83 天' },
      { id: 'dev-011', name: 'Ingenia Ambition 1.5T', department: '神经内科', campus: '东院区', summary: '装机于 2026-01-20，待验收已 109 天' },
    ],
  },
  // === SU only: PM plan (aggregated) ===
  {
    id: 'msg-004',
    category: 'pm-plan',
    title: '5 月保养计划 · 5 台设备',
    body: '本月5 台设备有保养计划，请知悉并安排停机时间。',
    time: '2026-05-01',
    isRead: false,
    forAdminOnly: true,
    isAggregated: true,
    devices: [
      { id: 'dev-001', name: 'Azurion M3', department: '导管室', campus: '主院区', summary: '计划日期：5 月 1 日' },
      { id: 'dev-003', name: 'BigBore CT 7500', department: '放射治疗科', campus: '东院区', summary: '计划日期：5 月 1 日' },
      { id: 'dev-005', name: 'Vereos PET/CT', department: '核医学科', campus: '主院区', summary: '计划日期：5 月 1 日' },
      { id: 'dev-008', name: 'Ingenia 3.0T', department: '放射科', campus: '主院区', summary: '计划日期：5 月 15 日' },
      { id: 'dev-009', name: 'Affiniti 70', department: '心内科', campus: '主院区', summary: '计划日期：5 月 15 日' },
    ],
  },
  // === Both: PM risk (aggregated) ===
  {
    id: 'msg-005',
    category: 'pm-risk',
    title: '2 台设备存在保养风险',
    body: '以下设备距上次保养已超过建议周期，且暂无新保养计划。建议尽快联系飞利浦销售安排保养。',
    time: '2026-05-01',
    isRead: false,
    forAdminOnly: false,
    isAggregated: true,
    devices: [
      { id: 'dev-004', name: 'MR 5300', department: '放射科', campus: '主院区', summary: '上次保养：2025-06-10，已超 11 个月' },
      { id: 'dev-007', name: 'Lumify 便携超声', department: '急诊科', campus: '东院区', summary: '长期未保养，建议尽快安排' },
    ],
  },
  // === U only: Permission upgrade ===
  {
    id: 'msg-008',
    category: 'permission-upgrade',
    title: '授权用户权限已开通',
    body: '授权用户权限申请已审核通过，权限有效期至 2027-04-15。现可查看授权院区全院的设备列表、合同信息及保养风险提醒。',
    time: '2026-04-15',
    isRead: true,
    forAdminOnly: false,
  },
  // === Temporary extra messages for SU pagination preview ===
  {
    id: 'msg-009',
    category: 'contract-expiry',
    title: '2 台设备合同即将出保',
    body: '以下设备服务合同将在 4 个月内到期，建议提前联系飞利浦销售安排续保，避免设备进入无保障状态。',
    time: '2026-05-01',
    isRead: false,
    forAdminOnly: true,
    isAggregated: true,
    devices: [
      { id: 'dev-003', name: 'Brilliance CT', department: '影像科', campus: '东院区', summary: '合同于 2026-07-16 到期，还剩 76 天' },
      { id: 'dev-010', name: 'EPIQ Elite', department: '心内科', campus: '主院区', summary: '合同于 2026-07-24 到期，还剩 84 天' },
    ],
  },
  {
    id: 'msg-013',
    category: 'pm-risk',
    title: '1 台设备存在保养风险',
    body: '该设备距上次保养已超过建议周期，且暂无新保养计划，建议联系飞利浦销售沟通并尽快安排保养。',
    time: '2026-04-01',
    isRead: true,
    forAdminOnly: false,
    deviceId: 'dev-005',
    deviceName: 'BigBore CT 7500',
    deviceDept: '放射治疗科',
    deviceCampus: '东院区',
    deviceSummary: '上次保养：2025-09-20，已 6 个月未保养',
  },
  {
    id: 'msg-014',
    category: 'contract-expired',
    title: '1 台设备服务合同已到期',
    body: '该设备服务合同已到期，设备处于无保障状态，建议尽快联系飞利浦销售安排续保，恢复设备保障。',
    time: '2026-05-03',
    isRead: false,
    forAdminOnly: true,
    deviceId: 'dev-007',
    deviceName: 'Lumify 便携超声',
    deviceDept: '急诊科',
    deviceCampus: '东院区',
    deviceSummary: '合同于 2023-04-14 到期',
  },
];

