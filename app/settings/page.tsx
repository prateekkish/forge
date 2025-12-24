'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useWorkout } from '@/contexts/WorkoutContext';

export default function SettingsPage() {
  const { state, dispatch } = useWorkout();
  const [unit, setUnit] = useState<'kg' | 'lbs'>(state.settings.unit);
  const [defaultRestTime, setDefaultRestTime] = useState(state.settings.defaultRestTime);
  const [soundEnabled, setSoundEnabled] = useState(state.settings.soundEnabled);

  useEffect(() => {
    setUnit(state.settings.unit);
    setDefaultRestTime(state.settings.defaultRestTime);
    setSoundEnabled(state.settings.soundEnabled);
  }, [state.settings]);

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { unit, defaultRestTime, soundEnabled }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
          Settings
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Customize your workout experience
        </p>
      </div>

      {/* Unit Preference */}
      <Card>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
              Weight Unit
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Choose your preferred unit for weight
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant={unit === 'kg' ? 'primary' : 'secondary'}
              size="md"
              onClick={() => setUnit('kg')}
              className="flex-1"
            >
              Kilograms (kg)
            </Button>
            <Button
              variant={unit === 'lbs' ? 'primary' : 'secondary'}
              size="md"
              onClick={() => setUnit('lbs')}
              className="flex-1"
            >
              Pounds (lbs)
            </Button>
          </div>
        </div>
      </Card>

      {/* Rest Time */}
      <Card>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
              Default Rest Time
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Time between sets (90-300 seconds)
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={defaultRestTime}
              onChange={(value) => setDefaultRestTime(Number(value))}
              min={90}
              max={300}
              unit="sec"
              className="flex-1"
            />
            <span className="text-lg font-medium text-black dark:text-zinc-50 w-20">
              {Math.floor(defaultRestTime / 60)}:{(defaultRestTime % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </Card>

      {/* Sound Notifications */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
              Sound Notifications
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Play sound when rest timer ends
            </p>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              soundEnabled
                ? 'bg-emerald-500'
                : 'bg-zinc-200 dark:bg-zinc-700'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                soundEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </Card>

      {/* Save Button */}
      <Button variant="success" size="lg" onClick={handleSave} className="w-full">
        Save Settings
      </Button>

      {/* About */}
      <Card>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
            About
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            5x5 Tracker - Version 1.0.0
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            A minimalist workout tracker for the StrongLifts 5x5 program
          </p>
        </div>
      </Card>
    </div>
  );
}
