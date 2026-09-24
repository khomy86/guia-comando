import { defu } from 'defu'

const isValidReportRequest = (body: unknown): body is ReportRequest => {
  const form = body as Partial<ReportRequest> | null
  return !!form?.estou && !!form.vejo && !!form.faco && !!form.solicito
}

export default defineEventHandler(async (event) => {
  const body = await readBody<unknown>(event)
  if (!isValidReportRequest(body)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid report data' })
  }

  let xlsx: Uint8Array<ArrayBuffer>
  try {
    // Merge over an empty form so missing fields can't crash the template filling
    xlsx = await buildReportXlsx(defu(body, createEmptyAcidentesForm()))
  }
  catch (error) {
    console.error('Error building report:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error generating report' })
  }

  const { cloudmersiveApiKey } = useRuntimeConfig(event)
  if (cloudmersiveApiKey) {
    try {
      const pdf = await convertXlsxToPdf(xlsx, cloudmersiveApiKey)
      setResponseHeaders(event, {
        'content-type': 'application/pdf',
        'content-disposition': 'attachment; filename="report.pdf"',
      })
      return pdf
    }
    catch (error) {
      console.error('PDF conversion failed, falling back to Excel:', error)
    }
  }
  else {
    console.warn('CLOUDMERSIVE_API_KEY is not set, returning the report as Excel')
  }

  setResponseHeaders(event, {
    'content-type': XLSX_MIME,
    'content-disposition': 'attachment; filename="report.xlsx"',
  })
  return xlsx
})
