export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.append(link)
  link.click()
  link.remove()
  // Revoking synchronously can cancel the download in some browsers (Safari)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
