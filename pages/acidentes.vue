<template>
  <!-- Main application content - removing the NuxtPage that was causing conflicts -->
  <div class="container-fluid">
    <div class="row text-dark py-3 mb-0" style="background-color: #ffc023;">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <NuxtLink to="/" class="btn btn-dark ms-3">
          <i class="bi bi-arrow-left"></i> Voltar
        </NuxtLink>
        <h1 class="text-center mb-2 flex-grow-1">
          <strong>Sistema de Gestão de Operações</strong><br>
          <span class="fs-2">Guia de Comando</span><br>
          <strong>Acidentes</strong>
        </h1>
        <div class="me-3" style="width: 80px;"></div> <!-- Spacer for balance -->
      </div>
    </div>
  </div>

  <div>
    <div class="row" style="background-color: black; height: 5px;"></div>
    <div class="row text-white py-2 mb-0" style="background-color: #1f497d;">
      <div class="col-12">
        <h2 class="text-center mb-0 fs-5">Ponto de Situação Inicial / Reconhecimento</h2>
      </div>
    </div>
    <div class="row" style="background-color: black; height: 5px;"></div>
  </div>


   <!-- ESTOU section --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  

  <div class="container-fluid p-0 border">


    <div class="row g-0">
      <div class="col-3 border p-2 bg-warning">
        <label for="hrPosit" class="form-label mb-1">Hr Posit:</label>
        <input 
          type="text" 
          id="hrPosit" 
          v-model="formData.estou.hrPosit" 
          :placeholder="hrPositPlaceholder" 
          @input="validateTime" 
          class="form-control form-control-sm"
        >
      </div>
      <div class="col-4 border p-2 bg-warning">
        <label for="ocorrN" class="form-label mb-1">Ocorr. Nº</label>
        <input 
          id="ocorrN" 
          class="form-control form-control-sm"
          v-model="formData.estou.ocorrN"
        >
      </div>
      <div class="col-5 border p-2 bg-warning">
        <label for="canalManobra" class="form-label mb-1">Canal Manobra:</label>
        <input 
          id="canalManobra" 
          class="form-control form-control-sm"
          v-model="formData.estou.canalManobra"
        >
      </div>
    </div>
    </div>
  
  

    <div class="row g-0">
      <div class="col-1 border">
        <div class="p-2 h-100 d-flex align-items-center justify-content-center bg-warning" style="position: relative;">
          <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-90deg); white-space: nowrap; font-weight: bold;">ESTOU</span>
        </div>
      </div>
      <div class="col-11">
        <div class="row g-0">
          <div class="col-12 border p-2 bg-warning">
            <div class="d-flex align-items-center">
              <label for="em" class="form-label m-0 me-2">em:</label>
              <input type="text" id="em" class="form-control form-control-sm flex-grow-1" v-model="formData.estou.em">
              <button id="getLocationBtn" class="btn btn-primary btn-sm ms-2" @click="getCurrentLocation">Obter</button>
            </div>
          </div>
        </div>
        <div class="row g-0">
          <div class="col-8 border p-2 bg-warning">
            <label for="latitude" class="form-label mb-1">Coord: WGS84</label>
            <div class="d-flex">
              <input type="text" id="latitude" placeholder="N" class="form-control form-control-sm me-1 flex-grow-1" v-model="formData.estou.latitude">
              <input type="text" id="longitude" placeholder="W" class="form-control form-control-sm flex-grow-1" v-model="formData.estou.longitude">
            </div>
          </div>
          <div class="col-4 border p-2 bg-warning">
            <label for="localidade" class="form-label mb-1">Localidade</label>
            <input type="text" id="localidade" class="form-control form-control-sm" v-model="formData.estou.localidade">
          </div>
        </div>
      </div>
    </div>


    <!-- VEJO section --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->


    <div class="row g-0">
      <div class="col-1 border">
        <div class="p-2 h-100 d-flex align-items-center justify-content-center text-white" style="position: relative; background-color: #921A25;">
          <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-90deg); white-space: nowrap; font-weight: bold;">VEJO</span>
        </div>
      </div>
      <div class="col-11">
        <div class="row g-0" style="background-color: #E3616E; color: white">
          <div class="col-1 border p-2 d-flex align-items-center justify-content-center" style="writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg); white-space: nowrap;">
            <span>Acidente</span>
          </div>
          <div class="col-11 border">
            <div class="row g-0">
              <div class="col-12 p-2 border-bottom">
                <select 
                  v-model="formData.vejo.accidentType" 
                  class="form-select" 
                  aria-label="Accident type selector" 
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
                  class="form-control"
                  rows="2"
                  placeholder="Descrição"
                  :disabled="!formData.vejo.accidentType"
                  v-model="formData.vejo.accidentDescription"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      
        <div class="row g-0" style="background-color: #D75663; color:white ">
          <div class="col-1 border p-2 d-flex align-items-center justify-content-center" style="writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg); white-space: nowrap;">
            <span>Envolvendo</span>
          </div>
          <div class="col-11">
            <div class="row g-0">
              <div class="col-4 border p-2">
                <div class="d-flex flex-column align-items-center justify-content-center">
                  <span>Ligeiro</span>
                  <input 
                    type="number"
                    class="form-control form-control-sm mt-2"
                    v-model.number="formData.vejo.veiculos.ligeiro.quantidade"
                  > 
                </div>
              </div>
              <div class="col-8 border p-2">
                <div class="row">
                  <div class="col-6">
                    <div class="d-flex flex-column align-items-center justify-content-center">
                      <span>Passageiro</span>
                      <input type="number" class="form-control form-control-sm mt-2" id="ligeiroPassageiroInput" v-model="formData.vejo.veiculos.ligeiro.passageiros">
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="d-flex flex-column align-items-center justify-content-center">
                      <span>Mercadorias</span>
                      <input type="number" class="form-control form-control-sm mt-2" id="ligeiroMercadoriasInput" v-model="formData.vejo.veiculos.ligeiro.mercadorias">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-4 border p-2">
                <div class="d-flex flex-column align-items-center justify-content-center">
                  <span>Pesado</span>
                  <input type="number" class="form-control form-control-sm mt-2" id="pesadoInput" v-model="formData.vejo.veiculos.pesado.quantidade">
                </div>
              </div>
              <div class="col-8 border p-2">
                <div class="row">
                  <div class="col-6">
                    <div class="d-flex flex-column align-items-center justify-content-center">
                      <span>Passageiro</span>
                      <input type="number" class="form-control form-control-sm mt-2" id="pesadoPassageiroInput" v-model="formData.vejo.veiculos.pesado.passageiros">
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="d-flex flex-column align-items-center justify-content-center">
                      <span>Mercadorias</span>
                      <input type="number" class="form-control form-control-sm mt-2" id="pesadoMercadoriasInput" v-model="formData.vejo.veiculos.pesado.mercadorias">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-4 border p-2">
                <div class="d-flex flex-column align-items-center justify-content-center">
                  <span>Outros</span>
                  <input 
                    type="number"
                    id="outrosQuantidade"
                    class="form-control form-control-sm mt-2"
                    v-model="formData.vejo.veiculos.outros.quantidade"
                  >
                </div>
              </div>
              <div class="col-8 border p-2 d-flex">
                <input 
                  id="outrosTexto"
                  class="form-control form-control-sm"
                  placeholder="Descrição"
                  v-model="formData.vejo.veiculos.outros.texto"
                >
              </div>
            </div>
          </div>
        </div>

        <div class="row g-0" style="background-color: #CB4C59; color:white">
          <div class="col-1 border p-2 d-flex align-items-center justify-content-center" style="writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg); white-space: nowrap;">
            <span>Carga do Veículo</span>
          </div>
          <div class="col-11">
            <div class="row g-0">
              <div class="col-12 border p-2">
                <div>Tipo de Carga</div>
                <textarea
                  id="tipocarga"
                  class="form-control mt-1" 
                  rows="2"
                  v-model="formData.vejo.carga.tipo"
                ></textarea>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-12 border p-2">
                <div>Afetação de Carga</div>
                <textarea 
                  id="afetacaocarga"
                  class="form-control mt-1" 
                  rows="2"
                  v-model="formData.vejo.carga.afetacao"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-0" style="background-color: #C0424E; color:white">
          <div class="col-1 border p-2 d-flex align-items-center justify-content-center" style="writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg); white-space: nowrap;">
            <span>Vítimas</span>
          </div>
          <div class="col-11">
            <div class="row g-0">
              <div class="col-4 border p-2">
                <div>Número</div>
                <input
                  id="vitNum"
                  class="form-control mt-1"
                  v-model="formData.vejo.vitimas.total"
                >
              </div>
              <div class="col-8 border p-2">
                <div class="row">
                  <div class="col-6">
                    <div>Graves</div>
                    <input 
                      id="vitGrv"
                      class="form-control mt-1"
                      v-model="formData.vejo.vitimas.graves"
                    >
                  </div>
                  <div class="col-6">
                    <div>Leves</div>
                    <input
                      id="vitLev"
                      class="form-control mt-1"
                      v-model="formData.vejo.vitimas.leves"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-0" style="background-color: #B43844; color: white">
          <div class="col-1 border p-2 d-flex align-items-center justify-content-center" style="writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg); white-space: nowrap;">
            <span>Encarcerados</span>
          </div>
          <div class="col-11">
            <div class="row g-0">
              <div class="col-4 border p-2">
                <div class="d-flex flex-column align-items-center">
                  <span>Mecânico</span>
                  <input
                    id="mecanico"
                    class="form-control form-control-sm mt-2" 
                    style="width: 50px; height: 30px;"
                    v-model="formData.vejo.encarcerados.mecanico"
                  >
                </div>
              </div>
              <div class="col-8 border p-2">
                <div>Veículo :</div>
                <div class="d-flex">
                  <textarea 
                    id="mecV"
                    class="form-control form-control-sm mt-1 flex-grow-1" 
                    rows="2"
                    v-model="formData.vejo.encarcerados.mecanicoVeiculo"
                  ></textarea>
                </div>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-4 border p-2">
                <div class="d-flex flex-column align-items-center">
                  <div class="text-center">Físico<br>Tipo 1</div>
                  <input
                    id="fistip1"
                    class="form-control form-control-sm mt-2" 
                    style="width: 50px; height: 30px;"
                    v-model="formData.vejo.encarcerados.fisicoTipo1"
                  >
                </div>
              </div>
              <div class="col-8 border p-2">
                <div>Veículo :</div>
                <div class="d-flex">
                  <textarea
                    id="ft1"
                    class="form-control form-control-sm mt-1 flex-grow-1" 
                    rows="2"
                    v-model="formData.vejo.encarcerados.fisicoTipo1Veiculo"
                  ></textarea>
                </div>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-4 border p-2">
                <div class="d-flex flex-column align-items-center">
                  <div class="text-center">Físico<br>Tipo 2</div>
                  <input
                    id="fistip2"
                    class="form-control form-control-sm mt-2" 
                    style="width: 50px; height: 30px;"
                    v-model="formData.vejo.encarcerados.fisicoTipo2"
                  >
                </div>
              </div>
              <div class="col-8 border p-2">
                <div>Veículo :</div>
                <div class="d-flex">
                  <textarea 
                    id="ft2"
                    class="form-control form-control-sm mt-1 flex-grow-1" 
                    rows="2"
                    v-model="formData.vejo.encarcerados.fisicoTipo2Veiculo"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-0" style="background-color: #A92E39; color: white;">
          <div class="col-1 border d-flex align-items-center justify-content-center" style="writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg); white-space: nowrap;">
            <span>Via / Sentido</span>
          </div>
          <div class="col-11">
            <div class="row g-0">
              <div class="col-12 p-2 border">
                <div class="d-flex justify-content-start align-items-center h-100">
                  <input type="checkbox" class="form-check-input me-2" style="width: 20px; height: 20px;" v-model="formData.vejo.via.interdita.checked">
                  <span>Interdita</span>
                </div>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-12 p-2 border" style="height: 50px;">
                <div class="d-flex justify-content-center align-items-center h-100">
                  <input type="text" class="form-control form-control-sm me-1" style="width: 40%;" v-model="formData.vejo.via.interdita.text1" :disabled="!formData.vejo.via.interdita.checked">
                  <span class="mx-1">/</span>
                  <input type="text" class="form-control form-control-sm ms-1" style="width: 40%;" v-model="formData.vejo.via.interdita.text2" :disabled="!formData.vejo.via.interdita.checked">
                </div>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-12 p-2 border">
                <div class="d-flex justify-content-start align-items-center h-100">
                  <input type="checkbox" class="form-check-input me-2" style="width: 20px; height: 20px;" v-model="formData.vejo.via.condicionada.checked">
                  <span>Condicionada</span>
                </div>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-12 p-2 border" style="height: 50px;">
                <div class="d-flex justify-content-center align-items-center h-100">
                  <input type="text" class="form-control form-control-sm me-1" style="width: 40%;" v-model="formData.vejo.via.condicionada.text1" :disabled="!formData.vejo.via.condicionada.checked">
                  <span class="mx-1">/</span>
                  <input type="text" class="form-control form-control-sm ms-1" style="width: 40%;" v-model="formData.vejo.via.condicionada.text2" :disabled="!formData.vejo.via.condicionada.checked">
                </div>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-12 p-2 border">
                <div class="d-flex justify-content-start align-items-center h-100">
                  <span class="me-2">Nº de faixas obstruidas:</span>
                  <input 
                    id="faixaobstr"
                    class="form-control form-control-sm" 
                    style="width: 80px;"
                    v-model="formData.vejo.via.faixasObstruidas"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="row g-0" style="background-color: #9D242F ; color: white;">
          <div class="col-1 border p-2 d-flex align-items-center justify-content-center" style="writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg); white-space: nowrap;">
            <span>Presente</span>
          </div>
          <div class="col-11">
            <div class="row g-0">
              <div class="col-6 border p-2 d-flex align-items-center justify-content-start">
                <input 
                  type="checkbox" 
                  class="form-check-input me-2" 
                  style="width: 20px; height: 20px;"
                  v-model="formData.vejo.presentes.vmer"
                >
                <span>VMER</span>
              </div>
              <div class="col-6 border p-2 d-flex align-items-center justify-content-start">
                <input 
                  type="checkbox" 
                  class="form-check-input me-2" 
                  style="width: 20px; height: 20px;"
                  v-model="formData.vejo.presentes.autoridade"
                >
                <span>Autoridade (PSP/GNR)</span>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-12 border p-2 d-flex align-items-center justify-content-start">
                <input 
                  type="checkbox" 
                  class="form-check-input me-2" 
                  style="width: 20px; height: 20px;"
                  v-model="formData.vejo.presentes.concessionaria"
                >
                <span>Concessionária da Via</span>
              </div>
            </div>
            <div class="row g-0">
              <div class="col-12 border p-2 d-flex align-items-center justify-content-start">
                <input 
                  type="checkbox" 
                  class="form-check-input me-2" 
                  style="width: 20px; height: 20px;"
                  v-model="formData.vejo.presentes.outro.checked"
                >
                <textarea
                  id="presenteOutro" 
                  class="form-control" 
                  placeholder="Outro" 
                  style="width: calc(100% - 30px); resize: none"
                  rows="1"
                  v-model="formData.vejo.presentes.outro.texto"
                  :disabled="!formData.vejo.presentes.outro.checked"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- FAÇO section --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->


    <div class="container-fluid p-0 border-bottom border-start border-end">
      <div class="row g-0">
        <div class="col-1 border">
          <div class="text-white p-2 h-100 d-flex align-items-center justify-content-center" style="background-color: #16365c; position: relative;">
            <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-90deg); white-space: nowrap; font-weight: bold;">FAÇO</span>
          </div>
        </div>
        <div class="col-11" style="background-color: #80c8ff; color: black;">
          <div class="row g-0 h-100">
            <!-- Left Column -->
            <div class="col-6 border-end">
              <div class="row g-0">
                <div class="col-12 p-2 border-bottom d-flex align-items-center" style="min-height: 100px;">
                  <input 
                    type="checkbox" 
                    class="form-check-input me-2" 
                    style="width: 20px; height: 20px;"
                    v-model="formData.faco.sinalizacao"
                  >
                  <span>Sinalização do local</span>
                </div>
                <div class="col-12 p-2 border-bottom d-flex align-items-center" style="min-height: 100px;">
                  <input 
                    type="checkbox" 
                    class="form-check-input me-2" 
                    style="width: 20px; height: 20px;"
                    v-model="formData.faco.criacaoZonasTrabalho"
                  >
                  <span>Criação zonas de trabalho</span>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="col-6">
              <div class="row g-0 h-100">
                <div class="col-12 p-2 border-bottom d-flex align-items-center" style="min-height: 100px;">
                  <input 
                    type="checkbox" 
                    class="form-check-input me-2" 
                    style="width: 20px; height: 20px;"
                    v-model="formData.faco.abordagemVitimas"
                  >
                  <span>Abordagem às vítimas</span>
                </div>
                <div class="col-12 p-2 d-flex align-items-center flex-grow-1" style="min-height: 100px;">
                  <input 
                    type="checkbox" 
                    class="form-check-input me-2" 
                    style="width: 20px; height: 20px;"
                    v-model="formData.faco.outro.checked"
                  >
                  <span class="me-2">Outro:</span>
                  <textarea 
                    id="facoOutro" 
                    class="form-control form-control-sm flex-grow-1" 
                    style="min-height: 40px;"
                    v-model="formData.faco.outro.texto" 
                    :disabled="!formData.faco.outro.checked"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


     <!-- Solicito section --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->


    <div class="container-fluid p-0 border-bottom border-start border-end">
      <div class="row g-0">
        <div class="col-1 border" style="background-color: #2e8540;">
          <div class="text-white p-2 h-100 d-flex align-items-center justify-content-center" style="position: relative;">
            <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-90deg); white-space: nowrap; font-weight: bold;">SOLICITO</span>
          </div>
        </div>

    
        <div class="col-11" style="background-color: #8ade64  ; color: black;">
          <div class="row g-0">
           
            <div class="col-1 border">
              <div class="text-white p-2 h-100 d-flex align-items-center justify-content-center">
                <span style="writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg); white-space: nowrap; display: flex; align-items: center; justify-content: center; color: black;">(quantificar)</span>
              </div>
            </div>
            
            
            <div class="col-11">
              <div class="row g-0">
                <div class="col-6 p-2 border d-flex justify-content-between align-items-center">
                  <span>VSAT / VSAE</span>
                  <input
                    id="vsatvsae"
                    class="form-control form-control-sm" 
                    style="width: 60px;"
                    v-model="formData.solicito.vsatVsae"
                  >
                </div>
                <div class="col-6 p-2 border d-flex justify-content-between align-items-center">
                  <span>ABSC</span>
                  <input
                    id="absc"
                    class="form-control form-control-sm" 
                    style="width: 60px;"
                    v-model="formData.solicito.absc"
                  >
                </div>
              
                <div class="col-12 p-2 border d-flex align-items-center">
                  <span>Elemento Comando</span>
                  <div class="ms-2 d-flex align-items-center">
                    <input type="checkbox" class="form-check-input" style="width: 20px; height: 20px; margin: 0; cursor: pointer;" v-model="formData.solicito.elementoComando">
                  </div>
                </div>
              </div>
              <div class="row g-0">
                <div class="col-12 p-2 border d-flex align-items-center">
                  <span class="me-2">Outros:</span>
                  <textarea id="solicitoOutro" class="form-control flex-grow-1" rows="1" style="min-width: 0;" v-model="formData.solicito.outros"></textarea>
                </div>
              </div>
            </div>
          </div>

          
          <div class="row g-0">
            <div class="col-12">
              <div class="row g-0">
                <div class="col-2 p-2 border d-flex justify-content-center align-items-center" 
                    style="color: white;">
                  <div style="width: 100%; height: 100%; position: relative; display: flex; justify-content: center; align-items: center;">
                    <img src="/assets/images/srtnd.png" alt="srtnd" 
                        style="max-width: 100%; max-height: 100%; object-fit: contain;">
                    </div>
                  </div>
                  <div class="col-10 p-2 border d-flex align-items-center">
                  <textarea id="rottarea" class="form-control flex-grow-1" rows="2" style="min-width: 0;" v-model="formData.solicito.rottarea"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid p-0 border-bottom border-start border-end" style="background-color: #FFDE21;">
      <div class="row g-0">
        <div class="col-4 p-2 border">
          <strong>Assumo COS</strong>
        </div>
        <div class="col-8 p-2 border">
          <input type="text" class="form-control" placeholder="Categoria e Nome" style="color: #6c757d;" v-model="formData.assumoCos">
        </div>
      </div>
      <div class="row g-0">
        <div class="col-12 p-2 border text-center">
          <strong>Prossigo com o reconhecimento!</strong>
          <div class="mt-2">
            <button class="btn btn-primary" @click="logFormData">Gerar Relatório</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add copyright notice here -->
    <div class="position-fixed bottom-0 end-0 pe-3 pb-1 z-1 fs-6 text-muted">
      &copy; {{ new Date().getFullYear() }} Todos os direitos reservados
    </div>

</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { useAcidentesForm } from '~/composables/useAcidentesForm';

// Use the acidentes form composable with destructuring for better performance
const { 
  formData, 
  hrPositPlaceholder, 
  validateTime, 
  getCurrentLocation, 
  logFormData,
  initializeForm
} = useAcidentesForm();

// Initialize form on component mount and add cleanup on unmount
onMounted(() => {
  initializeForm();
  
  // Add event listener for beforeunload to prevent accidental navigation
  window.addEventListener('beforeunload', handleBeforeUnload);
});

// Clean up event listeners on component unmount
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

// Prevent accidental navigation away from form
const handleBeforeUnload = (e) => {
  // Check if form has data
  const hasData = Object.values(formData.value).some(section => {
    if (typeof section === 'object') {
      return Object.values(section).some(value => 
        value !== '' && value !== false && value !== null && value !== undefined
      );
    }
    return section !== '' && section !== false && section !== null && section !== undefined;
  });
  
  if (hasData) {
    e.preventDefault();
    e.returnValue = '';
    return '';
  }
};
</script>

<style scoped>
.card-header {
  padding: 1rem;
}

/* Additional styles for the form */
input[type="checkbox"] {
  cursor: pointer;
}

.form-control:disabled {
  background-color: #e9ecef;
  opacity: 0.65;
}

textarea {
  resize: none;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}
</style> 