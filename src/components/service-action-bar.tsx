import { Button } from '@filament/react/button';
import { actionBarStyles as s } from './service-action-bar.css';

interface ServiceActionBarProps {
  onStartInquiry: () => void;
}

export const ServiceActionBar = ({ onStartInquiry }: ServiceActionBarProps) => (
  <div className={s.bar}>
    <Button variant="primary" isFullWidth onPress={onStartInquiry}>
      联系客户响应中心
    </Button>
  </div>
);
