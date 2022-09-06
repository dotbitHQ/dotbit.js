export function pad0x (str: string): string {
  return str.startsWith('0x') ? str : `0x${str}`
}

export function remove0x (str: string): string {
  return str.startsWith('0x') ? str.substring(2) : str
}

/**
 * Check if a given address is empty
 * @param address
 */
export function isEmptyAddress (address: string): boolean {
  return !address || address === '0x' || address === '0x0' || address === '0x0000000000000000000000000000000000000000'
}

export function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
