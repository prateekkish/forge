'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';

interface RestTimerProps {
  seconds: number;
  initialSeconds: number;
  onComplete: () => void;
  onSkip: () => void;
  onAdjust: (delta: number) => void;
}

export function RestTimer({ seconds, initialSeconds, onComplete, onSkip, onAdjust }: RestTimerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragAngle, setDragAngle] = useState<number | null>(null);

  useEffect(() => {
    if (seconds <= 0) {
      onComplete();
    }
  }, [seconds, onComplete]);

  const progress = (seconds / initialSeconds) * 100;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const radius = 120;
  const centerX = 128;
  const centerY = 128;

  // Use drag angle if actively dragging, otherwise use progress
  const displayAngle = isDragging && dragAngle !== null ? dragAngle : (progress / 100) * 360;

  // Calculate handle position at the end of the progress arc
  // Angle 0° = 12 o'clock (top), increases clockwise
  const handleAngle = displayAngle * (Math.PI / 180); // convert to radians
  const handleX = centerX + radius * Math.cos(handleAngle);
  const handleY = centerY + radius * Math.sin(handleAngle);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) {
      setDragAngle(null);
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!svgRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      // Get position relative to center of SVG element (in screen coordinates)
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Calculate angle in screen coordinates
      // atan2(y, x) gives: 0° at 3 o'clock, 90° at 6 o'clock, -90° at 12 o'clock
      // We want: 0° at 12 o'clock, 90° at 3 o'clock, 180° at 6 o'clock
      let newAngle = Math.atan2(y, x) * (180 / Math.PI) + 90;
      if (newAngle < 0) newAngle += 360;

      // Update the visual angle immediately
      setDragAngle(newAngle);

      // Convert angle to progress (0-100)
      let newProgress = (newAngle / 360) * 100;
      if (newProgress > 100) newProgress = 100;
      if (newProgress < 0) newProgress = 0;

      // Convert progress to seconds
      const newSeconds = Math.round((newProgress / 100) * initialSeconds);
      const delta = newSeconds - seconds;

      if (delta !== 0) {
        onAdjust(delta);
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setDragAngle(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, seconds, initialSeconds, onAdjust]);

  const circumference = 2 * Math.PI * radius;
  // Use displayAngle for the arc as well during dragging
  const displayProgress = (displayAngle / 360) * 100;
  const strokeDashoffset = circumference * (1 - displayProgress / 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-8 p-8">
        {/* Progress Ring with Integrated Controls */}
        <div className="relative flex items-center justify-center gap-8">
          {/* -10s Button (Left) */}
          <button
            onClick={() => onAdjust(-10)}
            className="flex-shrink-0 w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center group"
          >
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
              </svg>
              <span className="text-xs text-white/70 font-medium mt-0.5">10s</span>
            </div>
          </button>

          {/* Timer Circle */}
          <div className="relative">
            <svg
              ref={svgRef}
              className="w-64 h-64 transform -rotate-90"
              style={{ touchAction: 'none' }}
            >
              {/* Background circle */}
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              {/* Progress arc */}
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={isDragging ? '' : 'transition-all duration-1000 ease-linear'}
              />
              {/* Draggable handle at the end of the arc - hidden while dragging */}
              {!isDragging && (
                <g
                  onPointerDown={handlePointerDown}
                  className="cursor-grab active:cursor-grabbing"
                  style={{ touchAction: 'none' }}
                >
                  {/* Outer glow ring - pulsing when not dragging */}
                  <circle
                    cx={handleX}
                    cy={handleY}
                    r="16"
                    fill="rgba(16, 185, 129, 0.3)"
                    className="transition-all"
                  >
                    <animate
                      attributeName="r"
                      values="16;20;16"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Main handle */}
                  <circle
                    cx={handleX}
                    cy={handleY}
                    r="10"
                    fill="#10b981"
                    stroke="white"
                    strokeWidth="3"
                    className="transition-all"
                  />
                </g>
              )}
              {/* Larger invisible hit area for starting drag anywhere on the circle */}
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="transparent"
                stroke="transparent"
                strokeWidth="20"
                onPointerDown={handlePointerDown}
                className="cursor-grab active:cursor-grabbing"
                style={{ touchAction: 'none' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-7xl font-bold text-white">
                {minutes}:{secs.toString().padStart(2, '0')}
              </span>
              <span className="text-sm text-zinc-400 font-medium mt-2">
                {isDragging ? 'Adjusting...' : 'Rest Time'}
              </span>
            </div>
          </div>

          {/* +10s Button (Right) */}
          <button
            onClick={() => onAdjust(10)}
            className="flex-shrink-0 w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center group"
          >
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs text-white/70 font-medium mt-0.5">10s</span>
            </div>
          </button>
        </div>

        {/* Instruction hint */}
        <p className="text-xs text-zinc-500 font-medium">
          Drag the circle or use +/- buttons to adjust
        </p>

        {/* Skip Button */}
        <Button
          variant="ghost"
          size="lg"
          onClick={onSkip}
          className="border-white/20 text-white hover:bg-white/10"
        >
          Skip Rest
        </Button>
      </div>
    </div>
  );
}
