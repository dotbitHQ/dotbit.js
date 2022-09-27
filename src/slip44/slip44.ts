import slip44 from './coinType2Symbol.json'

export function mapCoinTypeToSymbol (coinType: string): string {
  if (coinType?.match(/^\d+$/)) {
    return (slip44[coinType] || coinType).toUpperCase()
  }
  return coinType?.toUpperCase()
}

export function mapSymbolToCoinType (chain: string): string {
  const customMapper = {
    POLYGON: '966', // 'MATIC' was previously POLYGON
    BSC: '9006' // Bitcoin Smart Contract(519) is dead, BSC(9006) is alive
  }

  if (chain) {
    chain = chain.toUpperCase()

    if (customMapper[chain]) {
      return customMapper[chain]
    }

    for (const coinType in slip44) {
      if (slip44[coinType] === chain) {
        return coinType
      }
    }
  }
  return chain
}
