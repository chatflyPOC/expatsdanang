'use client'
import { clsx } from 'clsx'

interface ChipProps {
  label: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

export function Chip({ label, selected, onClick, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'text-sm px-4 py-2 rounded-full border transition-colors cursor-pointer',
        selected
          ? 'bg-[#E1F5EE] text-[#085041] border-[#5DCAA5]'
          : 'border-[#D1D5DB] text-gray-600 hover:bg-gray-50',
        className
      )}
    >
      {label}
    </button>
  )
}
