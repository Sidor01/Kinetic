import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import {
    Bell,
    BookOpen,
    CheckCircle2,
    ChevronLeft,
    Flame,
    Gift,
    RefreshCw,
    Trophy,
    UserPlus,
    Zap,
} from 'lucide-react';
import {
    formatNotificationTime,
    getNotifications,
    markAllNotificationsRead,
    subscribeToNotifications,
} from '../utils/notifications';
import type { AppNotification, NotificationIcon } from '../utils/notifications';

interface AppHeaderProps {
    style?: CSSProperties;
    points?: number;
}

function getStoredPoints() {
    const saved = localStorage.getItem('kinetic_user_points');
    const points = saved ? Number.parseInt(saved, 10) : 1250;
    return Number.isFinite(points) ? points : 1250;
}

function NotificationGlyph({ icon }: { icon: NotificationIcon }) {
    if (icon === 'flame') return <Flame size={22} fill="currentColor" />;
    if (icon === 'trophy') return <Trophy size={21} fill="currentColor" />;
    if (icon === 'zap') return <Zap size={23} />;
    if (icon === 'refresh') return <RefreshCw size={21} />;
    if (icon === 'book') return <BookOpen size={21} />;
    if (icon === 'gift') return <Gift size={21} />;
    if (icon === 'user') return <UserPlus size={21} />;
    return <CheckCircle2 size={22} />;
}

function NotificationRow({
    notification,
    history = false,
    onAction,
}: {
    notification: AppNotification;
    history?: boolean;
    onAction: () => void;
}) {
    const itemClasses = [
        'notification-item',
        notification.tone === 'risk' ? 'notification-risk' : '',
        notification.tone === 'muted' ? 'notification-muted' : '',
        !notification.read ? 'unread' : '',
        history ? 'notification-history-item' : '',
    ].filter(Boolean).join(' ');

    return (
        <article className={itemClasses}>
            <div className={`notification-icon notification-icon-${notification.tone}`}>
                <NotificationGlyph icon={notification.icon} />
            </div>
            <div className="notification-content">
                <div className="notification-title-row">
                    <h3 className={notification.tone === 'success' ? 'notification-title-success' : undefined}>
                        {notification.title}
                    </h3>
                    <time>{formatNotificationTime(notification.createdAt)}</time>
                </div>
                <p>{notification.message}</p>
                {notification.actionLabel && notification.actionPath && (
                    <Link to={notification.actionPath} className="notification-action" onClick={onAction}>
                        {notification.actionLabel}
                    </Link>
                )}
            </div>
        </article>
    );
}

export default function AppHeader({ style, points }: AppHeaderProps) {
    const displayedPoints = points ?? getStoredPoints();
    const notifications = useSyncExternalStore(
        subscribeToNotifications,
        getNotifications,
        getNotifications,
    );
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!notificationsOpen) return;

        const closeOnOutsideClick = (event: MouseEvent) => {
            if (!headerRef.current?.contains(event.target as Node)) {
                setNotificationsOpen(false);
            }
        };

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setNotificationsOpen(false);
        };

        document.addEventListener('mousedown', closeOnOutsideClick);
        document.addEventListener('keydown', closeOnEscape);

        return () => {
            document.removeEventListener('mousedown', closeOnOutsideClick);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [notificationsOpen]);

    const currentNotifications = [...notifications]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 4);
    const hasUnreadNotifications = notifications.some(notification => !notification.read);

    const handleMarkAllRead = () => {
        markAllNotificationsRead();
    };

    return (
        <div ref={headerRef} className="header-top" style={style}>
            <button
                type="button"
                className="notification-trigger"
                aria-label="Open notifications"
                aria-expanded={notificationsOpen}
                onClick={() => {
                    setNotificationsOpen(open => {
                        if (!open) setHistoryOpen(false);
                        return !open;
                    });
                }}
            >
                <Bell size={24} />
                {hasUnreadNotifications && <span className="notification-dot" />}
            </button>

            <Link to="/rewards" className="pts-badge" aria-label="Open rewards">
                <Zap size={16} fill="currentColor" />
                {displayedPoints.toLocaleString()} PTS
            </Link>

            {notificationsOpen && (
                <section className="notifications-panel" aria-label="Notifications">
                    {historyOpen ? (
                        <>
                            <div className="notifications-header notifications-history-header">
                                <button
                                    type="button"
                                    className="notifications-back"
                                    aria-label="Back to notifications"
                                    onClick={() => setHistoryOpen(false)}
                                >
                                    <ChevronLeft size={22} />
                                </button>
                                <h2>Notification history</h2>
                                <span className="notifications-header-spacer" />
                            </div>

                            <div className="notifications-history-list">
                                {notifications.map(notification => (
                                    <NotificationRow
                                        key={notification.id}
                                        notification={notification}
                                        history
                                        onAction={() => setNotificationsOpen(false)}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="notifications-header">
                                <h2>Notifications</h2>
                                <button type="button" onClick={handleMarkAllRead}>
                                    Mark all as read
                                </button>
                            </div>

                            {currentNotifications.map(notification => (
                                <NotificationRow
                                    key={notification.id}
                                    notification={notification}
                                    onAction={() => setNotificationsOpen(false)}
                                />
                            ))}

                            <button type="button" className="notifications-history" onClick={() => setHistoryOpen(true)}>
                                View all history
                            </button>
                        </>
                    )}
                </section>
            )}
        </div>
    );
}
