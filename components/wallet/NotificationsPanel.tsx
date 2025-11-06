'use client';

import React from 'react';
import { Bell, X } from 'lucide-react';
import { BottomSheet, BottomSheetContent, BottomSheetHeader, BottomSheetTitle } from '@/components/ui/bottom-sheet';
import { MOCK_NOTIFICATIONS, MockNotification } from '@/data/mock-wallet-data';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  return (
    <BottomSheet open={isOpen} onOpenChange={onClose}>
      <BottomSheetContent className="max-h-[80vh]">
        <BottomSheetHeader>
          <div className="flex items-center justify-between">
            <BottomSheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </BottomSheetTitle>
          </div>
        </BottomSheetHeader>
        
        <div className="px-6 pb-6">
          {MOCK_NOTIFICATIONS.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notifications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {MOCK_NOTIFICATIONS.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.read
                      ? 'bg-white border-gray-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 bg-amber-500 rounded-full mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
}

