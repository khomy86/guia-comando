<script setup lang="ts">
import type { Directive } from 'vue'

const {
  formData,
  hrPositPlaceholder,
  isLocating,
  isGenerating,
  isDirty,
  onTimeInput,
  getCurrentLocation,
  generateReport,
} = useAcidentesForm()

const LEAVE_CONFIRMATION = 'Tem dados por guardar. Pretende sair e perder o preenchido?'

const onBeforeUnload = (event: BeforeUnloadEvent) => {
  if (isDirty()) event.preventDefault()
}
onMounted(() => window.addEventListener('beforeunload', onBeforeUnload))
onBeforeUnmount(() => window.removeEventListener('beforeunload', onBeforeUnload))
onBeforeRouteLeave(() => !isDirty() || window.confirm(LEAVE_CONFIRMATION))

const resize = (el: HTMLTextAreaElement) => {
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}
const vAutosize: Directive<HTMLTextAreaElement> = {
  mounted(el) {
    el.addEventListener('input', () => resize(el))
    if (el.value) resize(el)
  },
}

const year = new Date().getFullYear()
</script>

<template>
  <div>
    <div class="container-fluid">
      <div class="row text-dark py-3 mb-0 bg-header">
        <div class="col-12 d-flex justify-content-between align-items-center">
          <NuxtLink to="/" class="btn btn-dark ms-3">
            <i class="bi bi-arrow-left" /> Voltar
          </NuxtLink>
          <h1 class="text-center mb-2 flex-grow-1">
            <strong>Sistema de Gestão de Operações</strong><br>
            <span class="fs-2">Guia de Comando</span><br>
            <strong>Acidentes</strong>
          </h1>
          <div class="me-3 header-spacer" />
        </div>
      </div>
    </div>

    <div>
      <div class="row g-0 divider" />
      <div class="row g-0 text-white py-2 mb-0 bg-subheader">
        <div class="col-12">
          <h2 class="text-center mb-0 fs-5">Ponto de Situação Inicial / Reconhecimento</h2>
        </div>
      </div>
      <div class="row g-0 divider" />
    </div>

    <!-- ESTOU -->

    <div class="container-fluid p-0 border">
      <div class="row g-0">
        <div class="col-3 border p-2 bg-warning">
          <label for="hrPosit" class="form-label mb-1">Hr Posit:</label>
          <input
            id="hrPosit"
            :value="formData.estou.hrPosit"
            type="text"
            inputmode="numeric"
            :placeholder="hrPositPlaceholder"
            class="form-control form-control-sm"
            @input="onTimeInput"
          >
        </div>
        <div class="col-4 border p-2 bg-warning">
          <label for="ocorrN" class="form-label mb-1">Ocorr. Nº</label>
          <DigitsInput
            id="ocorrN"
            v-model="formData.estou.ocorrN"
            :max-length="5"
            allow-leading-zero
            class="form-control form-control-sm"
          />
        </div>
        <div class="col-5 border p-2 bg-warning">
          <label for="canalManobra" class="form-label mb-1">Canal Manobra:</label>
          <DigitsInput id="canalManobra" v-model="formData.estou.canalManobra" class="form-control form-control-sm" />
        </div>
      </div>
    </div>

    <div class="row g-0">
      <div class="col-1 border">
        <div class="section-label p-2 h-100 bg-warning">
          <span>ESTOU</span>
        </div>
      </div>
      <div class="col-11">
        <div class="row g-0">
          <div class="col-12 border p-2 bg-warning">
            <div class="d-flex align-items-center">
              <label for="em" class="form-label m-0 me-2">em:</label>
              <input id="em" v-model="formData.estou.em" type="text" class="form-control form-control-sm flex-grow-1">
              <button
                type="button"
                class="btn btn-primary btn-sm ms-2"
                :disabled="isLocating"
                @click="getCurrentLocation"
              >
                <span v-if="isLocating" class="spinner-border spinner-border-sm" aria-hidden="true" />
                <span v-else>Obter</span>
              </button>
            </div>
          </div>
        </div>
        <div class="row g-0">
          <div class="col-8 border p-2 bg-warning">
            <label for="latitude" class="form-label mb-1">Coord: WGS84</label>
            <div class="d-flex">
              <input id="latitude" v-model="formData.estou.latitude" type="text" placeholder="N" class="form-control form-control-sm me-1 flex-grow-1">
              <input id="longitude" v-model="formData.estou.longitude" type="text" placeholder="W" class="form-control form-control-sm flex-grow-1">
            </div>
          </div>
          <div class="col-4 border p-2 bg-warning">
            <label for="localidade" class="form-label mb-1">Localidade</label>
            <input id="localidade" v-model="formData.estou.localidade" type="text" class="form-control form-control-sm">
          </div>
        </div>
      </div>
    </div>

    <!-- VEJO -->

    <div class="row g-0">
      <div class="col-1 border">
        <div class="section-label p-2 h-100 text-white bg-vejo">
          <span>VEJO</span>
        </div>
      </div>
      <div class="col-11">
        <div class="row g-0 vejo-row vejo-acidente">
          <div class="col-1 border p-2 vertical-label">
            <span>Acidente</span>
          </div>
          <div class="col-11 border">
            <div class="row g-0">
              <div class="col-12 p-2 border-bottom">
                <select
                  v-model="formData.vejo.accidentType"
                  class="form-select"
                  aria-label="Tipo de acidente"
                  required
                >
                  <option value="1">Despiste de:</option>
                  <option value="2">Colisão entre:</option>
                  <option value="3">Outro:</option>
                </select>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-12 p-2">
                <textarea
                  id="descacidente"
                  v-model="formData.vejo.accidentDescription"
                  v-autosize
                  class="form-control"
                  rows="2"
                  placeholder="Descrição"
                  :disabled="!formData.vejo.accidentType"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="row g-0 vejo-row vejo-envolvendo">
          <div class="col-1 border p-2 vertical-label">
            <span>Envolvendo</span>
          </div>
          <div class="col-11">
            <div class="row g-0">
              <div class="col-4 border p-2">
                <div class="d-flex flex-column align-items-center justify-content-center">
                  <label for="ligeiroInput">Ligeiro</label>
                  <DigitsInput id="ligeiroInput" v-model="formData.vejo.veiculos.ligeiro.quantidade" class="form-control form-control-sm mt-2" />
                </div>
              </div>
              <div class="col-8 border p-2">
                <div class="row gx-3">
                  <div class="col-6">
                    <div class="d-flex flex-column align-items-center justify-content-center">
                      <label for="ligeiroPassageiroInput">Passageiro</label>
                      <DigitsInput id="ligeiroPassageiroInput" v-model="formData.vejo.veiculos.ligeiro.passageiros" class="form-control form-control-sm mt-2" />
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="d-flex flex-column align-items-center justify-content-center">
                      <label for="ligeiroMercadoriasInput">Mercadorias</label>
                      <DigitsInput id="ligeiroMercadoriasInput" v-model="formData.vejo.veiculos.ligeiro.mercadorias" class="form-control form-control-sm mt-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-4 border p-2">
                <div class="d-flex flex-column align-items-center justify-content-center">
                  <label for="pesadoInput">Pesado</label>
                  <DigitsInput id="pesadoInput" v-model="formData.vejo.veiculos.pesado.quantidade" class="form-control form-control-sm mt-2" />
                </div>
              </div>
              <div class="col-8 border p-2">
                <div class="row gx-3">
                  <div class="col-6">
                    <div class="d-flex flex-column align-items-center justify-content-center">
                      <label for="pesadoPassageiroInput">Passageiro</label>
                      <DigitsInput id="pesadoPassageiroInput" v-model="formData.vejo.veiculos.pesado.passageiros" class="form-control form-control-sm mt-2" />
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="d-flex flex-column align-items-center justify-content-center">
                      <label for="pesadoMercadoriasInput">Mercadorias</label>
                      <DigitsInput id="pesadoMercadoriasInput" v-model="formData.vejo.veiculos.pesado.mercadorias" class="form-control form-control-sm mt-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-4 border p-2">
                <div class="d-flex flex-column align-items-center justify-content-center">
                  <label for="outrosQuantidade">Outros</label>
                  <DigitsInput id="outrosQuantidade" v-model="formData.vejo.veiculos.outros.quantidade" class="form-control form-control-sm mt-2" />
                </div>
              </div>
              <div class="col-8 border p-2 d-flex">
                <input
                  id="outrosTexto"
                  v-model="formData.vejo.veiculos.outros.texto"
                  class="form-control form-control-sm"
                  placeholder="Descrição"
                >
              </div>
            </div>
          </div>
        </div>

        <div class="row g-0 vejo-row vejo-carga">
          <div class="col-1 border p-2 vertical-label">
            <span>Carga do Veículo</span>
          </div>
          <div class="col-11">
            <div class="row g-0">
              <div class="col-12 border p-2">
                <label for="tipocarga" class="d-block">Tipo de Carga</label>
                <textarea id="tipocarga" v-model="formData.vejo.carga.tipo" v-autosize class="form-control mt-1" rows="2" />
              </div>
            </div>
            <div class="row g-0">
              <div class="col-12 border p-2">
                <label for="afetacaocarga" class="d-block">Afetação de Carga</label>
                <textarea id="afetacaocarga" v-model="formData.vejo.carga.afetacao" v-autosize class="form-control mt-1" rows="2" />
              </div>
            </div>
          </div>
        </div>

        <div class="row g-0 vejo-row vejo-vitimas">
          <div class="col-1 border p-2 vertical-label">
            <span>Vítimas</span>
          </div>
          <div class="col-11">
            <div class="row g-0">
              <div class="col-4 border p-2">
                <label for="vitNum" class="d-block">Número</label>
                <DigitsInput id="vitNum" v-model="formData.vejo.vitimas.total" class="form-control mt-1" />
              </div>
              <div class="col-8 border p-2">
                <div class="row gx-3">
                  <div class="col-6">
                    <label for="vitGrv" class="d-block">Graves</label>
                    <DigitsInput id="vitGrv" v-model="formData.vejo.vitimas.graves" class="form-control mt-1" />
                  </div>
                  <div class="col-6">
                    <label for="vitLev" class="d-block">Leves</label>
                    <DigitsInput id="vitLev" v-model="formData.vejo.vitimas.leves" class="form-control mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-0 vejo-row vejo-encarcerados">
          <div class="col-1 border p-2 vertical-label">
            <span>Encarcerados</span>
          </div>
          <div class="col-11">
            <div class="row g-0">
              <div class="col-4 border p-2">
                <div class="d-flex flex-column align-items-center">
                  <label for="mecanico">Mecânico</label>
                  <DigitsInput id="mecanico" v-model="formData.vejo.encarcerados.mecanico" class="form-control form-control-sm mt-2 count-box" />
                </div>
              </div>
              <div class="col-8 border p-2">
                <label for="mecV" class="d-block">Veículo :</label>
                <div class="d-flex">
                  <textarea id="mecV" v-model="formData.vejo.encarcerados.mecanicoVeiculo" v-autosize class="form-control form-control-sm mt-1 flex-grow-1" rows="2" />
                </div>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-4 border p-2">
                <div class="d-flex flex-column align-items-center">
                  <label for="fistip1" class="text-center">Físico<br>Tipo 1</label>
                  <DigitsInput id="fistip1" v-model="formData.vejo.encarcerados.fisicoTipo1" class="form-control form-control-sm mt-2 count-box" />
                </div>
              </div>
              <div class="col-8 border p-2">
                <label for="ft1" class="d-block">Veículo :</label>
                <div class="d-flex">
                  <textarea id="ft1" v-model="formData.vejo.encarcerados.fisicoTipo1Veiculo" v-autosize class="form-control form-control-sm mt-1 flex-grow-1" rows="2" />
                </div>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-4 border p-2">
                <div class="d-flex flex-column align-items-center">
                  <label for="fistip2" class="text-center">Físico<br>Tipo 2</label>
                  <DigitsInput id="fistip2" v-model="formData.vejo.encarcerados.fisicoTipo2" class="form-control form-control-sm mt-2 count-box" />
                </div>
              </div>
              <div class="col-8 border p-2">
                <label for="ft2" class="d-block">Veículo :</label>
                <div class="d-flex">
                  <textarea id="ft2" v-model="formData.vejo.encarcerados.fisicoTipo2Veiculo" v-autosize class="form-control form-control-sm mt-1 flex-grow-1" rows="2" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-0 vejo-row vejo-via">
          <div class="col-1 border vertical-label">
            <span>Via / Sentido</span>
          </div>
          <div class="col-11">
            <div class="row g-0">
              <div class="col-12 p-2 border">
                <div class="d-flex justify-content-start align-items-center h-100">
                  <input id="viaInterdita" v-model="formData.vejo.via.interdita.checked" type="checkbox" class="form-check-input check-lg me-2">
                  <label for="viaInterdita">Interdita</label>
                </div>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-12 p-2 border sentido-row">
                <div class="d-flex justify-content-center align-items-center h-100">
                  <input v-model="formData.vejo.via.interdita.text1" type="text" class="form-control form-control-sm me-1 sentido-input" aria-label="Interdita - sentido 1" :disabled="!formData.vejo.via.interdita.checked">
                  <span class="mx-1">/</span>
                  <input v-model="formData.vejo.via.interdita.text2" type="text" class="form-control form-control-sm ms-1 sentido-input" aria-label="Interdita - sentido 2" :disabled="!formData.vejo.via.interdita.checked">
                </div>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-12 p-2 border">
                <div class="d-flex justify-content-start align-items-center h-100">
                  <input id="viaCondicionada" v-model="formData.vejo.via.condicionada.checked" type="checkbox" class="form-check-input check-lg me-2">
                  <label for="viaCondicionada">Condicionada</label>
                </div>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-12 p-2 border sentido-row">
                <div class="d-flex justify-content-center align-items-center h-100">
                  <input v-model="formData.vejo.via.condicionada.text1" type="text" class="form-control form-control-sm me-1 sentido-input" aria-label="Condicionada - sentido 1" :disabled="!formData.vejo.via.condicionada.checked">
                  <span class="mx-1">/</span>
                  <input v-model="formData.vejo.via.condicionada.text2" type="text" class="form-control form-control-sm ms-1 sentido-input" aria-label="Condicionada - sentido 2" :disabled="!formData.vejo.via.condicionada.checked">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-0 vejo-row vejo-presente">
          <div class="col-1 border p-2 vertical-label">
            <span>Presente</span>
          </div>
          <div class="col-11">
            <div class="row g-0">
              <div class="col-6 border p-2 d-flex align-items-center justify-content-start">
                <input id="presenteVmer" v-model="formData.vejo.presentes.vmer" type="checkbox" class="form-check-input check-lg me-2">
                <label for="presenteVmer">VMER</label>
              </div>
              <div class="col-6 border p-2 d-flex align-items-center justify-content-start">
                <input id="presenteAutoridade" v-model="formData.vejo.presentes.autoridade" type="checkbox" class="form-check-input check-lg me-2">
                <label for="presenteAutoridade">Autoridade (PSP/GNR)</label>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-12 border p-2 d-flex align-items-center justify-content-start">
                <input id="presenteConcessionaria" v-model="formData.vejo.presentes.concessionaria" type="checkbox" class="form-check-input check-lg me-2">
                <label for="presenteConcessionaria">Concessionária da Via</label>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-12 border p-2 d-flex align-items-center justify-content-start">
                <input v-model="formData.vejo.presentes.outro.checked" type="checkbox" class="form-check-input check-lg me-2" aria-label="Outro presente">
                <textarea
                  id="presenteOutro"
                  v-model="formData.vejo.presentes.outro.texto"
                  v-autosize
                  class="form-control presente-outro"
                  placeholder="Outro"
                  rows="1"
                  :disabled="!formData.vejo.presentes.outro.checked"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FAÇO -->

    <div class="container-fluid p-0 border-bottom border-start border-end">
      <div class="row g-0">
        <div class="col-1 border">
          <div class="section-label text-white p-2 h-100 bg-faco">
            <span>FAÇO</span>
          </div>
        </div>
        <div class="col-11 faco-body">
          <div class="row g-0 h-100">
            <div class="col-6 border-end">
              <div class="row g-0">
                <div class="col-12 p-2 border-bottom d-flex align-items-center faco-cell">
                  <input id="facoSinalizacao" v-model="formData.faco.sinalizacao" type="checkbox" class="form-check-input check-lg me-2">
                  <label for="facoSinalizacao">Sinalização do local</label>
                </div>
                <div class="col-12 p-2 border-bottom d-flex align-items-center faco-cell">
                  <input id="facoZonas" v-model="formData.faco.criacaoZonasTrabalho" type="checkbox" class="form-check-input check-lg me-2">
                  <label for="facoZonas">Criação zonas de trabalho</label>
                </div>
              </div>
            </div>

            <div class="col-6">
              <div class="row g-0 h-100">
                <div class="col-12 p-2 border-bottom d-flex align-items-center faco-cell">
                  <input id="facoAbordagem" v-model="formData.faco.abordagemVitimas" type="checkbox" class="form-check-input check-lg me-2">
                  <label for="facoAbordagem">Abordagem às vítimas</label>
                </div>
                <div class="col-12 p-2 d-flex align-items-center flex-grow-1 faco-cell">
                  <input id="facoOutroCheck" v-model="formData.faco.outro.checked" type="checkbox" class="form-check-input check-lg me-2">
                  <label for="facoOutroCheck" class="me-2">Outro:</label>
                  <textarea
                    id="facoOutro"
                    v-model="formData.faco.outro.texto"
                    v-autosize
                    class="form-control form-control-sm flex-grow-1 faco-outro"
                    aria-label="Outro"
                    :disabled="!formData.faco.outro.checked"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SOLICITO -->

    <div class="container-fluid p-0 border-bottom border-start border-end">
      <div class="row g-0">
        <div class="col-1 border bg-solicito">
          <div class="section-label text-white p-2 h-100">
            <span>SOLICITO</span>
          </div>
        </div>

        <div class="col-11 solicito-body">
          <div class="row g-0">
            <div class="col-1 border">
              <div class="p-2 h-100 d-flex align-items-center justify-content-center">
                <span class="vertical-label">(quantificar)</span>
              </div>
            </div>

            <div class="col-11">
              <div class="row g-0">
                <div class="col-6 p-2 border d-flex justify-content-between align-items-center">
                  <label for="vsatvsae">VSAT / VSAE</label>
                  <DigitsInput id="vsatvsae" v-model="formData.solicito.vsatVsae" class="form-control form-control-sm quantity-input" />
                </div>
                <div class="col-6 p-2 border d-flex justify-content-between align-items-center">
                  <label for="absc">ABSC</label>
                  <DigitsInput id="absc" v-model="formData.solicito.absc" class="form-control form-control-sm quantity-input" />
                </div>

                <div class="col-12 p-2 border d-flex align-items-center">
                  <label for="elementoComando">Elemento Comando</label>
                  <div class="ms-2 d-flex align-items-center">
                    <input id="elementoComando" v-model="formData.solicito.elementoComando" type="checkbox" class="form-check-input check-lg m-0">
                  </div>
                </div>
              </div>
              <div class="row g-0">
                <div class="col-12 p-2 border d-flex align-items-center">
                  <label for="solicitoOutro" class="me-2">Outros:</label>
                  <textarea id="solicitoOutro" v-model="formData.solicito.outros" v-autosize class="form-control flex-grow-1 min-w-0" rows="1" />
                </div>
              </div>
            </div>
          </div>

          <div class="row g-0">
            <div class="col-12">
              <div class="row g-0">
                <div class="col-2 p-2 border d-flex justify-content-center align-items-center">
                  <div class="logo-box">
                    <img src="/assets/images/srtnd.png" alt="srtnd">
                  </div>
                </div>
                <div class="col-10 p-2 border d-flex align-items-center">
                  <textarea id="rottarea" v-model="formData.solicito.rottarea" v-autosize class="form-control flex-grow-1 min-w-0" rows="2" aria-label="SRTND" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid p-0 border-bottom border-start border-end bg-cos">
      <div class="row g-0">
        <div class="col-4 p-2 border">
          <label for="assumoCos" class="fw-bold">Assumo COS</label>
        </div>
        <div class="col-8 p-2 border">
          <input id="assumoCos" v-model="formData.assumoCos" type="text" class="form-control text-secondary" placeholder="Categoria e Nome">
        </div>
      </div>
      <div class="row g-0">
        <div class="col-12 p-2 border text-center">
          <strong>Prossigo com o reconhecimento!</strong>
          <div class="mt-2">
            <button type="button" class="btn btn-primary" :disabled="isGenerating" @click="generateReport">
              Gerar Relatório
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="position-fixed bottom-0 end-0 pe-3 pb-1 z-1 fs-6 text-muted pe-none">
      &copy; {{ year }} Todos os direitos reservados
    </div>

    <div v-if="isGenerating" class="loading-overlay" role="status" aria-live="polite">
      <div class="loading-box">A gerar relatório...</div>
    </div>
  </div>
</template>

<style scoped>
/* Palette taken from the paper form */
.bg-header { background-color: #ffc023; }
.bg-subheader { background-color: #1f497d; }
.bg-vejo { background-color: #921a25; }
.bg-faco { background-color: #16365c; }
.bg-solicito { background-color: #2e8540; }
.bg-cos { background-color: #ffde21; }

.vejo-row { color: white; }
.vejo-acidente { background-color: #e3616e; }
.vejo-envolvendo { background-color: #d75663; }
.vejo-carga { background-color: #cb4c59; }
.vejo-vitimas { background-color: #c0424e; }
.vejo-encarcerados { background-color: #b43844; }
.vejo-via { background-color: #a92e39; }
.vejo-presente { background-color: #9d242f; }

.faco-body { background-color: #80c8ff; color: black; }
.solicito-body { background-color: #8ade64; color: black; }

.header-spacer { width: 80px; }

.divider {
  background-color: black;
  height: 5px;
}

.section-label {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.section-label > span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-90deg);
  white-space: nowrap;
  font-weight: bold;
}

.vertical-label {
  display: flex;
  align-items: center;
  justify-content: center;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  white-space: nowrap;
}

.check-lg {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.count-box { width: 50px; height: 30px; }
.sentido-row { height: 50px; }
.sentido-input { width: 40%; }
.quantity-input { width: 60px; }
.presente-outro { width: calc(100% - 30px); }
.faco-cell { min-height: 100px; }
.faco-outro { min-height: 40px; }
.min-w-0 { min-width: 0; }

.logo-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo-box > img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.form-control:disabled {
  background-color: #e9ecef;
  opacity: 0.65;
}

textarea {
  resize: none;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}
.loading-box {
  background: white;
  padding: 20px;
  border-radius: 5px;
}
</style>
