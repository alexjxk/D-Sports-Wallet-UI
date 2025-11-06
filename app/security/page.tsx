'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Smartphone, AlertTriangle, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SecurityCenter() {
  const router = useRouter();
  const [recoveryPhraseBackedUp, setRecoveryPhraseBackedUp] = useState(false);
  const [recoveryEmailAdded, setRecoveryEmailAdded] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  // TODO: Fetch from API
  const recentSessions = [
    {
      id: '1',
      deviceName: 'Chrome on Windows',
      location: 'Toronto, Canada',
      lastActive: '2 hours ago',
      isCurrent: true,
    },
    {
      id: '2',
      deviceName: 'Safari on iPhone',
      location: 'Toronto, Canada',
      lastActive: '1 day ago',
      isCurrent: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Security & Backup</h1>
            <p className="text-sm text-gray-600">Manage your wallet security and backup options</p>
          </div>
        </div>

        {/* Backup Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Backup Status
            </CardTitle>
            <CardDescription>
              Ensure your wallet is properly backed up
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                {recoveryPhraseBackedUp ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <X className="h-5 w-5 text-red-600" />
                )}
                <div>
                  <div className="font-medium text-gray-900">Recovery phrase backed up</div>
                  <div className="text-sm text-gray-600">
                    {recoveryPhraseBackedUp
                      ? 'Your recovery phrase is securely stored'
                      : 'Back up your recovery phrase to secure your wallet'}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRecoveryPhraseBackedUp(!recoveryPhraseBackedUp)}
              >
                {recoveryPhraseBackedUp ? 'View' : 'Backup'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                {recoveryEmailAdded ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <X className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <div className="font-medium text-gray-900">Recovery email added</div>
                  <div className="text-sm text-gray-600">Optional: Add email for account recovery</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRecoveryEmailAdded(!recoveryEmailAdded)}
              >
                {recoveryEmailAdded ? 'Edit' : 'Add'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                {twoFAEnabled ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <X className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <div className="font-medium text-gray-900">2FA enabled</div>
                  <div className="text-sm text-gray-600">Two-factor authentication for extra security</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTwoFAEnabled(!twoFAEnabled)}
              >
                {twoFAEnabled ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Devices & Sessions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Devices & Sessions
            </CardTitle>
            <CardDescription>
              Manage devices that have access to your wallet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      {session.deviceName}
                      {session.isCurrent && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">{session.location}</div>
                    <div className="text-xs text-gray-500">Last active: {session.lastActive}</div>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full">
              Log out of other devices
            </Button>
          </CardContent>
        </Card>

        {/* Security Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Security Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span className="text-gray-700">
                  <strong>Never share your seed phrase</strong> with anyone. D-Sports will never ask for it.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span className="text-gray-700">
                  <strong>Beware of DMs and phishing</strong> - Official D-Sports support will never contact you via DM.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span className="text-gray-700">
                  <strong>Verify URLs</strong> - Always check you're on the official D-Sports website.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 mt-1">•</span>
                <span className="text-gray-700">
                  <strong>Keep your recovery phrase offline</strong> - Store it in a secure physical location.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

