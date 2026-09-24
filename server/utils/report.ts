import ExcelJS from 'exceljs'

type CellValue = string | number | null

const text = (value: string): CellValue => value.trim() || null
const count = (value: string): CellValue => (/^\d+$/.test(value.trim()) ? Number(value) : text(value))
const check = (value: boolean): CellValue => (value ? 'X' : null)

// `null` leaves the template cell untouched
const CELLS: Array<[cell: string, value: (f: ReportRequest) => CellValue]> = [
  // ESTOU
  ['F8', f => text(f.estou.hrPosit) ?? text(f.hrPositPlaceholder ?? '')],
  ['O8', f => text(f.estou.ocorrN)], // kept as text so leading zeros survive
  ['AB8', f => count(f.estou.canalManobra)],
  ['F10', f => text(f.estou.em)],
  ['G12', f => text(f.estou.latitude)],
  ['G14', f => text(f.estou.longitude)],
  ['S12', f => text(f.estou.localidade)],

  // VEJO
  ['Q22', f => count(f.vejo.veiculos.ligeiro.quantidade)],
  ['X22', f => count(f.vejo.veiculos.ligeiro.passageiros)],
  ['AC22', f => count(f.vejo.veiculos.ligeiro.mercadorias)],
  ['Q24', f => count(f.vejo.veiculos.pesado.quantidade)],
  ['X24', f => count(f.vejo.veiculos.pesado.passageiros)],
  ['AC24', f => count(f.vejo.veiculos.pesado.mercadorias)],
  ['Q26', f => count(f.vejo.veiculos.outros.quantidade)],
  ['T26', f => text(f.vejo.veiculos.outros.texto)],
  ['O28', f => text(f.vejo.carga.tipo)],
  ['O30', f => text(f.vejo.carga.afetacao)],
  ['Q32', f => count(f.vejo.vitimas.total)],
  ['W32', f => count(f.vejo.vitimas.graves)],
  ['AB32', f => count(f.vejo.vitimas.leves)],
  ['Q34', f => count(f.vejo.encarcerados.mecanico)],
  ['W34', f => text(f.vejo.encarcerados.mecanicoVeiculo)],
  ['Q36', f => count(f.vejo.encarcerados.fisicoTipo1)],
  ['W36', f => text(f.vejo.encarcerados.fisicoTipo1Veiculo)],
  ['Q38', f => count(f.vejo.encarcerados.fisicoTipo2)],
  ['W38', f => text(f.vejo.encarcerados.fisicoTipo2Veiculo)],
  ['I40', f => check(f.vejo.via.interdita.checked)],
  ['N42', f => text(f.vejo.via.interdita.text1)],
  ['Q42', f => text(f.vejo.via.interdita.text2)],
  ['T40', f => check(f.vejo.via.condicionada.checked)],
  ['Y42', f => text(f.vejo.via.condicionada.text1)],
  ['AB42', f => text(f.vejo.via.condicionada.text2)],
  ['I44', f => check(f.vejo.presentes.vmer)],
  ['T44', f => check(f.vejo.presentes.autoridade)],
  ['I46', f => check(f.vejo.presentes.concessionaria)],
  ['T46', f => check(f.vejo.presentes.outro.checked)],
  ['U46', f => text(f.vejo.presentes.outro.texto)],

  // FAÇO
  ['I48', f => check(f.faco.sinalizacao)],
  ['I50', f => check(f.faco.criacaoZonasTrabalho)],
  ['T48', f => check(f.faco.abordagemVitimas)],
  ['T50', f => check(f.faco.outro.checked)],
  ['U50', f => text(f.faco.outro.texto)],

  // SOLICITO
  ['I52', f => count(f.solicito.vsatVsae)],
  ['T52', f => count(f.solicito.absc)],
  ['T54', f => check(f.solicito.elementoComando)],
  ['M54', f => text(f.solicito.outros)],
  ['M56', f => text(f.solicito.rottarea)],

  ['I60', f => text(f.assumoCos)],
]

/** Accident type -> [checkbox cell, description cell] */
const ACCIDENT_TYPE_CELLS: Record<Exclude<AccidentType, ''>, [string, string]> = {
  '1': ['I16', 'O16'], // Despiste de:
  '2': ['I18', 'O18'], // Colisão entre:
  '3': ['I20', 'O20'], // Outro:
}

const loadTemplate = async (): Promise<Buffer> => {
  // server/assets/ is bundled with the server build and exposed as the `assets:server` storage
  const template = await useStorage('assets:server').getItemRaw<Buffer>('gca.xlsx')
  if (!template) throw new Error('Report template server/assets/gca.xlsx not found')
  return template
}

export async function buildReportXlsx(form: ReportRequest): Promise<Uint8Array<ArrayBuffer>> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(new Uint8Array(await loadTemplate()).buffer)

  const sheet = workbook.getWorksheet(1)
  if (!sheet) throw new Error('Worksheet not found in report template')

  const write = (address: string, value: CellValue) => {
    if (value === null) return
    const cell = sheet.getCell(address)
    cell.value = value
    if (typeof value === 'number') cell.numFmt = '0'
  }

  for (const [address, getValue] of CELLS) {
    write(address, getValue(form))
  }

  const accidentCells = form.vejo.accidentType ? ACCIDENT_TYPE_CELLS[form.vejo.accidentType] : undefined
  if (accidentCells) {
    const [checkCell, descriptionCell] = accidentCells
    write(checkCell, 'X')
    write(descriptionCell, text(form.vejo.accidentDescription))
  }

  return new Uint8Array(await workbook.xlsx.writeBuffer())
}
