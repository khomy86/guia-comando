interface NominatimAddress {
  road?: string
  street?: string
  house_number?: string
  suburb?: string
  neighbourhood?: string
  hamlet?: string
  city?: string
  town?: string
  village?: string
  postcode?: string
  country?: string
}

const GEOLOCATION_ERRORS: Record<number, string> = {
  1: 'Acesso à localização negado. Ative os serviços de localização.',
  2: 'Localização indisponível. Tente novamente mais tarde.',
  3: 'O pedido de localização expirou. Tente novamente.',
}

const getPosition = () => new Promise<GeolocationPosition>((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(resolve, reject, {
    enableHighAccuracy: true,
    timeout: 10_000,
    maximumAge: 0,
  })
})

const formatAddress = (address: NominatimAddress) => {
  const city = address.city || address.town || address.village || ''
  const suburb = address.suburb || address.neighbourhood || address.hamlet || ''

  let street = address.road || address.street || ''
  if (address.house_number) street = [street, `N${address.house_number}`].filter(Boolean).join(' ')
  if (suburb) street = [street, suburb].filter(Boolean).join(', ')

  const full = [street, city, address.postcode, address.country].filter(Boolean).join(', ')
  return { full, city }
}

export function useAcidentesForm() {
  const formData = ref<AcidentesForm>(createEmptyAcidentesForm())
  const hrPositPlaceholder = ref('')
  const isLocating = ref(false)
  const isGenerating = ref(false)

  let pristine = ''

  onMounted(() => {
    // Done on the client: the server's clock/timezone is not the user's
    const now = currentTime()
    hrPositPlaceholder.value = now
    formData.value.estou.hrPosit = now
    pristine = JSON.stringify(formData.value)
  })

  const isDirty = () => pristine !== '' && JSON.stringify(formData.value) !== pristine

  const onTimeInput = (event: Event) => {
    const input = event.target as HTMLInputElement
    const value = formatTimeInput(input.value)
    input.value = value
    formData.value.estou.hrPosit = value
  }

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const data = await $fetch<{ address?: NominatimAddress }>('https://nominatim.openstreetmap.org/reverse', {
        query: { format: 'json', lat, lon, zoom: 18, addressdetails: 1 },
        headers: { 'Accept-Language': 'pt-PT,pt;q=0.9,en;q=0.8' },
      })
      if (!data.address) throw new Error('No address in response')

      const { full, city } = formatAddress(data.address)
      formData.value.estou.em = full
      formData.value.estou.localidade = city
    }
    catch (error) {
      console.error('Geocoding error:', error)
      alert('Coordenadas obtidas, mas não foi possível obter a morada.')
    }
  }

  const getCurrentLocation = async () => {
    if (isLocating.value) return
    if (!('geolocation' in navigator)) {
      alert('Geolocalização não suportada neste dispositivo.')
      return
    }

    isLocating.value = true
    try {
      const { coords } = await getPosition()
      formData.value.estou.latitude = toDMS(coords.latitude, true)
      formData.value.estou.longitude = toDMS(coords.longitude, false)
      await reverseGeocode(coords.latitude, coords.longitude)
    }
    catch (error) {
      console.error('Geolocation error:', error)
      const code = (error as GeolocationPositionError).code
      alert(GEOLOCATION_ERRORS[code] ?? 'Erro ao obter a localização.')
    }
    finally {
      isLocating.value = false
    }
  }

  const generateReport = async () => {
    if (isGenerating.value) return
    isGenerating.value = true
    try {
      const body: ReportRequest = { ...formData.value, hrPositPlaceholder: hrPositPlaceholder.value }
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)

      // The server falls back to Excel when the PDF conversion is unavailable
      const isPdf = response.headers.get('content-type')?.includes('application/pdf') ?? false
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      downloadBlob(await response.blob(), `report-${timestamp}.${isPdf ? 'pdf' : 'xlsx'}`)

      if (!isPdf) alert('Não foi possível gerar o PDF. O relatório foi descarregado em formato Excel.')
    }
    catch (error) {
      console.error('Error generating report:', error)
      alert(`Erro ao gerar o relatório: ${(error as Error).message}`)
    }
    finally {
      isGenerating.value = false
    }
  }

  return {
    formData,
    hrPositPlaceholder,
    isLocating,
    isGenerating,
    isDirty,
    onTimeInput,
    getCurrentLocation,
    generateReport,
  }
}
