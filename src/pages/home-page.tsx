import type { Device } from '../types/device';
import { SuperUserServicePage } from './super-user-service-page';

interface HomePageProps {
  onDevicePress?: (device: Device) => void;
  onRepairDetailPress?: (repairId: string) => void;
  onServiceEvalPress?: (repairId: string) => void;
}

export const HomePage = ({ onDevicePress, onRepairDetailPress, onServiceEvalPress }: HomePageProps) => (
  <SuperUserServicePage
    title="我的报修"
    subtitle="我的记录"
    onDevicePress={onDevicePress}
    onRepairDetailPress={onRepairDetailPress}
    onServiceEvalPress={onServiceEvalPress}
  />
);
