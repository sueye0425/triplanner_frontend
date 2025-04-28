import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label: string;
  variant?: 'light' | 'dark';
}

export function BackButton({ onClick, label, variant = 'dark' }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 
        ${variant === 'light' 
          ? 'text-white hover:bg-white/10' 
          : 'text-gray-600 hover:bg-gray-100'
        }
      `}
    >
      <ArrowLeft 
        size={20} 
        className={`
          transition-transform duration-200 
          group-hover:-translate-x-1
          ${variant === 'light' ? 'text-white' : 'text-gray-600'}
        `}
      />
      <span>{label}</span>
    </button>
  );
}