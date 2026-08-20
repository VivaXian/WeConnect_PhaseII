const PERSISTED_KEYS = [
  'weconnect-conversations',
  'device-binding',
  'device-list-filter',
  'user-device-filter',
  'device-migration',
  'weconnect-scan-history',
];

const PREFIXED_KEYS = ['weconnect-', 'device-', 'user-device-'];

export const resetDemoData = () => {
  PERSISTED_KEYS.forEach((key) => localStorage.removeItem(key));

  Object.keys(localStorage)
    .filter((key) => PREFIXED_KEYS.some((prefix) => key.startsWith(prefix)))
    .forEach((key) => localStorage.removeItem(key));

  window.location.reload();
};
