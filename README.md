# Guia de Comando

Versão digital do impresso "Guia de Comando – Acidentes" (Ponto de Situação Inicial /
Reconhecimento) usado pelos bombeiros. O formulário é preenchido no telemóvel ou no
computador e o botão **Gerar Relatório** produz a folha oficial em PDF.

Feito com [Nuxt 4](https://nuxt.com) e Bootstrap 5, alojado na Vercel.

## Como funciona

- `app/pages/acidentes.vue` – o formulário, com a mesma disposição do impresso em papel
- `app/composables/useAcidentesForm.ts` – estado do formulário, localização GPS com obtenção da morada (OpenStreetMap Nominatim) e descarga do relatório
- `shared/` – tipos e formulário vazio, partilhados entre a página e a API
- `server/api/report.post.ts` – `POST /api/report`: preenche o modelo `server/assets/gca.xlsx` com os dados do formulário
  (mapa de células em `server/utils/report.ts`) e converte-o para PDF.

### Conversão para PDF

A conversão de Excel para PDF é feita pela API da [Cloudmersive](https://cloudmersive.com), que exige uma chave de API.
O plano gratuito tem um limite mensal de conversões; para um volume maior é necessária uma chave de um plano pago.
Sem chave, ou se a conversão falhar (por exemplo, por limite atingido), o relatório é descarregado em formato `.xlsx`.

## Variáveis de ambiente

| Variável | Finalidade |
| --- | --- |
| `CLOUDMERSIVE_API_KEY` (ou `NUXT_CLOUDMERSIVE_API_KEY`) | Chave da API Cloudmersive para a conversão Excel → PDF. Sem ela, os relatórios são descarregados em `.xlsx`. |

## Desenvolvimento

```bash
bun install
bun run dev         # http://localhost:3000
bun run typecheck
bun run build       # na Vercel, o preset da Vercel é detetado automaticamente
```
