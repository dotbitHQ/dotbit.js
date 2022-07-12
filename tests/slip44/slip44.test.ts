import { mapSymbolToCoinType, mapCoinTypeToSymbol } from '../../src/slip44/slip44'

describe('mapCoinTypeToChain', function () {
  it('work', () => {
    expect(mapCoinTypeToSymbol('60')).toBe('ETH')
  })

  it('work for `ETH`', () => {
    expect(mapCoinTypeToSymbol('ETH')).toBe('ETH')
  })

  it('work for `eth`', () => {
    expect(mapCoinTypeToSymbol('eth')).toBe('ETH')
  })
})

describe('mapSymbolToCoinType', function () {
  it('work', () => {
    expect(mapSymbolToCoinType('60')).toBe('60')
  })

  it('work for `ETH`', () => {
    expect(mapSymbolToCoinType('ETH')).toBe('60')
  })

  it('work for `eth`', () => {
    expect(mapSymbolToCoinType('eth')).toBe('60')
  })
})
