import slip44 from './coinType2Symbol.json'

export function mapCoinTypeToSymbol (coinType: string): string {
  const chain = coinType.match(/^\d+$/) ? slip44[coinType] || coinType : coinType

  return chain.toUpperCase()
}

export function mapSymbolToCoinType (chain: string): string {
  chain = chain.toUpperCase()

  for (const coinType in slip44) {
    if (slip44[coinType] === chain) {
      return coinType
    }
  }

  return chain
}
