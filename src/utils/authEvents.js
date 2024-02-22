// src/utils/authEvents.js
export const emitLogoutEvent = () => {
  const event = new CustomEvent('logout');
  window.dispatchEvent(event);
};
