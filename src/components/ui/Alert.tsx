import { cn } from '@/lib/utils/cn'
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'

interface AlertProps {
  children: React.ReactNode
  variant?: 'info' | 'success' | 'warning' | 'error'
  className?: string
}

export default function Alert({
  children,
  variant = 'info',
  className,
}: AlertProps) {
  const variants = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: <Info size={20} className="text-blue-500" />,
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: <CheckCircle size={20} className="text-green-500" />,
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: <AlertCircle size={20} className="text-yellow-500" />,
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: <XCircle size={20} className="text-red-500" />,
    },
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4',
        variants[variant].container,
        className
      )}
      role="alert"
    >
      <span className="flex-shrink-0">{variants[variant].icon}</span>
      <div className="text-sm">{children}</div>
    </div>
  )
}
