'use client'
import { clsx } from 'clsx'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-colors rounded-full cursor-pointer',
        {
          'bg-[#1D9E75] text-white hover:bg-[#0F6E56]': variant === 'primary',
          'border border-[#D1D5DB] text-gray-600 hover:bg-gray-50': variant === 'secondary',
          'text-[#1D9E75] hover:underline': variant === 'ghost',
          'text-sm px-4 py-2': size === 'sm',
          'text-sm px-5 py-2.5': size === 'md',
          'text-base px-6 py-3': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
