import { Platform } from 'react-native';

export type MemoryDraft = {
  title: string;
  body: string;
  requireAnswer: boolean;
  answer: string;
  alternatives: string;
};

/**
 * Unsaved card text, so closing the form by accident (browser back, an edge
 * swipe, Android's back gesture) doesn't throw it away. On the web it lives in
 * sessionStorage, so it also survives a reload but not closing the tab.
 * Cleared on sign-out so the next person on a shared computer can't see it.
 */
const PREFIX = 'recallmate:draft:';
const inMemory = new Map<string, string>();

type Store = { get(key: string): string | null; set(key: string, value: string): void; keys(): string[]; remove(key: string): void };

function store(): Store {
  if (Platform.OS === 'web') {
    try {
      const session = window.sessionStorage;
      return {
        get: (key) => session.getItem(key),
        set: (key, value) => session.setItem(key, value),
        keys: () => Array.from({ length: session.length }, (_, i) => session.key(i) ?? ''),
        remove: (key) => session.removeItem(key),
      };
    } catch {
      // Storage blocked (some private modes): fall back to memory.
    }
  }
  return {
    get: (key) => inMemory.get(key) ?? null,
    set: (key, value) => void inMemory.set(key, value),
    keys: () => [...inMemory.keys()],
    remove: (key) => void inMemory.delete(key),
  };
}

export function loadDraft(key: string): MemoryDraft | null {
  try {
    const raw = store().get(PREFIX + key);
    return raw ? (JSON.parse(raw) as MemoryDraft) : null;
  } catch {
    return null;
  }
}

export function saveDraft(key: string, draft: MemoryDraft) {
  try {
    store().set(PREFIX + key, JSON.stringify(draft));
  } catch {
    // Out of space or blocked: the draft just isn't kept.
  }
}

export function clearDraft(key: string) {
  try {
    store().remove(PREFIX + key);
  } catch {
    // Nothing to clear.
  }
}

export function clearAllDrafts() {
  try {
    const s = store();
    for (const key of s.keys()) if (key.startsWith(PREFIX)) s.remove(key);
  } catch {
    // Nothing to clear.
  }
}
