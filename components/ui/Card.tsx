import { clsx } from 'clsx'
import { HTMLAttributes } from 'react'

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('bg-white border border-[#E5E7EB] rounded-xl', className)}
      {...props}
    >
      {children}
    </div>
  )
}
