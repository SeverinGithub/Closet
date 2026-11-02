import { useEffect, useRef } from 'react';

const NOTIFIED_KEY = 'closet:notified-date';

function isMorningWindow() {
  const h = new Date().getHours();
  return h >= 6 && h < 12;
}

function alreadyNotifiedToday() {
  return localStorage.getItem(NOTIFIED_KEY) === new Date().toISOString().slice(0, 10);
}

function markNotifiedToday() {
  localStorage.setItem(NOTIFIED_KEY, new Date().toISOString().slice(0, 10));
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return Notification.requestPermission();
}

export function useMorningReminder({ enabled, todayLogged }) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (todayLogged) return;
    if (!isMorningWindow()) return;
    if (alreadyNotifiedToday()) return;
    if (firedRef.current) return;
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    firedRef.current = true;
    markNotifiedToday();

    new Notification('The Closet', {
      body: "What are you wearing today? Log your outfit. ✨",
      icon: '/favicon.svg',
      tag: 'daily-reminder',
      requireInteraction: false,
    });
  }, [enabled, todayLogged]);
}
