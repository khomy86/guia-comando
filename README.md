# Guia de Comando

Digital version of the firefighters' "Guia de Comando – Acidentes" paper form
(Ponto de Situação Inicial / Reconhecimento). The form is filled in on a phone or
desktop, and **Gerar Relatório** produces the official sheet as a PDF.

Built with [Nuxt 4](https://nuxt.com) + Bootstrap 5, deployed on Vercel.

## How it works

- `app/pages/acidentes.vue` – the form, laid out like the paper version
- `app/composables/useAcidentesForm.ts` – form state, GPS location + reverse geocoding (OpenStreetMap Nominatim), report download
- `shared/` – form types and the empty-form factory, used by both the page and the API
- `server/api/report.post.ts` – `POST /api/report`: fills `server/assets/gca.xlsx` with the form data
  (cell map in `server/utils/report.ts`) and converts it to PDF with Cloudmersive.
  If the conversion isn't available it returns the `.xlsx` instead.

## Environment

| Variable | Purpose |
| --- | --- |
| `CLOUDMERSIVE_API_KEY` (or `NUXT_CLOUDMERSIVE_API_KEY`) | Cloudmersive API key for Excel → PDF. Without it, reports download as `.xlsx`. |

## Development

```bash
bun install
bun run dev         # http://localhost:3000
bun run typecheck
bun run build       # Vercel preset is picked automatically when building on Vercel
```
