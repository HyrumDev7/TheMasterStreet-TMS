import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { formularioInscripcionOrganizacionSchema } from '@/lib/validations/formularioInscripcionOrganizacion'

/**
 * POST /api/formulario-inscripcion
 * Inscripción de organizaciones (Nuestra Historia).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = formularioInscripcionOrganizacionSchema.parse(body)

    const supabase = createServerClient()
    const { error } = await supabase.from('inscripciones_organizacion').insert({
      nombre_organizacion: data.nombreOrganizacion,
      integrantes: data.integrantes,
      jurado_oficial: data.juradoOficial,
      link_red_social: data.linkRedSocial,
    })

    if (error) {
      console.error('formulario-inscripcion insert error:', error)
      return NextResponse.json(
        {
          error:
            'Error al guardar. Revisa que exista la tabla inscripciones_organizacion en Supabase.',
        },
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
