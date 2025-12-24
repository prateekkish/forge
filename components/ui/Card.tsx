import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function Card({
  children,
  className = '',
  padding = 'md',
  onClick,
}: CardProps) {
  const paddingStyles = {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const interactiveStyles = onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : '';

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 ${paddingStyles[padding]} ${interactiveStyles} ${className}`}
    >
      {children}
    </div>
  );
}
