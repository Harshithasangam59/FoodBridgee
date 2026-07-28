import React, { useState, useEffect } from 'react';
import { Bell, Check, Sparkles, MessageSquare, ThumbsUp, Star, CheckCheck } from 'lucide-react';
import { notificationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const NotificationDropdown = ({ onSelectQuestion }) => {
  const { isAuthenticated } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let interval;
    const fetchNotifs = async () => {
      if (isAuthenticated) {
        try {
          const res = await notificationAPI.getNotifications();
          if (res.success) {
            setNotifications(res.notifications);
            setUnreadCount(res.unreadCount);
          }
        } catch (err) {
          // Silent catch
        }
      }
    };

    fetchNotifs();
    if (isAuthenticated) {
      interval = setInterval(fetchNotifs, 8000); // Poll notifications every 8s
    }

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemClick = async (notif) => {
    if (!notif.is_read) {
      try {
        await notificationAPI.markRead(notif.id);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {}
    }
    setIsOpen(false);
    if (notif.question_id) {
      onSelectQuestion(notif.question_id);
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'best_answer':
        return <Star className="w-4 h-4 text-amber-500 fill-amber-500" />;
      case 'upvote':
        return <ThumbsUp className="w-4 h-4 text-brand-500 fill-brand-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-indigo-500" />;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full transition-all duration-300 bg-slate-200/70 hover:bg-slate-300/80 dark:bg-slate-800/70 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 focus:outline-none shadow-sm hover:scale-105"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 py-2 rounded-2xl glass-card shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          
          <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Notifications</h4>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleItemClick(n)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                    n.is_read ? 'hover:bg-slate-100/50 dark:hover:bg-slate-800/40 opacity-75' : 'bg-brand-50/50 dark:bg-brand-950/40 hover:bg-brand-100/50'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                    {getNotifIcon(n.type)}
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                No notifications right now.
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
