const PREFIXED_KEYS = ['weconnect-', 'device-', 'user-device-'];

export const resetDemoData = () => {
  const demoKeys = Object.keys(localStorage).filter((key) =>
    PREFIXED_KEYS.some((prefix) => key.startsWith(prefix))
  );
  demoKeys.forEach((key) => localStorage.removeItem(key));

  window.location.reload();
};
