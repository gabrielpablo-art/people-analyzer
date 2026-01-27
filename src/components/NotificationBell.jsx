import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBell = ({ count, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
        >
            <Bell size={20} className="text-gray-600" />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-green text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {count > 9 ? '9+' : count}
                </span>
            )}
        </button>
    );
};

const NotificationItem = ({ notification, onRead, onClose }) => {
    const getIcon = () => {
        switch (notification.type) {
            case 'evaluation_pending':
                return <AlertCircle className="text-amber-500" size={20} />;
            case 'feedback_received':
                return <CheckCircle className="text-brand-green" size={20} />;
            case 'team_update':
                return <TrendingUp className="text-brand-blue" size={20} />;
            default:
                return <Info className="text-gray-500" size={20} />;
        }
    };

    const handleClick = () => {
        if (!notification.read) {
            onRead(notification.id);
        }
        if (notification.link) {
            window.location.href = notification.link;
        }
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50/50' : ''
                }`}
            onClick={handleClick}
        >
            <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">{getIcon()}</div>
                <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                        {notification.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.createdAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                </div>
                {!notification.read && (
                    <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-brand-blue rounded-full" />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export const NotificationPanel = ({ isOpen, onClose, notifications, onMarkAsRead, onMarkAllAsRead }) => {
    const unreadCount = notifications.filter((n) => !n.read).length;

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={onClose} />

            {/* Panel */}
            <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-[600px] flex flex-col"
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <p className="text-xs text-gray-500 mt-1">{unreadCount} unread</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={onMarkAllAsRead}
                                className="text-xs text-brand-blue hover:text-brand-blue/80 font-semibold"
                            >
                                Mark all as read
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <X size={18} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <Bell size={48} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">No notifications yet</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onRead={onMarkAsRead}
                                    onClose={onClose}
                                />
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default NotificationBell;
