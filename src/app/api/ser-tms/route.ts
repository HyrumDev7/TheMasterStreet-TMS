import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { serTmsSchema } from '@/lib/validations/serTms'
import { limpiarRut } from '@/lib/validations/rut'
import {
  STORAGE_BUCKETS,
  SER_TMS_COMPROBANTES_PREFIX,
  MAX_COMPROBANTE_SIZE_MB,
  ALLOWED_COMPROBANTE_FORMATS,
} from '@/lib/utils/constants'

/**
 * POST /api/ser-tms
 * Recibe el formulario "SÉ TMS" (nombre, apellidos, rut, aka, ciudad/comuna, edad, link de video, comprobante de pago).
 * Comprobante obligatorio; RUT irrepetible (una sola inscripción por RUT).
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const nombre = formData.get('nombre') as string | null
    const apellidos = formData.get('apellidos') as string | null
    const rut = formData.get('rut') as string | null
    const aka = formData.get('aka') as string | null
    const ciudadComuna = formData.get('ciudadComuna') as string | null
    const edadRaw = formData.get('edad')
    const linkVideo = formData.get('linkVideo') as string | null
    const comprobante = formData.get('comprobante') as File | null

    const body = {
      nombre: nombre ?? '',
      apellidos: apellidos ?? '',
      rut: rut ?? '',
      aka: aka ?? '',
      ciudadComuna: ciudadComuna ?? '',
      edad: edadRaw !== null && edadRaw !== '' ? Number(edadRaw) : undefined,
      linkVideo: linkVideo ?? '',
    }

    const data = serTmsSchema.parse(body)

    if (!comprobante || !(comprobante instanceof File) || comprobante.size === 0) {
      return NextResponse.json(
        { error: 'El comprobante de pago es obligatorio.' },
        { status: 400 }
      )
    }

    const ext = comprobante.name.split('.').pop()?.toLowerCase()
    if (!ext || !ALLOWED_COMPROBANTE_FORMATS.includes(ext)) {
      return NextResponse.json(
        {
          error: `Formato de comprobante no permitido. Permitidos: ${ALLOWED_COMPROBANTE_FORMATS.join(', ')}`,
        },
        { status: 400 }
      )
    }

    const fileSizeMB = comprobante.size / (1024 * 1024)
    if (fileSizeMB > MAX_COMPROBANTE_SIZE_MB) {
      return NextResponse.json(
        { error: `El comprobante no puede pesar más de ${MAX_COMPROBANTE_SIZE_MB}MB` },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    const rutNormalizado = limpiarRut(data.rut)

    const { data: existente } = await supabase
      .from('ser_tms_postulaciones')
      .select('id')
      .eq('rut_normalizado', rutNormalizado)
      .limit(1)
      .single()

    if (existente) {
      return NextResponse.json(
        { error: 'Ya existe una inscripción con este RUT. Solo se permite una inscripción por persona.' },
        { status: 400 }
      )
    }

    const fileName = `${SER_TMS_COMPROBANTES_PREFIX}/${Date.now()}_${rutNormalizado}_${comprobante.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.DOCUMENTS)
      .upload(fileName, comprobante, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('ser-tms comprobante upload error:', uploadError)
      return NextResponse.json(
        {
          error:
            'Error al subir el comprobante. Revisa que el bucket "documents" exista y permita subidas (política de Storage).',
        },
        { status: 500 }
      )
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKETS.DOCUMENTS).getPublicUrl(fileName)

    const { error } = await supabase.from('ser_tms_postulaciones').insert({
      nombre: data.nombre,
      apellidos: data.apellidos,
      rut: data.rut,
      rut_normalizado: rutNormalizado,
      aka: data.aka,
      ciudad_comuna: data.ciudadComuna,
      edad: data.edad,
      link_video: data.linkVideo,
      comprobante_url: publicUrl,
    })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Ya existe una inscripción con este RUT. Solo se permite una inscripción por persona.' },
          { status: 400 }
        )
      }
      console.error('ser-tms insert error:', error)
      return NextResponse.json(
        {
          error:
            'Error al guardar. Revisa que la tabla ser_tms_postulaciones tenga la columna comprobante_url.',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err && typeof err === 'object' && 'flatten' in err) {
      return NextResponse.json(
        { error: 'Datos inválidos. Revisa que todos los campos obligatorios estén completos.', details: (err as { flatten: () => unknown }).flatten() },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 400 })
  }
}
