<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h2 class="text-center mb-0">Guia de Comando</h2>
          </div>
          <div class="card-body">
            <div class="d-grid gap-3">
              <NuxtLink to="/acidentes" class="btn btn-lg btn-primary">Acidentes</NuxtLink>
              <button class="btn btn-lg btn-success">Botão 2</button>
              <button class="btn btn-lg btn-info text-white">Botão 3</button>
              <button class="btn btn-lg btn-warning">Botão 4</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn {
  padding: 15px;
  font-size: 1.2rem;
  font-weight: 500;
}
</style> 