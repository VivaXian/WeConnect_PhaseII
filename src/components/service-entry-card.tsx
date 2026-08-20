import { Button } from '@filament/react/button';
import { Card } from '@filament/react/card';
import { PersonHeadset } from '@filament/react/icons/person-headset';
import { Text } from '@filament/react/text';
import { serviceEntryStyles as s } from './service-entry-card.css';

interface ServiceEntryCardProps {
  title: string;
  description: string;
  actionLabel?: string;
  onPress: () => void;
}

export const ServiceEntryCard = ({
  title,
  description,
  actionLabel = '在线咨询',
  onPress,
}: ServiceEntryCardProps) => (
  <Card className={s.card}>
    <div className={s.body}>
      <div className={s.icon}>
        <PersonHeadset aria-hidden="true" />
      </div>
      <div className={s.text}>
        <Text variant="body-m" weight="bold">{title}</Text>
        <Text variant="body-s" color="secondary">{description}</Text>
      </div>
    </div>
    <div className={s.actions}>
      <Button variant="primary" onPress={onPress}>{actionLabel}</Button>
    </div>
  </Card>
);
