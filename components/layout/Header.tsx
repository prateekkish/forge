'use client';

import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
}

export function Header({ title = '5x5 Tracker' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-zinc-50/80 dark:bg-black/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800 safe-top">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-bold text-black dark:text-zinc-50">{title}</h1>
        <Link
          href="/settings"
          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-600 dark:text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
}
