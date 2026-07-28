import React, { useEffect, useState } from 'react';
import { notificationAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Bell, CheckCircle2, Clock, CheckCheck, AlertCircle } from 'lucide-react';

export function NotificationsPage() {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    notificationAPI.getNotifications()
      .then((res) => setNotifications(res.notifications || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationAPI.markRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      addToast('All notifications marked as read.', 'success');
      fetchNotifications();
    } catch (err) {
      addToast('Failed to mark notifications as read.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Bell className="w-4 h-4" />
              <span>Activity & Alerts</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Notification Center</h1>
          </div>

          {notifications.some(n => n.isRead === 0) && (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center space-x-1.5"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="bg-slate-900/60 p-12 rounded-3xl border border-slate-800 text-center space-y-3">
            <Bell className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-sm">No notifications yet. Activity updates will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => item.isRead === 0 && handleMarkRead(item.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  item.isRead === 0
                    ? 'bg-slate-900 border-emerald-500/40 shadow-lg shadow-emerald-950/20 cursor-pointer'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    item.type === 'reservation' ? 'bg-sky-500/10 text-sky-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-sm ${item.isRead === 0 ? 'font-semibold text-white' : 'text-slate-300'}`}>
                      {item.message}
                    </p>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {item.isRead === 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 mt-1.5 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
