export type AccidentType = '' | '1' | '2' | '3'

export interface CheckWithText {
  checked: boolean
  texto: string
}

export interface ViaEstado {
  checked: boolean
  text1: string
  text2: string
}

export interface VeiculoCounts {
  quantidade: string
  passageiros: string
  mercadorias: string
}

export interface AcidentesForm {
  estou: {
    hrPosit: string
    ocorrN: string
    canalManobra: string
    em: string
    latitude: string
    longitude: string
    localidade: string
  }
  vejo: {
    accidentType: AccidentType
    accidentDescription: string
    veiculos: {
      ligeiro: VeiculoCounts
      pesado: VeiculoCounts
      outros: { quantidade: string, texto: string }
    }
    carga: { tipo: string, afetacao: string }
    vitimas: { total: string, graves: string, leves: string }
    encarcerados: {
      mecanico: string
      mecanicoVeiculo: string
      fisicoTipo1: string
      fisicoTipo1Veiculo: string
      fisicoTipo2: string
      fisicoTipo2Veiculo: string
    }
    via: {
      interdita: ViaEstado
      condicionada: ViaEstado
    }
    presentes: {
      vmer: boolean
      autoridade: boolean
      concessionaria: boolean
      outro: CheckWithText
    }
  }
  faco: {
    sinalizacao: boolean
    criacaoZonasTrabalho: boolean
    abordagemVitimas: boolean
    outro: CheckWithText
  }
  solicito: {
    vsatVsae: string
    absc: string
    elementoComando: boolean
    outros: string
    rottarea: string
  }
  assumoCos: string
}

/** Body of POST /api/report */
export interface ReportRequest extends AcidentesForm {
  /** Time the form was opened (HH:MM), used when hrPosit is left empty */
  hrPositPlaceholder?: string
}
