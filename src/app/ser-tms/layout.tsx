import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SÉ TMS',
  description:
    'Postula a SÉ TMS y sé parte de The Master Street. Envía tu información y link de video.',
}

export default function SerTmsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
