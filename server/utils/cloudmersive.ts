const CONVERT_URL = 'https://api.cloudmersive.com/convert/autodetect/to/pdf'
const TIMEOUT_MS = 25_000

export const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

export async function convertXlsxToPdf(xlsx: Uint8Array<ArrayBuffer>, apiKey: string): Promise<Buffer> {
  const form = new FormData()
  form.append('inputFile', new Blob([xlsx], { type: XLSX_MIME }), 'report.xlsx')

  const response = await fetch(CONVERT_URL, {
    method: 'POST',
    headers: { Apikey: apiKey },
    body: form,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new Error(`Cloudmersive responded ${response.status}: ${await response.text()}`)
  }

  return Buffer.from(await response.arrayBuffer())
}
