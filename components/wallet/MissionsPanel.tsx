'use client';

import React from 'react';
import { TrendingUp, Trophy, CheckCircle2 } from 'lucide-react';
import { BottomSheet, BottomSheetContent, BottomSheetHeader, BottomSheetTitle } from '@/components/ui/bottom-sheet';
import { MOCK_MISSIONS, MockMission } from '@/data/mock-wallet-data';
import { Button } from '@/components/ui/button';

interface MissionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MissionsPanel({ isOpen, onClose }: MissionsPanelProps) {
  const getProgressPercentage = (mission: MockMission) => {
    return (mission.progress / mission.maxProgress) * 100;
  };

  return (
    <BottomSheet open={isOpen} onOpenChange={onClose}>
      <BottomSheetContent className="max-h-[85vh]">
        <BottomSheetHeader>
          <BottomSheetTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Missions
          </BottomSheetTitle>
        </BottomSheetHeader>
        
        <div className="px-6 pb-6 space-y-4">
          {MOCK_MISSIONS.map((mission) => {
            const progress = getProgressPercentage(mission);
            const isCompleted = mission.progress >= mission.maxProgress;
            
            return (
              <div
                key={mission.id}
                className="p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {mission.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {mission.description}
                    </p>
                  </div>
                  {isCompleted && (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 ml-2" />
                  )}
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      {mission.progress} / {mission.maxProgress}
                    </span>
                    <span className="text-gray-600">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isCompleted ? 'bg-green-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-amber-600">
                    Reward: {mission.reward}
                  </span>
                  {!isCompleted && (
                    <Button
                      size="sm"
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
}

