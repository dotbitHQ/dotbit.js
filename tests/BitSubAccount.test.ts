import { CoinType } from '../src/const'
import { subAccountWithSigner } from './common/index'
import { BitSubAccount } from '../src/BitSubAccount'

describe('constructor', function () {
  it('should NOT throw error when pass a legit Second-level DID', () => {
    return expect(() => new BitSubAccount({
      account: 'what.imac.bit',
    })).not.toThrowError()
  })
  it('should throw error when pass a non-legit Second-level DID', () => {
    return expect(() => new BitSubAccount({
      account: 'imac.bit',
    })).toThrow('1006: imac.bit is not a legit Second-level DID')
  })
})

describe('changeManager', function () {
  // it('work', async function () {
  //   const res = await subAccountWithSigner.changeManager({
  //     key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
  //     coin_type: CoinType.ETH,
  //   })
  //
  //   expect(res.hash_list.length).toBe(0)
  // })

  it('throw error', function () {
    return expect(subAccountWithSigner.changeManager({
      key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
      coin_type: CoinType.ETH,
    })).rejects.toThrow('30023: same address')
  })
})

describe('changeOwner', function () {
  // it('work', async function () {
  //   const res = await subAccountWithSigner.changeOwner({
  //     key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
  //     coin_type: CoinType.ETH,
  //   })
  //
  //   expect(res.hash_list.length).toBe(0)
  // })

  it('throw error', function () {
    return expect(subAccountWithSigner.changeOwner({
      key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
      coin_type: CoinType.ETH,
    })).rejects.toThrow('30023: same address')
  })
})

describe('updateRecords', function () {
  it('work', async function () {
    const res = await subAccountWithSigner.updateRecords([{
      key: 'profile.twitter',
      value: 'apple',
      label: new Date().toISOString(),
      ttl: '300'
    }])

    expect(res.hash_list.length).toBe(0)
  })
})

describe('records', function () {
  it('should work', async function () {
    const res = await subAccountWithSigner.records()
    expect(res.length).toBeGreaterThanOrEqual(1)
  })
})
