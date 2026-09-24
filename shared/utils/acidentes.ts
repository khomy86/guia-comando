import type { AcidentesForm } from '../types/acidentes'

const veiculo = () => ({ quantidade: '', passageiros: '', mercadorias: '' })

export const createEmptyAcidentesForm = (): AcidentesForm => ({
  estou: {
    hrPosit: '',
    ocorrN: '',
    canalManobra: '',
    em: '',
    latitude: '',
    longitude: '',
    localidade: '',
  },
  vejo: {
    accidentType: '',
    accidentDescription: '',
    veiculos: {
      ligeiro: veiculo(),
      pesado: veiculo(),
      outros: { quantidade: '', texto: '' },
    },
    carga: { tipo: '', afetacao: '' },
    vitimas: { total: '', graves: '', leves: '' },
    encarcerados: {
      mecanico: '',
      mecanicoVeiculo: '',
      fisicoTipo1: '',
      fisicoTipo1Veiculo: '',
      fisicoTipo2: '',
      fisicoTipo2Veiculo: '',
    },
    via: {
      interdita: { checked: false, text1: '', text2: '' },
      condicionada: { checked: false, text1: '', text2: '' },
    },
    presentes: {
      vmer: false,
      autoridade: false,
      concessionaria: false,
      outro: { checked: false, texto: '' },
    },
  },
  faco: {
    sinalizacao: false,
    criacaoZonasTrabalho: false,
    abordagemVitimas: false,
    outro: { checked: false, texto: '' },
  },
  solicito: {
    vsatVsae: '',
    absc: '',
    elementoComando: false,
    outros: '',
    rottarea: '',
  },
  assumoCos: '',
})
