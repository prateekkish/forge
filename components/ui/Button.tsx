import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = '',
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200',
    secondary: 'bg-zinc-100 text-black hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600',
    ghost: 'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800',
  };

  const sizeStyles = {
    sm: 'h-11 sm:h-10 px-3 sm:px-4 text-sm',
    md: 'h-12 px-4 sm:px-6 text-sm sm:text-base',
    lg: 'h-14 px-6 sm:px-8 text-base sm:text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
}
