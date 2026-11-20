import { useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';

import { localToday, msUntilMidnight, type ISODate } from './dates';

/**
 * Today's local date. Updated at midnight, and also whenever the app comes
 * back and once a minute, because timers stall while a laptop sleeps or a
 * background tab is frozen. Anything saved should still call localToday() at
 * the moment it saves.
 */
export function useToday(): ISODate {
  const [today, setToday] = useState(localToday);

  useEffect(() => {
    const refresh = () => setToday(localToday());
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        refresh();
        schedule();
      }, msUntilMidnight() + 1000);
    };
    schedule();
    const interval = setInterval(refresh, 60_000);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    const web = Platform.OS === 'web' && typeof window !== 'undefined';
    if (web) {
      window.addEventListener('focus', refresh);
      window.addEventListener('pageshow', refresh);
    }
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      sub.remove();
      if (web) {
        window.removeEventListener('focus', refresh);
        window.removeEventListener('pageshow', refresh);
      }
    };
  }, []);

  return today;
}
