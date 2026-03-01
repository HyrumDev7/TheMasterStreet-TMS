'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import styles from './PasswordField.module.css'

type PasswordFieldProps = {
  id: string
  value: string
  onChange: (value: string) => void
  label: string
  required?: boolean
  autoComplete?: string
}

export function PasswordField({
  id,
  value,
  onChange,
  label,
  required = true,
  autoComplete = 'current-password',
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <label className={styles.label} htmlFor={id}>
      {label}
      <div className={styles.inputWrap}>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.input}
          required={required}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setShowPassword((s) => !s)}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </label>
  )
}
