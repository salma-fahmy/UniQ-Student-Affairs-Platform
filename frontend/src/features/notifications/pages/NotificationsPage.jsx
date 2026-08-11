import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiTrash2, FiCheck, FiCheckCircle,
  FiArrowLeft, FiInbox,
} from 'react-icons/fi';
import { useNotifications } from '../NotificationContext';

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatTime = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
};

const getDateGroup = (iso) => {
  if (!iso) return 'Earlier';
  const date = new Date(iso);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);
  if (date >= todayStart) return 'Today';
  if (date >= yesterdayStart) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const typeConfig = {
  system:         { bg: 'bg-slate-100',   text: 'text-slate-600',  icon: '⚙️' },
  course_update:  { bg: 'bg-sky-50',      text: 'text-sky-700',    icon: '📚' },
  complaint:      { bg: 'bg-amber-50',    text: 'text-amber-700',  icon: '📋' },
  request_update: { bg: 'bg-indigo-50',   text: 'text-indigo-700', icon: '📄' },
  announcement:   { bg: 'bg-emerald-50',  text: 'text-emerald-700',icon: '📢' },
};

const getTypeConfig = (type) =>
  typeConfig[type] ?? { bg: 'bg-slate-100', text: 'text-slate-600', icon: '🔔' };

// ─── Delete Confirm Modal ────────────────────────────────────────────────────

const DeleteConfirmModal = ({ onConfirm, onCancel, deleting }) => (
  <div style={{ position:'fixed', inset:0, zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
    <div
      style={{ position:'absolute', inset:0, background:'rgba(15,23,42,0.3)', backdropFilter:'blur(2px)' }}
      onClick={!deleting ? onCancel : undefined}
    />
    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col gap-5 z-10">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
          <FiTrash2 size={24} className="text-rose-500 stroke-[2px]" />
        </div>
        <h2 className="font-['Manrope'] text-[18px] font-bold text-indigo-950">Delete All Notifications?</h2>
        <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
          This will permanently remove all your notifications. This cannot be undone.
        </p>
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} disabled={deleting}
          className="flex-1 py-2.5 rounded-full border border-slate-200 text-[14px] font-semibold
                     text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          Cancel
        </button>
        <button type="button" onClick={onConfirm} disabled={deleting}
          className="flex-1 py-2.5 rounded-full bg-rose-500 text-white text-[14px] font-semibold
                     hover:bg-rose-600 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2">
          {deleting
            ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Deleting…</>
            : <><FiTrash2 size={14} />Delete All</>}
        </button>
      </div>
    </div>
  </div>
);

// ─── Notification Card ───────────────────────────────────────────────────────

const NotificationCard = ({ notification, onMarkRead, marking }) => {
  const { bg, text, icon } = getTypeConfig(notification.notification_type);
  const isUnread = !notification.is_read;
  const isMarking = marking === notification.notification_id;

  return (
    <div className={`group relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200
      ${isUnread
        ? 'bg-white border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-200'
        : 'bg-slate-50/60 border-slate-100 hover:bg-slate-50'}`}
    >
      {/* Unread dot */}
      {isUnread && (
        <span className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white shrink-0" />
      )}

      {/* Icon */}
      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-[18px] ${bg}`}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-6">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`text-[14px] font-bold ${isUnread ? 'text-indigo-950' : 'text-slate-500'}`}>
            {notification.title}
          </p>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${bg} ${text}`}>
            {notification.notification_type.replace('_', ' ')}
          </span>
        </div>
        <p className={`text-[13px] font-medium mt-1 leading-relaxed
          ${isUnread ? 'text-slate-600' : 'text-slate-400'}`}>
          {notification.message}
        </p>
        <p className="text-[11px] font-semibold text-slate-400 mt-2">
          {formatTime(notification.created_at)}
        </p>
      </div>

      {/* Mark as read — appears on hover for unread */}
      {isUnread && (
        <button
          type="button"
          onClick={() => onMarkRead(notification.notification_id)}
          disabled={isMarking}
          title="Mark as read"
          className="absolute bottom-4 right-4 flex items-center justify-center w-7 h-7
                     rounded-full border border-slate-200 bg-white text-slate-400
                     hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50
                     transition-all duration-200 disabled:opacity-50
                     opacity-0 group-hover:opacity-100"
        >
          {isMarking
            ? <div className="w-3 h-3 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
            : <FiCheck size={13} className="stroke-[2.5px]" />}
        </button>
      )}

      {/* Read checkmark */}
      {!isUnread && (
        <FiCheckCircle size={16} className="absolute bottom-4 right-4 text-slate-300 shrink-0" />
      )}
    </div>
  );
};

// ─── Date group header ────────────────────────────────────────────────────────

const DateGroupHeader = ({ label }) => (
  <div className="flex items-center gap-3 py-1">
    <div className="flex-1 h-px bg-slate-200" />
    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
      {label}
    </span>
    <div className="flex-1 h-px bg-slate-200" />
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, error, markRead, markAllRead, deleteAll } = useNotifications();

  const [marking, setMarking]                     = useState(null);
  const [markingAll, setMarkingAll]               = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting]                   = useState(false);

  // Group by date
  const grouped = useMemo(() => {
    const groups = {};
    notifications.forEach((n) => {
      const label = getDateGroup(n.created_at);
      if (!groups[label]) groups[label] = [];
      groups[label].push(n);
    });
    const order = (l) => l === 'Today' ? 0 : l === 'Yesterday' ? 1 : 2;
    return Object.entries(groups).sort((a, b) => order(a[0]) - order(b[0]));
  }, [notifications]);

  const handleMarkRead = async (id) => {
    setMarking(id);
    await markRead(id);   // context handles optimistic update + API call
    setMarking(null);
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    await markAllRead();
    setMarkingAll(false);
  };

  const handleDeleteAll = async () => {
    setDeleting(true);
    try {
      await deleteAll();
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-slate-50 md:bg-slate-50 md:shadow-sm md:rounded-[32px] md:border border-slate-200
                    p-4 md:p-8 min-h-full flex flex-col pt-6 md:pt-8">

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center justify-center w-10 h-10 rounded-full bg-white
                         text-slate-500 shadow-sm border border-slate-200
                         hover:bg-slate-100 hover:text-indigo-900 transition-all duration-300 shrink-0"
            >
              <FiArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-['Manrope'] text-2xl md:text-[32px] font-bold text-indigo-950 tracking-tight leading-tight">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2
                                   rounded-full bg-rose-500 text-white text-[11px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className="text-slate-500 mt-0.5 text-[14px] font-medium">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : 'All caught up!'}
              </p>
            </div>
          </div>

          {notifications.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {unreadCount > 0 && (
                <button type="button" onClick={handleMarkAllRead} disabled={markingAll}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200
                             bg-white text-[13px] font-semibold text-slate-600
                             hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700
                             transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {markingAll
                    ? <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
                    : <FiCheck size={14} className="stroke-[2.5px]" />}
                  Mark all as read
                </button>
              )}
              <button type="button" onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200
                           bg-white text-[13px] font-semibold text-slate-600
                           hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-all">
                <FiTrash2 size={14} className="stroke-[2px]" />
                Delete all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <span className="text-[13px] font-semibold text-slate-400">Loading notifications…</span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-6 rounded-xl font-bold text-center">
          {error}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
            <FiInbox size={36} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-semibold text-lg">No notifications</p>
          <p className="text-slate-400 text-sm">You're all caught up!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(([label, items]) => (
            <div key={label} className="flex flex-col gap-3">
              <DateGroupHeader label={label} />
              {items.map((n) => (
                <NotificationCard
                  key={n.notification_id}
                  notification={n}
                  onMarkRead={handleMarkRead}
                  marking={marking}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          onConfirm={handleDeleteAll}
          onCancel={() => setShowDeleteConfirm(false)}
          deleting={deleting}
        />
      )}
    </div>
  );
};

export default NotificationsPage;