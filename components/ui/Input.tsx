import React from 'react';

interface InputProps {
  type?: 'text' | 'number';
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  unit?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  unit,
  className = '',
  min,
  max,
  step,
  disabled = false,
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    onChange(newValue);
  };

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        inputMode={type === 'number' ? 'decimal' : 'text'}
        className={`w-full h-12 px-3 sm:px-4 text-base sm:text-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg sm:rounded-xl text-black dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${unit ? 'pr-10 sm:pr-12' : ''} ${className}`}
      />
      {unit && (
        <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-medium text-zinc-400 dark:text-zinc-500">
          {unit}
        </span>
      )}
    </div>
  );
}
