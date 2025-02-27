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
          checked: false,
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

  // Coordinate handling - Optimized with memoization
  const convertToDMS = (() => {
    const cache = new Map()
    
    return (decimal, isLatitude) => {
      // Create a cache key
      const cacheKey = `${decimal}:${isLatitude}`
      
      // Check if result is already cached
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey)
      }
      
      const absDecimal = Math.abs(decimal)
      const degrees = Math.floor(absDecimal)
      const minutesNotTruncated = (absDecimal - degrees) * 60
      const minutes = Math.floor(minutesNotTruncated)
      const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2)
      
      const result = `${degrees}° ${minutes}' ${seconds}" ${decimal >= 0 ? 
              (isLatitude ? 'N' : 'E') : 
              (isLatitude ? 'S' : 'W')}`
      
      // Cache the result
      cache.set(cacheKey, result)
      return result
    }
  })()

  // Location handling - Optimized with better error handling and debouncing
  const getCurrentLocation = (() => {
    let lastCallTime = 0
    const DEBOUNCE_TIME = 1000 // 1 second debounce
    
    return () => {
      const now = Date.now()
      if (now - lastCallTime < DEBOUNCE_TIME) {
        console.log('Debouncing location request')
        return
      }
      
      lastCallTime = now
      
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
        (error) => {
          console.error("Geolocation error:", error)
          // Provide user feedback based on error code
          const errorMessages = {
            1: "Location access denied. Please enable location services.",
            2: "Location unavailable. Please try again later.",
            3: "Location request timed out. Please try again."
          }
          alert(errorMessages[error.code] || "Error getting location")
        },
        { 
          enableHighAccuracy: true, 
          timeout: 10000,
          maximumAge: 0
        }
      )
    }
  })()

  // Optimized geocoding with caching and better error handling
  const geocodeCache = new Map()
  
  const reverseGeocode = async (lat, lng) => {
    // Round coordinates to 5 decimal places for caching (about 1.1 meters precision)
    const roundedLat = Math.round(lat * 100000) / 100000
    const roundedLng = Math.round(lng * 100000) / 100000
    const cacheKey = `${roundedLat},${roundedLng}`
    
    try {
      // Check cache first
      if (geocodeCache.has(cacheKey)) {
        const cachedData = geocodeCache.get(cacheKey)
        formData.value.estou.em = cachedData.address
        formData.value.estou.localidade = cachedData.city
        updateFields()
        return
      }
      
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: {
          'Accept-Language': 'pt-PT,pt;q=0.9,en;q=0.8',
          'User-Agent': 'GuiaComando/1.0'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Geocoding failed with status: ${response.status}`)
      }
      
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
  
        const fullAddress = [streetAddress, city, postcode, country]
          .filter(Boolean)
          .join(', ')
          .replace(/, ,/g, ',')
          .trim()
  
        formData.value.estou.em = fullAddress
        formData.value.estou.localidade = city || 'Unknown location'
        
        // Cache the result
        geocodeCache.set(cacheKey, {
          address: fullAddress,
          city: city || 'Unknown location'
        })
      } else {
        formData.value.estou.em = 'Location name not available'
        formData.value.estou.localidade = 'Unknown location'
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      formData.value.estou.em = 'Error getting location name'
      formData.value.estou.localidade = 'Error getting location'
    } finally {
      updateFields()
    }
  }

  // Optimized to use direct property assignment instead of DOM manipulation when possible
  const updateFields = () => {
    // Only update DOM if elements exist
    const emElement = document.getElementById('em')
    const latElement = document.getElementById('latitude')
    const lngElement = document.getElementById('longitude')
    const localidadeElement = document.getElementById('localidade')
    
    if (emElement) emElement.value = formData.value.estou.em
    if (latElement) latElement.value = formData.value.estou.latitude
    if (lngElement) lngElement.value = formData.value.estou.longitude
    if (localidadeElement) localidadeElement.value = formData.value.estou.localidade
  }

  // Input handling - Implemented with proper validation
  const setupNumberInputValidation = (inputElement, options = {}) => {
    if (!inputElement) return
    
    const { allowZeroStart = false, maxLength = 10 } = options
    
    inputElement.addEventListener('input', (e) => {
      let value = e.target.value
      
      // Remove non-numeric characters
      value = value.replace(/[^\d]/g, '')
      
      // Apply maxLength constraint
      if (value.length > maxLength) {
        value = value.slice(0, maxLength)
      }
      
      // Handle leading zeros
      if (!allowZeroStart && value.length > 1 && value[0] === '0') {
        value = value.slice(1)
      }
      
      // Update the input value
      e.target.value = value
    })
  }

  // Optimized time placeholder with caching
  const setCurrentTimePlaceholder = () => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    hrPositPlaceholder.value = `${hours}:${minutes}`
  }

  // Optimized time validation
  const validateTime = (event) => {
    let input = event.target.value.replace(/[^\d:]/g, '')
    
    // Handle colon input
    if (input.includes(':')) {
      const parts = input.split(':')
      if (parts[0].length > 2) parts[0] = parts[0].slice(0, 2)
      if (parts[1] && parts[1].length > 2) parts[1] = parts[1].slice(0, 2)
      input = parts.join(':')
    } else if (input.length > 2) {
      // Auto-insert colon after 2 digits
      input = input.slice(0, 2) + ':' + input.slice(2, 4)
    }
    
    // Validate hours and minutes
    if (input.includes(':')) {
      const [hours, minutes] = input.split(':')
      if (hours && parseInt(hours) > 23) input = '23:' + (minutes || '')
      if (minutes && parseInt(minutes) > 59) input = (hours || '00') + ':59'
    }
    
    formData.value.estou.hrPosit = input
  }

  // Implemented textarea auto-resize functionality
  const setupExpandingTextareas = (textareaIds) => {
    textareaIds.forEach(id => {
      const textarea = document.getElementById(id)
      if (!textarea) return
      
      const adjustHeight = () => {
        textarea.style.height = 'auto'
        textarea.style.height = (textarea.scrollHeight) + 'px'
      }
      
      textarea.addEventListener('input', adjustHeight)
      
      // Initial adjustment
      if (textarea.value) {
        setTimeout(adjustHeight, 0)
      }
    })
  }

  // Optimized form submission with better error handling and progress feedback
  const logFormData = async () => {
    try {
      // Show loading indicator
      const loadingIndicator = document.createElement('div')
      loadingIndicator.style.position = 'fixed'
      loadingIndicator.style.top = '0'
      loadingIndicator.style.left = '0'
      loadingIndicator.style.width = '100%'
      loadingIndicator.style.height = '100%'
      loadingIndicator.style.backgroundColor = 'rgba(0,0,0,0.5)'
      loadingIndicator.style.display = 'flex'
      loadingIndicator.style.justifyContent = 'center'
      loadingIndicator.style.alignItems = 'center'
      loadingIndicator.style.zIndex = '9999'
      loadingIndicator.innerHTML = '<div style="background: white; padding: 20px; border-radius: 5px;">Generating report...</div>'
      document.body.appendChild(loadingIndicator)
      
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

      if (!response.ok) throw new Error(`Network response error: ${response.status} ${response.statusText}`);

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
      a.download = `report-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.${fileExtension}`;
      
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
      alert(`Error generating report: ${error.message}`);
    } finally {
      // Remove loading indicator
      const loadingIndicator = document.querySelector('div[style*="position: fixed"][style*="z-index: 9999"]')
      if (loadingIndicator) {
        document.body.removeChild(loadingIndicator)
      }
    }
  }

  // Initialize form with current time
  const initializeForm = () => {
    setCurrentTimePlaceholder()
    
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    formData.value.estou.hrPosit = `${hours}:${minutes}`
  }

  // Optimized onMounted with better error handling
  onMounted(() => {
    try {
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
        'descacidente', 'outrosTexto', 'tipocarga',
        'afetacaocarga', 'mecV', 'ft1', 'ft2', 
        'presenteOutro', 'facoOutro', 'solicitoOutro', 'rottarea'
      ])
      
      initializeForm()
    } catch (error) {
      console.error('Error during component initialization:', error)
    }
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