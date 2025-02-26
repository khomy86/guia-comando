import { defineEventHandler, readBody, createError, getRequestURL } from 'h3'
import ExcelJS from 'exceljs'
import { resolve, join } from 'pathe'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import fs from 'fs'
import os from 'os'

// Import Cloudmersive API client
import CloudmersiveConvertApiClient from 'cloudmersive-convert-api-client'

// Fallback API key in case environment variable is not set
const FALLBACK_API_KEY = 'your_api_key_here'

// Type for accident mapping
interface AccidentTypeMapping {
  typeCells: {
    [key: string]: string;
  };
  descriptionCells: {
    [key: string]: string;
  };
}

export default defineEventHandler(async (event) => {
  try {
    // Get Cloudmersive API key from environment variable
    const config = useRuntimeConfig()
    const CLOUDMERSIVE_API_KEY = config.cloudmersiveApiKey || process.env.CLOUDMERSIVE_API_KEY || FALLBACK_API_KEY
    
    if (!CLOUDMERSIVE_API_KEY || CLOUDMERSIVE_API_KEY === FALLBACK_API_KEY) {
      console.warn('Cloudmersive API key not set or using fallback. PDF conversion will not work. Please set the CLOUDMERSIVE_API_KEY environment variable.')
    }
    
    const body = await readBody(event)
    if (!body) {
      throw createError({
        statusCode: 400,
        message: 'Request body is required'
      })
    }
    
    const workbook = new ExcelJS.Workbook()
    
    // Improved template path resolution with multiple fallbacks
    const possiblePaths = []
    
    // Path 1: Standard development path
    possiblePaths.push(resolve(process.cwd(), 'assets/excel/gca.xlsx'))
    
    // Path 2: Public directory path (for Vercel)
    possiblePaths.push(resolve(process.cwd(), 'public/excel/gca.xlsx'))
    
    // Path 3: Production path based on import.meta.url
    try {
      const currentDir = dirname(fileURLToPath(import.meta.url))
      possiblePaths.push(join(currentDir, '../../../assets/excel/gca.xlsx'))
      possiblePaths.push(join(currentDir, '../../assets/excel/gca.xlsx'))
      possiblePaths.push(join(currentDir, '../../../public/excel/gca.xlsx'))
    } catch (e: any) {
      console.error('Error creating path from import.meta.url:', e)
    }
    
    // Path 4: Absolute paths for Vercel
    possiblePaths.push('/var/task/assets/excel/gca.xlsx')
    possiblePaths.push('/var/task/public/excel/gca.xlsx')
    
    // Try each path until one works
    let templatePath: string | null = null
    let lastError: any = null
    
    for (const path of possiblePaths) {
      try {
        if (fs.existsSync(path)) {
          templatePath = path
          console.log('Found template at:', path)
          break
        }
      } catch (e: any) {
        lastError = e
        console.log('Path check failed:', path, e.message)
      }
    }
    
    // Try to load the template
    try {
      if (templatePath) {
        // If we found a file path, try to load it
        await workbook.xlsx.readFile(templatePath)
        console.log('Successfully loaded template from file path:', templatePath)
      } else {
        // If no file path worked, try to fetch from public URL
        console.log('Attempting to fetch template from public URL')
        
        // Get the host from the request
        const requestURL = getRequestURL(event)
        const host = requestURL.host || event.node.req.headers.host || 'localhost:3000'
        const protocol = host.includes('localhost') ? 'http' : 'https'
        const templateUrl = `${protocol}://${host}/excel/gca.xlsx`
        
        console.log('Fetching template from:', templateUrl)
        
        try {
          // Use Bun's native fetch instead of node-fetch
          const response = await fetch(templateUrl)
          
          if (!response.ok) {
            throw new Error(`Failed to fetch template: ${response.status} ${response.statusText}`)
          }
          
          const arrayBuffer = await response.arrayBuffer()
          // Use type assertion to avoid Buffer type issues
          const buffer = Buffer.from(arrayBuffer)
          await workbook.xlsx.load(buffer as any)
          console.log('Successfully loaded template from URL')
        } catch (fetchError: any) {
          console.error('Error fetching template from URL:', fetchError)
          throw createError({ 
            statusCode: 500, 
            message: `Could not load Excel template from file system or URL. Last error: ${fetchError.message}` 
          })
        }
      }
    } catch (error: any) {
      console.error('Error reading Excel template:', error)
      throw createError({ 
        statusCode: 500, 
        message: `Error reading Excel template: ${error.message}` 
      })
    }
    
    const worksheet = workbook.getWorksheet(1)

    // Add worksheet check immediately after loading
    if (!worksheet) {
      throw createError({ statusCode: 500, message: 'Worksheet not found in template' })
    }

    // Add accident type and description mappings at the top of the handler
    const accidentTypeMapping: AccidentTypeMapping = {
      typeCells: {
        '1': 'I16',  // Despiste de:
        '2': 'I18',  // Colisão entre:
        '3': 'I20'   // Outro:
      },
      descriptionCells: {
        '1': 'O16',
        '2': 'O18',
        '3': 'O20'
      }
    };

    // Update cellMappings - REMOVE accidentDescription
    const cellMappings = {
      // Estou section
      'estou.hrPosit': 'F8',
      'estou.ocorrN': 'O8',
      'estou.canalManobra': 'AB8',
      'estou.em': 'F10',
      'estou.latitude': 'G12',
      'estou.longitude': 'G14',
      'estou.localidade': 'S12',

      // Vejo section
      'vejo.veiculos.ligeiro.quantidade': 'Q22',
      'vejo.veiculos.ligeiro.passageiros': 'X22',
      'vejo.veiculos.ligeiro.mercadorias': 'AC22',
      'vejo.veiculos.pesado.quantidade': 'Q24',
      'vejo.veiculos.pesado.passageiros': 'X24',
      'vejo.veiculos.pesado.mercadorias': 'AC24',
      'vejo.veiculos.outros.quantidade': 'Q26',
      'vejo.veiculos.outros.texto': 'T26',
      'vejo.carga.tipo': 'O28',
      'vejo.carga.afetacao': 'O30',
      'vejo.vitimas.total': 'Q32',
      'vejo.vitimas.graves': 'W32',
      'vejo.vitimas.leves': 'AB32',
      'vejo.encarcerados.mecanico': 'Q34',
      'vejo.encarcerados.mecanicoVeiculo': 'W34',
      'vejo.encarcerados.fisicoTipo1': 'Q36',
      'vejo.encarcerados.fisicoTipo1Veiculo': 'W36',
      'vejo.encarcerados.fisicoTipo2': 'Q38',
      'vejo.encarcerados.fisicoTipo2Veiculo': 'W38',
      'vejo.via.interdita.checked': 'I40',
      'vejo.via.interdita.text1': 'N42',
      'vejo.via.interdita.text2': 'Q42',
      'vejo.via.condicionada.checked': 'T40',
      'vejo.via.condicionada.text1': 'Y42',
      'vejo.via.condicionada.text2': 'AB42',
      'vejo.via.faixasObstruidas': 'H35',
      'vejo.presentes.vmer': 'I44',
      'vejo.presentes.autoridade': 'T44',
      'vejo.presentes.concessionaria': 'I46',
      'vejo.presentes.outro.texto': 'U46',

      // Faco section
      'faco.sinalizacao': 'I48',
      'faco.criacaoZonasTrabalho': 'I50',
      'faco.abordagemVitimas': 'T48',
      'faco.outro.checked': 'T50',
      'faco.outro.texto': 'U50',

      // Solicito section
      'solicito.vsatVsae': 'I52',
      'solicito.absc': 'T52',
      'solicito.elementoComando': 'T54',
      'solicito.outros': 'M54',
      'solicito.rottarea': 'M56',

      // Assumo COS
      'assumoCos': 'I60'
    }

    // Populate cells
    for (const [fieldPath, cell] of Object.entries(cellMappings)) {
      try {
        const rawValue = getNestedValue(body, fieldPath)
        const cellObj = worksheet.getCell(cell)
        
        // Handle different value types
        if (typeof rawValue === 'boolean') {
          cellObj.value = rawValue ? 'X' : '';
        } else if (!isNaN(Number(rawValue)) && String(rawValue).trim() !== '') {
          cellObj.value = Number(rawValue)
          cellObj.numFmt = '0'
        } else {
          cellObj.value = rawValue || ''
        }
      } catch (error) {
        console.error(`Error processing ${fieldPath}:`, error)
      }
    }

    // Add this AFTER processing all cellMappings but BEFORE buffer generation
    try {
      const accidentType = getNestedValue(body, 'vejo.accidentType')?.toString() || ''
      const accidentDescription = getNestedValue(body, 'vejo.accidentDescription')?.toString() || ''
      
      if (accidentType && accidentTypeMapping.typeCells[accidentType]) {
        // Mark selected accident type
        worksheet.getCell(accidentTypeMapping.typeCells[accidentType]).value = 'X';
        
        // Add description to corresponding cell if exists
        if (accidentDescription && accidentTypeMapping.descriptionCells[accidentType]) {
          worksheet.getCell(accidentTypeMapping.descriptionCells[accidentType]).value = accidentDescription;
        }
      }
    } catch (error) {
      console.error('Error processing accident type:', error);
    }

    // Handle hrPosit placeholder
    const hrPositCell = worksheet.getCell('F8');
    if (!hrPositCell.value && body.hrPositPlaceholder) {
      hrPositCell.value = body.hrPositPlaceholder;
    }

    // Generate Excel buffer
    const excelBuffer = await workbook.xlsx.writeBuffer()
    
    // Convert Excel to PDF using Cloudmersive SDK
    try {
      // Check if API key is valid before attempting conversion
      if (!CLOUDMERSIVE_API_KEY || CLOUDMERSIVE_API_KEY === FALLBACK_API_KEY) {
        console.error('Cannot convert to PDF: Cloudmersive API key not set or using fallback value')
        throw new Error('PDF conversion is not available due to missing API key')
      }
      
      // Create a temporary file to store the Excel buffer
      // Use /tmp directory for Vercel compatibility or os.tmpdir()
      const tempDir = process.env.VERCEL ? '/tmp' : os.tmpdir()
      const tempExcelPath = join(tempDir, `report-${Date.now()}.xlsx`)
      
      // Write the Excel buffer to a temporary file
      await fs.promises.writeFile(tempExcelPath, Buffer.from(excelBuffer))
      console.log(`Excel file temporarily written to: ${tempExcelPath}`)
      
      // Verify the file exists
      if (!fs.existsSync(tempExcelPath)) {
        throw new Error(`Temporary Excel file was not created at ${tempExcelPath}`)
      }
      
      // Set up the Cloudmersive API client with the API key
      const defaultClient = CloudmersiveConvertApiClient.ApiClient.instance
      const Apikey = defaultClient.authentications['Apikey']
      Apikey.apiKey = CLOUDMERSIVE_API_KEY
      
      // Create API instance
      const apiInstance = new CloudmersiveConvertApiClient.ConvertDocumentApi()
      
      // Use promises to wrap the callback-based API
      const convertToPdf = () => {
        return new Promise<any>((resolve, reject) => {
          try {
            console.log('Calling convertDocumentAutodetectToPdf with file path:', tempExcelPath)
            
            // Verify file exists and is readable
            if (!fs.existsSync(tempExcelPath)) {
              throw new Error(`File does not exist at path: ${tempExcelPath}`)
            }
            
            // Create a readable stream from the file as expected by the API
            const inputFile = fs.createReadStream(tempExcelPath)
            
            // Use the autodetect method to convert the file to PDF
            apiInstance.convertDocumentAutodetectToPdf(inputFile, (error: any, data: any, response: any) => {
              // Clean up the temporary file
              try {
                fs.unlinkSync(tempExcelPath)
                console.log('Temporary file cleaned up successfully')
              } catch (cleanupError) {
                console.error('Error cleaning up temporary file:', cleanupError)
              }
              
              if (error) {
                console.error('SDK Error:', error)
                console.error('Error details:', JSON.stringify(error, null, 2))
                reject(error)
              } else {
                console.log('SDK returned data successfully')
                resolve(data)
              }
            })
          } catch (apiCallError) {
            console.error('Error calling API method:', apiCallError)
            reject(apiCallError)
          }
        })
      }
      
      // Perform the conversion
      console.log('Starting PDF conversion using Cloudmersive SDK...')
      const pdfData = await convertToPdf()
      console.log('PDF conversion completed successfully')
      
      // Set headers for PDF download
      event.node.res.setHeader('Content-Type', 'application/pdf')
      event.node.res.setHeader('Content-Disposition', 'attachment; filename=report.pdf')
      
      // Return PDF data directly
      return pdfData
    } catch (conversionError) {
      console.error('Error converting Excel to PDF:', conversionError)
      
      // Fallback to Excel if PDF conversion fails
      console.log('Falling back to Excel format')
      event.node.res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      event.node.res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx')
      
      return excelBuffer
    }
  } catch (error) {
    console.error('Error generating report:', error)
    throw createError({ statusCode: 500, message: 'Error generating report' })
  }
})

function getNestedValue(obj: any, path: string): any {
  const parts = path.split('.')
  let value = obj
  
  for (const part of parts) {
    if (value === null || value === undefined || typeof value !== 'object') break
    value = value[part]
  }
  
  // Handle numbers and preserve booleans
  if (typeof value === 'string') {
    const numValue = value.trim()
    if (!isNaN(Number(numValue)) && numValue !== '') {
      return numValue.includes('.') ? parseFloat(numValue) : parseInt(numValue, 10)
    }
  }
  
  // Return original value if it exists, including false
  return value !== undefined && value !== null ? value : ''
} 