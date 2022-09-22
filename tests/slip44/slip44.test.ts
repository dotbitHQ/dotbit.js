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

  it('work for `BSC`', () => {
    // slip44 have duplicated symbol `BSC`, one for `Binance Smart Chain`, one for `Bitcoin Smart Contract`, which is deprecated.
    expect(mapSymbolToCoinType('bsc')).toBe('9006')
  })

  it('work for polygon', () => {
    expect(mapSymbolToCoinType('polygon')).toBe('966')
  })

  it('work for matic', () => {
    expect(mapSymbolToCoinType('matic')).toBe('966')
  })
})
