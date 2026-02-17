'use client'

import { useMemo, useState } from 'react'

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

/** Número de semana ISO del año (1-53) para una fecha */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7 // Lunes = 1, Domingo = 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

const ID_AÑO = 'cal-card-año'
const ID_MES = 'cal-card-mes'

export function CalendarCardControls({ className }: Readonly<{ className?: string }>) {
  const now = useMemo(() => new Date(), [])
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const weekNumber = useMemo(() => {
    const d = new Date(year, month, 1)
    return getWeekNumber(d)
  }, [year, month])

  const years = useMemo(() => {
    const current = now.getFullYear()
    return [current - 1, current, current + 1]
  }, [now])

  return (
    <fieldset className={`${className ?? ''} border-0 p-0 m-0 min-w-0`} aria-label="Calendario: selección de año, mes y semana">
      <legend className="sr-only">Calendario</legend>
      <div className="flex flex-col gap-1 sm:gap-1.5">
        <label htmlFor={ID_AÑO} className="text-[0.8125rem] font-bold uppercase tracking-[0.05em] text-zinc-800 sm:text-[0.875rem]">
          Año
        </label>
        <select
          id={ID_AÑO}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-full rounded-md border border-zinc-300/90 bg-white/90 px-2.5 py-2 text-[0.8125rem] font-bold uppercase tracking-wide text-zinc-800 transition-colors hover:border-red-300 hover:bg-red-50/50 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-[0.875rem]"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1 sm:gap-1.5">
        <label htmlFor={ID_MES} className="text-[0.8125rem] font-bold uppercase tracking-[0.05em] text-zinc-800 sm:text-[0.875rem]">
          Mes
        </label>
        <select
          id={ID_MES}
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="w-full rounded-md border border-zinc-300/90 bg-white/90 px-2.5 py-2 text-[0.8125rem] font-bold uppercase tracking-wide text-zinc-800 transition-colors hover:border-red-300 hover:bg-red-50/50 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:text-[0.875rem]"
        >
          {MESES.map((nombre, i) => (
            <option key={nombre} value={i}>
              {nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1 sm:gap-1.5">
        <span className="text-[0.8125rem] font-bold uppercase tracking-[0.05em] text-zinc-800 sm:text-[0.875rem]">
          Semana
        </span>
        <output
          htmlFor={`${ID_AÑO} ${ID_MES}`}
          className="flex items-center rounded-md border border-dashed border-zinc-300/90 bg-white/90 px-2.5 py-2 text-[0.8125rem] font-bold uppercase tracking-wide text-zinc-800 sm:text-[0.875rem]"
          aria-live="polite"
        >
          Semana {weekNumber}
        </output>
      </div>
    </fieldset>
  )
}
