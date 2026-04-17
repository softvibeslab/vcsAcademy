import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell, BookOpen, CheckCircle, Clock, AlertCircle,
  Award, Target, TrendingUp, X, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationCenter = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchNotifications();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/ai-assistant/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unread_count);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`/api/ai-assistant/notifications/${notificationId}/mark-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.notification_id === notificationId
            ? { ...notif, read_at: new Date().toISOString() }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAsActed = async (notificationId) => {
    try {
      await fetch(`/api/ai-assistant/notifications/${notificationId}/mark-acted`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.notification_id === notificationId
            ? { ...notif, acted_on: true, read_at: new Date().toISOString() }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as acted:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_training':
        return <BookOpen className="w-5 h-5 text-[#D4AF37]" />;
      case 'new_resource':
        return <Target className="w-5 h-5 text-blue-400" />;
      case 'update':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      default:
        return <Bell className="w-5 h-5 text-[#94A3B8]" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30';
      case 'normal': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'urgent': return 'Urgente';
      case 'high': return 'Alta';
      case 'normal': return 'Normal';
      default: return priority;
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours}h`;
    return new Date(date).toLocaleDateString('es-ES');
  };

  const displayedNotifications = showAll
    ? notifications
    : notifications.slice(0, 5);

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setShowAll(!showAll)}
        className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-[#D4AF37]' : 'text-[#94A3B8]'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] text-black text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {showAll && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAll(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-12 w-[420px] bg-[#0F172A] border border-white/10 rounded-lg shadow-2xl z-50"
            >
              <Card className="bg-transparent border-none">
                <CardHeader className="border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#F1F5F9] flex items-center gap-2">
                      <Bell className="w-5 h-5 text-[#D4AF37]" />
                      Notificaciones
                      {unreadCount > 0 && (
                        <Badge className="bg-[#D4AF37]/20 text-[#D4AF37]">
                          {unreadCount} nuevas
                        </Badge>
                      )}
                    </CardTitle>
                    <Button
                      onClick={() => setShowAll(false)}
                      variant="ghost"
                      size="sm"
                      className="text-[#94A3B8] hover:text-[#F1F5F9]"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    {displayedNotifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-[#94A3B8]">
                        <Bell className="w-12 h-12 mb-4 opacity-50" />
                        <p>No tienes notificaciones</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {displayedNotifications.map((notif) => (
                          <motion.div
                            key={notif.notification_id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-4 hover:bg-white/5 transition-colors ${
                              !notif.read_at ? 'bg-[#D4AF37]/5' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Icon */}
                              <div className="mt-1">
                                {getNotificationIcon(notif.content_type)}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                  <h4 className="font-semibold text-[#F1F5F9] text-sm">
                                    {notif.title}
                                  </h4>
                                  {!notif.read_at && (
                                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full flex-shrink-0" />
                                  )}
                                </div>

                                <p className="text-xs text-[#94A3B8] mb-2 line-clamp-2">
                                  {notif.message}
                                </p>

                                <div className="flex items-center gap-2 mb-3">
                                  <Badge className={`text-xs ${getPriorityColor(notif.priority)}`}>
                                    {getPriorityLabel(notif.priority)}
                                  </Badge>

                                  <div className="flex items-center gap-1 text-xs text-[#64748B]">
                                    <Clock className="w-3 h-3" />
                                    {formatTimestamp(notif.created_at)}
                                  </div>

                                  {notif.action_required && (
                                    <div className="flex items-center gap-1 text-xs text-[#D4AF37]">
                                      <AlertCircle className="w-3 h-3" />
                                      Requiere acción
                                    </div>
                                  )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                  {notif.related_item_id && (
                                    <Button
                                      size="sm"
                                      onClick={() => markAsActed(notif.notification_id)}
                                      className="bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30 text-xs"
                                    >
                                      <Target className="w-3 h-3 mr-1" />
                                      Ver Material
                                    </Button>
                                  )}

                                  {!notif.read_at && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => markAsRead(notif.notification_id)}
                                      className="border-white/10 text-[#94A3B8] hover:text-[#F1F5F9] text-xs"
                                    >
                                      <Check className="w-3 h-3 mr-1" />
                                      Marcar leído
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>

                {/* Footer */}
                {notifications.length > 5 && (
                  <div className="p-4 border-t border-white/10">
                    <Button
                      onClick={() => {
                        // Navigate to full notifications page
                        window.location.href = '/notifications';
                      }}
                      variant="outline"
                      className="w-full border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                    >
                      Ver todas las notificaciones ({notifications.length})
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
