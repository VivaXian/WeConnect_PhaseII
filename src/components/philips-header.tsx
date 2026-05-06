import { PhilipsLogo } from '@filament/react/icons/philips-logo';
import { headerStyles } from './philips-header.css';

export const PhilipsHeader = () => (
  <div className={headerStyles.header}>
    <div className={headerStyles.logoContainer}>
      <PhilipsLogo
        aria-label="Philips"
        width={120}
        height={32}
        className={headerStyles.logoIcon}
      />
    </div>
  </div>
);
