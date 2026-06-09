export type NotificationTone = 'risk' | 'success' | 'info' | 'muted';
export type NotificationIcon = 'flame' | 'trophy' | 'zap' | 'refresh' | 'check' | 'book' | 'gift' | 'user';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
  tone: NotificationTone;
  icon: NotificationIcon;
  actionLabel?: string;
  actionPath?: string;
}

type NewNotification = Omit<AppNotification, 'id' | 'createdAt' | 'read'>;

const STORAGE_KEY = 'kinetic_notifications';
const CHANGE_EVENT = 'kinetic:notifications-changed';
const MAX_NOTIFICATIONS = 50;
let cachedValue: string | null = null;
let cachedNotifications: AppNotification[] = [];

function createSeedNotifications(now: number): AppNotification[] {
  return [
    {
      id: 'seed-streak-risk',
      title: 'Streak at Risk',
      message: "Your 'Deep Work' ritual is about to break. Keep the 12-day momentum alive.",
      createdAt: now - 2 * 60 * 1000,
      read: false,
      tone: 'risk',
      icon: 'flame',
      actionLabel: 'Log Ritual',
      actionPath: '/habits',
    },
    {
      id: 'seed-new-milestone',
      title: 'New Milestone',
      message: "Incredible consistency. You've reached Level 43 in Focus.",
      createdAt: now - 2 * 60 * 60 * 1000,
      read: false,
      tone: 'success',
      icon: 'trophy',
    },
    {
      id: 'seed-friend-nudge',
      title: 'Friend Nudge',
      message: 'Elena R. sent you momentum for completing your morning run.',
      createdAt: now - 24 * 60 * 60 * 1000,
      read: false,
      tone: 'info',
      icon: 'zap',
    },
    {
      id: 'seed-weekly-report',
      title: 'Weekly Report Ready',
      message: 'Your weekly Kinetic bloom analysis is ready to view.',
      createdAt: now - 3 * 24 * 60 * 60 * 1000,
      read: true,
      tone: 'muted',
      icon: 'refresh',
    },
    {
      id: 'seed-morning-run',
      title: 'Morning Run Completed',
      message: 'You completed your 5 km morning run and earned 100 PTS.',
      createdAt: now - 4 * 24 * 60 * 60 * 1000,
      read: true,
      tone: 'success',
      icon: 'check',
    },
    {
      id: 'seed-reading-streak',
      title: 'Reading Streak',
      message: 'Seven days of reading in a row. Your learning momentum is growing.',
      createdAt: now - 5 * 24 * 60 * 60 * 1000,
      read: true,
      tone: 'info',
      icon: 'book',
    },
  ];
}

function isNotification(value: unknown): value is AppNotification {
  if (!value || typeof value !== 'object') return false;
  const notification = value as Partial<AppNotification>;
  return (
    typeof notification.id === 'string' &&
    typeof notification.title === 'string' &&
    typeof notification.message === 'string' &&
    typeof notification.createdAt === 'number' &&
    typeof notification.read === 'boolean' &&
    typeof notification.tone === 'string' &&
    typeof notification.icon === 'string'
  );
}

function sortNewestFirst(notifications: AppNotification[]) {
  return [...notifications].sort((a, b) => b.createdAt - a.createdAt);
}

function migrateNotification(notification: AppNotification): AppNotification {
  if (
    notification.title === 'Reward Claimed' &&
    notification.actionLabel === 'View Reward' &&
    notification.actionPath === '/rewards'
  ) {
    return { ...notification, actionPath: '/rewards?reward=latest' };
  }

  return notification;
}

function saveNotifications(notifications: AppNotification[]) {
  const nextNotifications = sortNewestFirst(notifications).slice(0, MAX_NOTIFICATIONS);
  const serialized = JSON.stringify(nextNotifications);
  localStorage.setItem(STORAGE_KEY, serialized);
  cachedValue = serialized;
  cachedNotifications = nextNotifications;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getNotifications(): AppNotification[] {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved !== null && saved === cachedValue) return cachedNotifications;

  if (saved) {
    try {
      const parsed: unknown = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        cachedNotifications = sortNewestFirst(parsed.filter(isNotification).map(migrateNotification));
        const normalized = JSON.stringify(cachedNotifications);
        cachedValue = normalized;
        if (normalized !== saved) localStorage.setItem(STORAGE_KEY, normalized);
        return cachedNotifications;
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  const seeded = createSeedNotifications(Date.now());
  cachedValue = JSON.stringify(seeded);
  cachedNotifications = seeded;
  localStorage.setItem(STORAGE_KEY, cachedValue);
  return seeded;
}

export function createNotification(notification: NewNotification) {
  const id = typeof globalThis.crypto?.randomUUID === 'function'
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const next: AppNotification = {
    ...notification,
    id,
    createdAt: Date.now(),
    read: false,
  };

  saveNotifications([next, ...getNotifications()]);
}

export function markAllNotificationsRead() {
  saveNotifications(getNotifications().map(notification => ({ ...notification, read: true })));
}

export function subscribeToNotifications(listener: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };

  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener('storage', handleStorage);
  };
}

export function formatNotificationTime(createdAt: number) {
  const elapsed = Math.max(0, Date.now() - createdAt);
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}
