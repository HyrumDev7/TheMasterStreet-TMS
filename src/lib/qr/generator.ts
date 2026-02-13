import QRCode from 'qrcode'

/**
 * Genera un código QR para una entrada
 * @param entradaId ID de la entrada
 * @returns String con el código QR (texto codificado)
 */
export async function generateQRCode(entradaId: string): Promise<string> {
  try {
    // Generar código único basado en el ID de la entrada
    const qrData = `TMS-${entradaId}-${Date.now()}`
    
    // Generar QR code como string
    const qrCodeString = await QRCode.toString(qrData, {
      type: 'utf8',
      errorCorrectionLevel: 'M',
    })
    
    return qrData // Retornar el dato, no la imagen (la imagen se genera en el frontend)
  } catch (error) {
    console.error('Error al generar QR code:', error)
    // Fallback: retornar un código simple
    return `TMS-${entradaId}-${Date.now()}`
  }
}

/**
 * Genera la imagen del QR code como data URL
 * Útil para mostrar en el frontend
 */
export async function generateQRCodeImage(data: string): Promise<string> {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'M',
      width: 300,
      margin: 2,
    })
    
    return qrCodeDataUrl
  } catch (error) {
    console.error('Error al generar imagen QR:', error)
    throw error
  }
}
