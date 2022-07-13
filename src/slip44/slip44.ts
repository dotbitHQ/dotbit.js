import slip44 from './coinType2Symbol.json'

export function mapCoinTypeToSymbol (coinType: string): string {
  if (coinType?.match(/^\d+$/)) {
    return (slip44[coinType] || coinType).toUpperCase()
  }
  return coinType?.toUpperCase()
}

export function mapSymbolToCoinType (chain: string): string {
  if (chain) {
    chain = chain.toUpperCase()

    for (const coinType in slip44) {
      if (slip44[coinType] === chain) {
        return coinType
      }
    }
  }
  return chain
}
