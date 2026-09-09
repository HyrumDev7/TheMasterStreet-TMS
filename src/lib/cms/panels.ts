export const CMS_PANELS = [
  { id: 'home-hero', label: 'Fondo del home (hero)' },
  { id: 'carousel', label: 'Carrusel' },
  { id: 'card-eventos', label: 'Panel: Próximos eventos' },
  { id: 'card-calendario', label: 'Panel: Calendario' },
  { id: 'card-noticias', label: 'Panel: Noticias' },
  { id: 'card-shop', label: 'Panel: Shop' },
  { id: 'card-historia', label: 'Panel: Nuestra historia' },
] as const

export type CmsPanelId = (typeof CMS_PANELS)[number]['id']

export type PanelMediaItem = {
  id: string
  panel_id: string
  url: string
  pos_x: number
  pos_y: number
  ancho: number
  alto: number
  rotacion: number
  orden: number
}

export function isCmsPanelId(value: string): value is CmsPanelId {
  return CMS_PANELS.some((panel) => panel.id === value)
}
