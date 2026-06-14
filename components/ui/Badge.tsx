import { clsx } from 'clsx'
import { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'teal' | 'gray' | 'green'
}

export function Badge({ variant = 'teal', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium',
        {
          'bg-[#E1F5EE] text-[#085041]': variant === 'teal',
          'bg-gray-100 text-gray-600': variant === 'gray',
          'bg-green-100 text-green-700': variant === 'green',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
