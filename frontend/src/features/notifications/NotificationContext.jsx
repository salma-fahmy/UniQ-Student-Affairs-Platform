import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import useAuth from '../auth/useAuth';
import {
  fetchNotifications,
  markNotificationRead,
  deleteAllNotifications,
} from './notificationService';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { accessToken, isAuthReady } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications(accessToken);
      setNotifications(data);
    } catch {
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!isAuthReady || !accessToken) return;
    load();
  }, [isAuthReady, accessToken, load]);

  // ── Mark one as read ───────────────────────────────────────────────────
  const markRead = useCallback(async (id) => {
    // Optimistic update — UI responds instantly
    setNotifications((prev) =>
      prev.map((n) => n.notification_id === id ? { ...n, is_read: true } : n),
    );
    try {
      await markNotificationRead(accessToken, id);
    } catch {
      // Revert on failure
      setNotifications((prev) =>
        prev.map((n) => n.notification_id === id ? { ...n, is_read: false } : n),
      );
    }
  }, [accessToken]);

  // ── Mark all as read ───────────────────────────────────────────────────
  const markAllRead = useCallback(async () => {
    const unread = notifications.filter((n) => !n.is_read);
    if (!unread.length) return;

    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

    try {
      await Promise.all(
        unread.map((n) => markNotificationRead(accessToken, n.notification_id)),
      );
    } catch {
      // Refetch to sync correct state on partial failure
      load();
    }
  }, [accessToken, notifications, load]);

  // ── Delete all ─────────────────────────────────────────────────────────
  const deleteAll = useCallback(async () => {
    try {
      await deleteAllNotifications(accessToken);
      setNotifications([]);
    } catch {
      throw new Error('Failed to delete notifications.');
    }
  }, [accessToken]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        markRead,
        markAllRead,
        deleteAll,
        refresh: load,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within a NotificationProvider');
  return ctx;
};