import { ref, onMounted } from 'vue'

export const useAcidentesForm = () => {
  // Form data structure
  const formData = ref({
    estou: {
      hrPosit: '',
      ocorrN: '',
      canalManobra: '',
      em: '',
      latitude: '',
      longitude: '',
      localidade: ''
    },
    vejo: {
      accidentType: '',
      accidentDescription: '',
      veiculos: {
        ligeiro: { quantidade: '', passageiros: '', mercadorias: '' },
        pesado: { quantidade: '', passageiros: '', mercadorias: '' },
        outros: {
          quantidade: '',
          texto: ''
        }
      },
      carga: {
        tipo: '',
        afetacao: ''
      },
      vitimas: {
        total: '',
        graves: '',
        leves: ''
      },
      encarcerados: {
        mecanico: '',
        mecanicoVeiculo: '',
        fisicoTipo1: '',
        fisicoTipo1Veiculo: '',
        fisicoTipo2: '',
        fisicoTipo2Veiculo: ''
      },
      via: {
        interdita: {
          checked: false,
          text1: '',
          text2: ''
        },
        condicionada: {
          checked: false,
          text1: '',
          text2: ''
        },
        faixasObstruidas: ''
      },
      presentes: {
        vmer: false,
        autoridade: false,
        concessionaria: false,
        outro: {
          texto: ''
        }
      }
    },
    faco: {
      sinalizacao: false,
      criacaoZonasTrabalho: false,
      abordagemVitimas: false,
      outro: {
        checked: false,
        texto: ''
      }
    },
    solicito: {
      vsatVsae: '',
      absc: '',
      elementoComando: false,
      outros: '',
      rottarea: ''
    },
    assumoCos: ''
  })

  const hrPositPlaceholder = ref('')

  // Coordinate handling
  const convertToDMS = (decimal, isLatitude) => {
    const absDecimal = Math.abs(decimal)
    const degrees = Math.floor(absDecimal)
    const minutesNotTruncated = (absDecimal - degrees) * 60
    const minutes = Math.floor(minutesNotTruncated)
    const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2)
    
    return `${degrees}° ${minutes}' ${seconds}" ${decimal >= 0 ? 
            (isLatitude ? 'N' : 'E') : 
            (isLatitude ? 'S' : 'W')}`
  }

  // Location handling
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported")
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        
        formData.value.estou.latitude = convertToDMS(lat, true)
        formData.value.estou.longitude = convertToDMS(lng, false)
        
        await reverseGeocode(lat, lng)
      },
      (error) => console.error("Geolocation error:", error)
    )
  }

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      const data = await response.json()
      
      if (data.address) {
        const street = data.address.road || data.address.street || ''
        const houseNumber = data.address.house_number || ''
        const suburb = data.address.suburb || data.address.neighbourhood || data.address.hamlet || ''
        const city = data.address.city || data.address.town || data.address.village || ''
        const postcode = data.address.postcode || ''
        const country = data.address.country || ''
  
        let streetAddress = street
        if (houseNumber) {
          streetAddress += streetAddress ? ` N${houseNumber}` : `N${houseNumber}`
        }
  
        if (suburb) {
          streetAddress = streetAddress ? `${streetAddress}, ${suburb}` : suburb
        }
  
        formData.value.estou.em = [streetAddress, city, postcode, country]
          .filter(Boolean)
          .join(', ')
          .replace(/, ,/g, ',')
          .trim()
  
        formData.value.estou.localidade = city || 'Unknown location'
      } else {
        formData.value.estou.em = 'Location name not available'
        formData.value.estou.localidade = 'Unknown location'
      }
    } catch (error) {
      formData.value.estou.em = 'Error getting location name'
      formData.value.estou.localidade = 'Error getting location'
    } finally {
      updateFields()
    }
  }

  const updateFields = () => {
    document.getElementById('em').value = formData.value.estou.em
    document.getElementById('latitude').value = formData.value.estou.latitude
    document.getElementById('longitude').value = formData.value.estou.longitude
    document.getElementById('localidade').value = formData.value.estou.localidade
  }

  // Input handling
  const setupNumberInputValidation = (inputElement, options = {}) => {
    // Implementation will be added later if needed
  }

  const setCurrentTimePlaceholder = () => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    hrPositPlaceholder.value = `${hours}:${minutes}`
  }

  const validateTime = (event) => {
    let input = event.target.value.replace(/[^\d]/g, '')
    if (input.length > 2) {
      input = input.slice(0, 2) + ':' + input.slice(2)
    }
    input = input.slice(0, 5)
    formData.value.estou.hrPosit = input
  }

  const setupExpandingTextareas = (textareaIds) => {
    // Implementation will be added later if needed
  }

  // Form submission
  const logFormData = async () => {
    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData.value,
          hrPositPlaceholder: hrPositPlaceholder.value
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      // Check the content type to determine if it's PDF or Excel
      const contentType = response.headers.get('Content-Type');
      console.log('Response content type:', contentType);
      
      const isPdf = contentType && contentType.includes('application/pdf');
      const fileExtension = isPdf ? 'pdf' : 'xlsx';
      
      const blob = await response.blob();
      console.log('Response blob size:', blob.size, 'bytes');
      console.log('Response blob type:', blob.type);
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `report.${fileExtension}`;
      
      // Alert user if fallback to Excel happened
      if (!isPdf) {
        console.warn('PDF conversion failed. Falling back to Excel format.');
        alert('Could not generate PDF. The report will be downloaded as an Excel file instead.');
      }
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please check the console for details.');
    }
  }

  // Initialize form
  const initializeForm = () => {
    setCurrentTimePlaceholder()
    
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    formData.value.estou.hrPosit = `${hours}:${minutes}`
  }

  onMounted(() => {
    const defaultInputs = [
      'canalManobra', 'ligeiroInput', 'ligeiroPassageiroInput',
      'ligeiroMercadoriasInput', 'pesadoInput', 'pesadoPassageiroInput',
      'pesadoMercadoriasInput', 'vitNum', 'vitGrv', 'vitLev', 'mecanico',
      'fistip1', 'fistip2', 'faixaobstr', 'vsatvsae', 'absc'
    ]
  
    const inputConfigs = [
      { id: 'ocorrN', options: { allowZeroStart: true, maxLength: 5 } },
      ...defaultInputs.map(id => ({ id }))
    ]
  
    inputConfigs.forEach(({ id, options = {} }) => {
      const input = document.getElementById(id)
      if (input) {
        setupNumberInputValidation(input, options)
      }
    })

    setCurrentTimePlaceholder()

    setupExpandingTextareas([
      'descacidente', 'outrosInput', 'tipocarga',
      'afetacaocarga', 'mecV', 'ft1', 'ft2', 
      'presenteOutro', 'facoOutro', 'solicitoOutro', 'rottarea'
    ])
    
    initializeForm()
  })

  return {
    formData,
    hrPositPlaceholder,
    getCurrentLocation,
    validateTime,
    logFormData,
    initializeForm
  }
} 