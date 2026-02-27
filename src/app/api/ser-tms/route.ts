import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { serTmsSchema } from '@/lib/validations/serTms'

/**
 * POST /api/ser-tms
 * Recibe el formulario "Sé TMS" (nombre, apellidos, rut, aka, ciudad/comuna, edad, link de video).
 * Guarda en Supabase en la tabla ser_tms_postulaciones (crear en Supabase si no existe).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = serTmsSchema.parse(body)

    const supabase = createServerClient()
    const { error } = await supabase.from('ser_tms_postulaciones').insert({
      nombre: data.nombre,
      apellidos: data.apellidos,
      rut: data.rut,
      aka: data.aka,
      ciudad_comuna: data.ciudadComuna,
      edad: data.edad,
      link_video: data.linkVideo,
    })

    if (error) {
      console.error('ser-tms insert error:', error)
      return NextResponse.json(
        { error: 'Error al guardar. Revisa que exista la tabla ser_tms_postulaciones en Supabase.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err && typeof err === 'object' && 'flatten' in err) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: (err as { flatten: () => unknown }).flatten() },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 400 })
  }
}
