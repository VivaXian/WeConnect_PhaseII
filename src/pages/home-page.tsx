import { RepairRecordPanel } from '../components/repair-record-panel';
import type { Device } from '../types/device';
import { homePageStyles } from './home-page.css';

interface HomePageProps {
  onDevicePress?: (device: Device) => void;
  onRepairDetailPress?: (repairId: string) => void;
  onServiceEvalPress?: (repairId: string) => void;
}

export const HomePage = ({ onDevicePress, onRepairDetailPress, onServiceEvalPress }: HomePageProps) => {
  return (
    <div className={homePageStyles.page}>
      <div className={homePageStyles.topBar}>
        <div className={homePageStyles.topBarTitle}>我的报修</div>
        <div className={homePageStyles.topBarSub}>WeConnect医院</div>
      </div>
      <RepairRecordPanel onDevicePress={onDevicePress} onRepairDetailPress={onRepairDetailPress} onServiceEvalPress={onServiceEvalPress} showScanEntry />
    </div>
  );
};
