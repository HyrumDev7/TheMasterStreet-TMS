import { HTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'
import styles from './Card.module.css'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white border border-gray-200',
      outlined: 'border-2 border-gray-300',
      elevated: 'bg-white shadow-lg',
    }

    return (
      <div
        ref={ref}
        className={clsx(styles.root, styles.body, 'rounded-lg p-6', variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
