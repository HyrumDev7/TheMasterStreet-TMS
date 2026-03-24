import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Formulario de inscripción',
  description:
    'Inscripción de organizaciones: nombre, integrantes, jurado oficial y red social.',
}

export default function FormularioInscripcionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
