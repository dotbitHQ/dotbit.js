import {
  checkKeyInfo,
  isEmptyAddress,
  isEthAddress,
  isTronAddress,
  pad0x,
  stringVisualLength,
} from '../../src/tools/common'
import { ChainType, CoinType } from 'dotbit'

describe('pad0x', function () {
  it('starts with 0x', function () {
    const str = '0x123'

    const padded = pad0x(str)

    expect(padded).toBe(str)
  })

  it('does not start with 0x', function () {
    const str = '123'

    const padded = pad0x(str)

    expect(padded).toBe(`0x${str}`)
  })
})

describe('isEmptyAddress', function () {
  it('empty', function () {
    const isEmpty = isEmptyAddress('')

    expect(isEmpty).toBe(true)
  })

  it('0x', function () {
    const isEmpty = isEmptyAddress('0x')

    expect(isEmpty).toBe(true)
  })

  it('0x0', function () {
    const isEmpty = isEmptyAddress('0x0')

    expect(isEmpty).toBe(true)
  })

  it('0x0000000000000000000000000000000000000000', function () {
    const isEmpty = isEmptyAddress('0x0000000000000000000000000000000000000000')

    expect(isEmpty).toBe(true)
  })

  it('0x123', function () {
    const isEmpty = isEmptyAddress('0x123')

    expect(isEmpty).toBe(false)
  })
})

describe('isEthAddress', function () {
  it('0x8ba1f109551bD432803012645Ac136ddd64DBA72', function () {
    const address = '0x8ba1f109551bD432803012645Ac136ddd64DBA72'
    expect(isEthAddress(address)).toBe(true)
  })

  it('0x8ba1f109551bd432803012645ac136ddd64dba72', function () {
    const address = '0x8ba1f109551bd432803012645ac136ddd64dba72'
    expect(isEthAddress(address)).toBe(true)
  })

  it('0x8BA1F109551BD432803012645AC136DDD64DBA72', function () {
    const address = '0x8BA1F109551BD432803012645AC136DDD64DBA72'
    expect(isEthAddress(address)).toBe(true)
  })

  it('0X8BA1F109551BD432803012645AC136DDD64DBA72', function () {
    const address = '0X8BA1F109551BD432803012645AC136DDD64DBA72'
    expect(isEthAddress(address)).toBe(true)
  })

  it('0x8BA1f109551bD432803012645Ac136ddd64DBA72', function () {
    const address = '0x8BA1f109551bD432803012645Ac136ddd64DBA72'
    expect(isEthAddress(address)).toBe(false)
  })

  it('XE65GB6LDNXYOFTX0NSV3FUWKOWIXAMJK36', function () {
    const address = 'XE65GB6LDNXYOFTX0NSV3FUWKOWIXAMJK36'
    expect(isEthAddress(address)).toBe(false)
  })
})

describe('isTronAddress', function () {
  it('TFY8wxf1TjPNxKwop1ZX3JhzwWREqowmoF', function () {
    const address = 'TFY8wxf1TjPNxKwop1ZX3JhzwWREqowmoF'
    expect(isTronAddress(address)).toBe(true)
  })

  it('413d12f8d6f0ea36d2f01553beb4810d12d3658d2a', function () {
    const address = '413d12f8d6f0ea36d2f01553beb4810d12d3658d2a'
    expect(isTronAddress(address)).toBe(false)
  })

  it('tFY8wxf1TjPNxKwop1ZX3JhzwWREqowmoF', function () {
    const address = 'tFY8wxf1TjPNxKwop1ZX3JhzwWREqowmoF'
    expect(isTronAddress(address)).toBe(false)
  })
})

describe('checkKeyInfo', function () {
  it('ETH keyInfo return true', function () {
    const keyInfo = {
      key: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      coin_type: CoinType.ETH,
      chain_id: ChainType.eth
    }
    expect(checkKeyInfo(keyInfo)).toBe(true)
  })

  it('ETH keyInfo return false', function () {
    const keyInfo = {
      key: '0x8BA1f109551bD432803012645Ac136ddd64DBA72',
      coin_type: CoinType.ETH,
      chain_id: ChainType.eth
    }
    expect(checkKeyInfo(keyInfo)).toBe(false)
  })

  it('Tron keyInfo return true', function () {
    const keyInfo = {
      key: 'TFY8wxf1TjPNxKwop1ZX3JhzwWREqowmoF',
      coin_type: CoinType.TRX,
      chain_id: ChainType.tron
    }
    expect(checkKeyInfo(keyInfo)).toBe(true)
  })

  it('Tron keyInfo return false', function () {
    const keyInfo = {
      key: 'tFY8wxf1TjPNxKwop1ZX3JhzwWREqowmoF',
      coin_type: CoinType.TRX,
      chain_id: ChainType.tron
    }
    expect(checkKeyInfo(keyInfo)).toBe(false)
  })
})

describe('stringVisualLength', function () {
  it('web3max', function () {
    expect(stringVisualLength('web3max')).toBe(7)
  })

  it('🇨🇳🇯🇵', function () {
    expect(stringVisualLength('🇨🇳🇯🇵')).toBe(2)
  })

  it('😊💣', function () {
    expect(stringVisualLength('😊💣')).toBe(2)
  })
})
