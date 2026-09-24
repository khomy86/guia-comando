const pad2 = (n: number) => String(n).padStart(2, '0')

export const currentTime = (date = new Date()) => `${pad2(date.getHours())}:${pad2(date.getMinutes())}`

/** Sanitizes typed text into HH:MM, inserting the colon automatically. */
export function formatTimeInput(raw: string): string {
  let input = raw.replace(/[^\d:]/g, '')

  if (input.includes(':')) {
    const [h = '', m = ''] = input.split(':')
    input = `${h.slice(0, 2)}:${m.slice(0, 2)}`
  }
  else if (input.length > 2) {
    input = `${input.slice(0, 2)}:${input.slice(2, 4)}`
  }

  if (input.includes(':')) {
    const [hours = '', minutes = ''] = input.split(':')
    if (hours && Number(hours) > 23) input = `23:${minutes}`
    if (minutes && Number(minutes) > 59) input = `${hours || '00'}:59`
  }

  return input
}

/** Decimal degrees -> DMS string, e.g. 38° 42' 36.12" N */
export function toDMS(decimal: number, isLatitude: boolean): string {
  const abs = Math.abs(decimal)
  const degrees = Math.floor(abs)
  const minutesFull = (abs - degrees) * 60
  const minutes = Math.floor(minutesFull)
  const seconds = ((minutesFull - minutes) * 60).toFixed(2)
  const hemisphere = isLatitude ? (decimal >= 0 ? 'N' : 'S') : (decimal >= 0 ? 'E' : 'W')
  return `${degrees}° ${minutes}' ${seconds}" ${hemisphere}`
}
