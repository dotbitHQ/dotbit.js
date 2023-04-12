import { KeyInfo } from '../../src/fetchers/BitIndexer.type'
import {
  checkKeyInfo,
  computeChainTypeByCoinType,
  isEmptyAddress,
  isEthAddress,
  isTronAddress,
  matchDWebProtocol,
  pad0x,
  stringVisualLength
} from '../../src/tools/common'
import { CoinType, EvmChainId } from '../../src/const'

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
  it('checksum address', function () {
    const address = '0x8ba1f109551bD432803012645Ac136ddd64DBA72'
    expect(isEthAddress(address)).toBe(true)
  })

  it('all lowercase address', function () {
    const address = '0x8ba1f109551bd432803012645ac136ddd64dba72'
    expect(isEthAddress(address)).toBe(true)
  })

  it('all-caps address starting with 0x', function () {
    const address = '0x8BA1F109551BD432803012645AC136DDD64DBA72'
    expect(isEthAddress(address)).toBe(true)
  })

  it('all caps address', function () {
    const address = '0X8BA1F109551BD432803012645AC136DDD64DBA72'
    expect(isEthAddress(address)).toBe(false)
  })

  it('invalid checksum', function () {
    const address = '0x8BA1f109551bD432803012645Ac136ddd64DBA72'
    expect(isEthAddress(address)).toBe(false)
  })

  it('ICAP address', function () {
    const address = 'XE65GB6LDNXYOFTX0NSV3FUWKOWIXAMJK36'
    expect(isEthAddress(address)).toBe(false)
  })
})

describe('isTronAddress', function () {
  it('Tron address base58', function () {
    const address = 'TFY8wxf1TjPNxKwop1ZX3JhzwWREqowmoF'
    expect(isTronAddress(address)).toBe(true)
  })

  it('Tron address hex', function () {
    const address = '413d12f8d6f0ea36d2f01553beb4810d12d3658d2a'
    expect(isTronAddress(address)).toBe(false)
  })

  it('Incorrect Tron address', function () {
    const address = 'tFY8wxf1TjPNxKwop1ZX3JhzwWREqowmoF'
    expect(isTronAddress(address)).toBe(false)
  })
})

describe('checkKeyInfo', function () {
  it('ETH keyInfo return true', function () {
    const keyInfo: KeyInfo = {
      key: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      coin_type: CoinType.ETH,
    }
    expect(checkKeyInfo(keyInfo)).toBe(true)
  })

  it('ETH keyInfo return false', function () {
    const keyInfo: KeyInfo = {
      key: '0x8BA1f109551bD432803012645Ac136ddd64DBA72',
      coin_type: CoinType.ETH,
    }
    expect(checkKeyInfo(keyInfo)).toBe(false)
  })

  it('Tron keyInfo return true', function () {
    const keyInfo: KeyInfo = {
      key: 'TFY8wxf1TjPNxKwop1ZX3JhzwWREqowmoF',
      coin_type: CoinType.TRX,
    }
    expect(checkKeyInfo(keyInfo)).toBe(true)
  })

  it('Tron keyInfo return false', function () {
    const keyInfo: KeyInfo = {
      key: 'tFY8wxf1TjPNxKwop1ZX3JhzwWREqowmoF',
      coin_type: CoinType.TRX,
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

describe('computeChainTypeByCoinType', function () {
  it(CoinType.ETH, function () {
    expect(computeChainTypeByCoinType(CoinType.ETH)).toBe(EvmChainId.ETH)
  })

  it(CoinType.TRX, function () {
    expect(computeChainTypeByCoinType(CoinType.TRX)).toBe(undefined)
  })

  it(CoinType.BSC, function () {
    expect(computeChainTypeByCoinType(CoinType.BSC)).toBe(EvmChainId.BSC)
  })

  it(CoinType.MATIC, function () {
    expect(computeChainTypeByCoinType(CoinType.MATIC)).toBe(EvmChainId.MATIC)
  })

  it(CoinType.CKB, function () {
    expect(computeChainTypeByCoinType(CoinType.CKB)).toBe(undefined)
  })
})

describe('matchDWebProtocol', function () {
  it('ipfs://QmaCveU7uyVKUSczmiCc85N7jtdZuBoKMrmcHbnnP26DCx', function () {
    const matched = matchDWebProtocol('ipfs://QmaCveU7uyVKUSczmiCc85N7jtdZuBoKMrmcHbnnP26DCx')
    expect(matched[2]).toBe('QmaCveU7uyVKUSczmiCc85N7jtdZuBoKMrmcHbnnP26DCx')
  })

  it('ipns://k51qzi5uqu5dgqjy1i78mz3oumplzt0cye32w9m8ix8hg9chpz5trvj8luwv0c', function () {
    const matched = matchDWebProtocol('ipns://k51qzi5uqu5dgqjy1i78mz3oumplzt0cye32w9m8ix8hg9chpz5trvj8luwv0c')
    expect(matched[1]).toBe('ipns')
  })

  it('QmaCveU7uyVKUSczmiCc85N7jtdZuBoKMrmcHbnnP26DCx', function () {
    const matched = matchDWebProtocol('QmaCveU7uyVKUSczmiCc85N7jtdZuBoKMrmcHbnnP26DCx')
    expect(matched).toBe(null)
  })

  it('planetable.eth', function () {
    const matched = matchDWebProtocol('planetable.eth')
    expect(matched).toBe(null)
  })
})
