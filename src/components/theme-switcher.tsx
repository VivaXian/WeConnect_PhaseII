import { icon as iconStyle } from '@filament/react/atomic-styles';
import { Button } from '@filament/react/button';
import { Moon } from '@filament/react/icons/moon';
import { Sun } from '@filament/react/icons/sun';
import { animated, easings, useTransition } from '@react-spring/web';
import { useTheme } from '../contexts/theme-context';

export const ThemeSwitcher = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button onPress={toggleTheme} shape="square" isIconOnly>
      <SunMoonIcon icon={isDarkMode ? 'moon' : 'sun'} />
    </Button>
  );
};

const SunMoonIcon = ({ icon }: { icon: 'sun' | 'moon' }) => {
  const transitions = useTransition(icon, {
    from: { opacity: 0, transform: 'rotate(-180deg)' },
    enter: { opacity: 1, transform: 'rotate(0deg)', position: 'unset' },
    leave: { opacity: 0, transform: 'rotate(180deg)', position: 'absolute' },
    initial: null,
    config: {
      duration: 500,
      easing: easings.easeInOutCubic,
    },
  });

  return transitions((style, item) => (
    <animated.div style={style} className={iconStyle}>
      {item === 'sun' ? <Sun /> : <Moon />}
    </animated.div>
  ));
};
