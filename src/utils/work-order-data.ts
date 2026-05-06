import type { WorkOrderGroup } from '../types/work-order';

export const workOrderData: WorkOrderGroup[] = [
  {
    month: '2025年11月 (4)',
    orders: [
      {
        id: 'wo-001',
        type: 'repair',
        status: 'pending-sign',
        deviceName: 'Ingenia 3.0T',
        hospital: 'WeConnect医院',
        workOrderNo: 'WO128923783',
        requestTime: '2025.11.12 10:46',
      },
      {
        id: 'wo-002',
        type: 'maintenance',
        status: 'in-progress',
        deviceName: 'Ingenia 3.0T',
        hospital: 'WeConnect医院',
        workOrderNo: 'WO128923784',
        requestTime: '2025.11.10 09:30',
      },
      {
        id: 'wo-003',
        type: 'fco',
        status: 'expired',
        deviceName: 'Ingenia 3.0T',
        hospital: 'WeConnect医院',
        workOrderNo: 'WO128923785',
        requestTime: '2025.11.08 14:20',
      },
      {
        id: 'wo-004',
        type: 'install',
        status: 'in-progress',
        deviceName: 'Ingenia 3.0T',
        hospital: 'WeConnect医院',
        workOrderNo: 'WO128923786',
        requestTime: '2025.11.05 11:00',
      },
    ],
  },
  {
    month: '2025年10月 (3)',
    orders: [
      {
        id: 'wo-005',
        type: 'repair',
        status: 'completed',
        deviceName: 'Azurion M3',
        hospital: 'WeConnect医院',
        workOrderNo: 'WO128923700',
        requestTime: '2025.10.22 08:15',
      },
      {
        id: 'wo-006',
        type: 'maintenance',
        status: 'completed',
        deviceName: 'BigBore CT 7500',
        hospital: 'WeConnect医院',
        workOrderNo: 'WO128923701',
        requestTime: '2025.10.18 13:40',
      },
      {
        id: 'wo-007',
        type: 'repair',
        status: 'completed',
        deviceName: 'Affiniti 70',
        hospital: 'WeConnect医院',
        workOrderNo: 'WO128923702',
        requestTime: '2025.10.05 10:00',
      },
    ],
  },
];
