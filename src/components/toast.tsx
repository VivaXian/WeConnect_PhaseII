import { animated, useTransition } from '@react-spring/web';
import { useShallow } from 'zustand/react/shallow';
import { useToastStore } from '../stores/toast-store';
import { toastStyles } from './toast.css';

export const Toast = () => {
  const { current, dismiss } = useToastStore(
    useShallow((s) => ({ current: s.current, dismiss: s.dismiss }))
  );

  const transitions = useTransition(current, {
    keys: (item) => item?.id ?? 'none',
    from: { opacity: 0, transform: 'translateY(12px)' },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: { opacity: 0, transform: 'translateY(12px)' },
    config: { tension: 320, friction: 28 },
  });

  return transitions((springStyle, item) =>
    item ? (
      <div className={toastStyles.wrap}>
        <animated.div style={springStyle} className={toastStyles.toast}>
          <span className={toastStyles.message}>{item.message}</span>
          {item.actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={toastStyles.actionBtn}
              onClick={() => {
                action.onAction();
                dismiss();
              }}
            >
              {action.label}
            </button>
          ))}
        </animated.div>
      </div>
    ) : null
  );
};
