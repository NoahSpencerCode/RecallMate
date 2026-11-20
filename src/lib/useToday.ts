import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { localToday, msUntilMidnight, type ISODate } from './dates';

/** Today's local date, updated at midnight and when the app returns to the foreground. */
export function useToday(): ISODate {
  const [today, setToday] = useState(localToday);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setToday(localToday());
        schedule();
      }, msUntilMidnight());
    };
    schedule();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') setToday(localToday());
    });
    return () => {
      clearTimeout(timer);
      sub.remove();
    };
  }, []);

  return today;
}
