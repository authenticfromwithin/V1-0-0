export function track(type: string, data?: any) {
  try {
    const key = '__afw_evq__'
    const arr = JSON.parse(localStorage.getItem(key) || '[]')
    arr.push({ t: Date.now(), type, data })
    localStorage.setItem(key, JSON.stringify(arr))
  } catch {}
}
export async function exportLocal(): Promise<Blob> {
  const key = '__afw_evq__'
  const arr = JSON.parse(localStorage.getItem(key) || '[]')
  const ndjson = arr.map((o:any) => JSON.stringify(o)).join('\n')
  return new Blob([ndjson], { type: 'application/x-ndjson' })
}


