import { ethers, Wallet } from 'ethers'
import { BitAccount } from '../src/BitAccount'
import { RemoteTxBuilder } from '../src/builders/RemoteTxBuilder'
import { CheckSubAccountStatus, CoinType } from '../src/const'
import { BitIndexer } from '../src/fetchers/BitIndexer'
import { EthersSigner, SubAccount } from '../src/index'

const bitIndexer = new BitIndexer({
  // uri: 'https://indexer-v1.did.id',
  uri: 'https://test-indexer.did.id',
  // uri: 'https://test-indexer-not-use-in-production-env.did.id',
})
const bitBuilder = new RemoteTxBuilder({
  subAccountUri: 'https://test-subaccount-api.did.id/v1',
  registerUri: 'https://test-register-api.did.id/v1',
})
const address = '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38'
const privateKey1 = '87d8a2bccdfc9984295748fa2058136c8131335f59930933e9d4b3e74d4fca42'
const provider = new ethers.providers.InfuraProvider('goerli')
const wallet = new Wallet(privateKey1, provider)
const signer = new EthersSigner(wallet)

const account = new BitAccount({
  account: 'imac.bit',
  bitIndexer,
  bitBuilder,
  signer,
})

const bitIndexerProd = new BitIndexer({
  uri: 'https://indexer-v1.did.id',
})
const bitBuilderProd = new RemoteTxBuilder({
  subAccountUri: 'https://subaccount-api.did.id/v1',
  registerUri: 'https://register-api.did.id/v1',
})
const accountProd = new BitAccount({
  account: 'imac.bit',
  bitIndexer: bitIndexerProd,
  bitBuilder: bitBuilderProd,
  signer,
})

describe('constructor', () => {
  expect(() => {
    const account = new BitAccount({
      account: '.bit',
    })
  }).toThrow('.bit is not a valid .bit account')
})

describe('info', function () {
  const localAccount = new BitAccount({
    account: 'imac.bit',
    bitIndexer,
  })

  it('work', async function () {
    const start = Date.now()
    const info1 = await localAccount.info()
    const end1 = Date.now()

    const info2 = await localAccount.info()
    const end2 = Date.now()

    expect(end1 - start).toBeGreaterThan(500)
    expect(end2 - end1).toBe(0) // cache effect
    expect(info1).toMatchObject({
      account: 'imac.bit',
      account_alias: 'imac.bit',
      account_id_hex: '0x5728088435fb8788472a9ca601fbc0b9cbea8be3',
      next_account_id_hex: '0x5732e001baffd23c9d23c430c85dc8600c3d32ba',
      create_at_unix: 1656672987,
      expired_at_unix: 1688208987,
      status: 0,
      owner_algorithm_id: 5,
      owner_key: '0x7df93d9f500fd5a9537fee086322a988d4fdcc38',
    })
  })
})

describe('records', function () {
  it('work', async function () {
    const records = await accountProd.records()

    expect(records).toStrictEqual([
      {
        key: 'address.eth',
        type: 'address',
        subtype: 'eth',
        label: '',
        value: '0x1d643fac9a463c9d544506006a6348c234da485f',
        ttl: '300'
      },
      {
        key: 'address.trx',
        type: 'address',
        subtype: 'trx',
        label: '',
        value: 'TPzZyfAgkqASrKkkxiMWBRoJ6jgt718SCX',
        ttl: '300'
      },
      {
        key: 'address.trx',
        type: 'address',
        subtype: 'trx',
        label: '',
        value: 'TWiV82cSnCffyqkAwCuyjuvqUwZJx2nr3a',
        ttl: '300'
      },
      {
        key: 'profile.website',
        type: 'profile',
        subtype: 'website',
        label: 'Apple',
        value: 'https://www.apple.com/imac',
        ttl: '300'
      },
      {
        key: 'profile.avatar',
        type: 'profile',
        subtype: 'avatar',
        label: '',
        value: 'https://thiscatdoesnotexist.com',
        ttl: '300'
      },
      {
        key: 'profile.twitter',
        label: '',
        subtype: 'twitter',
        ttl: '300',
        type: 'profile',
        value: 'Apple',
      }
    ])
  })

  it('filter by key', async function () {
    const records = await accountProd.records('address.eth')

    expect(records).toMatchObject([{
      key: 'address.eth',
      type: 'address',
      subtype: 'eth',
      label: '',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
      ttl: '300'
    }])
  })

  it('filter by key result in multiple records', async function () {
    const records = await accountProd.records('address.trx')

    expect(records).toMatchObject([{
      key: 'address.trx',
      type: 'address',
      subtype: 'trx',
      label: '',
      value: 'TPzZyfAgkqASrKkkxiMWBRoJ6jgt718SCX',
      ttl: '300'
    },
    {
      key: 'address.trx',
      type: 'address',
      subtype: 'trx',
      label: '',
      value: 'TWiV82cSnCffyqkAwCuyjuvqUwZJx2nr3a',
      ttl: '300'
    }])
  })

  it('filter by key result in empty records', async function () {
    const records = await accountProd.records('address.btc')

    expect(records).toMatchObject([])
  })
})

describe('addrs', function () {
  const ethAddrs = [{
    key: 'address.eth',
    type: 'address',
    subtype: 'eth',
    label: '',
    value: '0x1d643fac9a463c9d544506006a6348c234da485f',
    ttl: '300'
  }]
  it('no filter', async function () {
    const addrs = await accountProd.addrs()

    expect(addrs).toMatchObject([{
      key: 'address.eth',
      type: 'address',
      subtype: 'eth',
      label: '',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
      ttl: '300'
    },
    {
      key: 'address.trx',
      type: 'address',
      subtype: 'trx',
      label: '',
      value: 'TPzZyfAgkqASrKkkxiMWBRoJ6jgt718SCX',
      ttl: '300'
    }, {
      key: 'address.trx',
      label: '',
      subtype: 'trx',
      type: 'address',
      ttl: '300',
      value: 'TWiV82cSnCffyqkAwCuyjuvqUwZJx2nr3a',
    }])
  })

  it('filter `trx`', async function () {
    const addrs = await accountProd.addrs('trx')

    expect(addrs).toMatchObject([{
      key: 'address.trx',
      type: 'address',
      subtype: 'trx',
      label: '',
      value: 'TPzZyfAgkqASrKkkxiMWBRoJ6jgt718SCX',
      ttl: '300'
    }, {
      key: 'address.trx',
      label: '',
      subtype: 'trx',
      type: 'address',
      ttl: '300',
      value: 'TWiV82cSnCffyqkAwCuyjuvqUwZJx2nr3a',
    }])
  })

  it('filter `eth`', async function () {
    const addrs = await accountProd.addrs('eth')

    expect(addrs).toMatchObject(ethAddrs)
  })

  it('filter `ETH`', async function () {
    const addrs = await accountProd.addrs('ETH')

    expect(addrs).toMatchObject(ethAddrs)
  })

  it('filter `60`', async function () {
    const addrs = await accountProd.addrs('60')

    expect(addrs).toMatchObject(ethAddrs)
  })
})

// describe('dwebs', function () {
//   it('no filter', async function () {
//     const addrs = await account.dwebs()
//
//     expect(addrs).toMatchObject([])
//   })
// })

describe('profiles', function () {
  it('no filter', async function () {
    const profiles = await accountProd.profiles()

    expect(profiles).toMatchObject([{
      key: 'profile.website',
      type: 'profile',
      subtype: 'website',
      label: 'Apple',
      value: 'https://www.apple.com/imac',
      ttl: '300'
    },
    {
      key: 'profile.avatar',
      type: 'profile',
      subtype: 'avatar',
      label: '',
      value: 'https://thiscatdoesnotexist.com',
      ttl: '300'
    },
    {
      key: 'profile.twitter',
      label: '',
      subtype: 'twitter',
      ttl: '300',
      type: 'profile',
      value: 'Apple',
    }])
  })

  it('filter `website`', async function () {
    const profiles = await accountProd.profiles('website')

    expect(profiles).toMatchObject([{
      key: 'profile.website',
      type: 'profile',
      subtype: 'website',
      label: 'Apple',
      value: 'https://www.apple.com/imac',
      ttl: '300'
    }])
  })
})

describe('enableSubAccount', function () {
  it('should work', function () {
    return expect(account.enableSubAccount()).rejects.toThrow('40000: sub account already initialized')
  }, 10000)
})

describe('mintSubAccount', function () {
  const mintParam = {
    account: '005.imac.bit',
    keyInfo: {
      coin_type: CoinType.ETH,
      key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
    },
    registerYears: 1,
  }
  // it('should work', async function () {
  //   const txs = await account.mintSubAccount(mintParam)
  //
  //   console.log(txs)
  //   expect(txs.hash_list.length).toBe(1)
  // }, 10000)

  it('should throw error', async function () {
    await expect(account.mintSubAccount(mintParam)).rejects.toThrow('Sub-account 005.imac.bit can not be registered, reason: registered, status 2')
  }, 10000)
})

describe('mintSubAccounts', function () {
  const mintParams = [{
    account: '006.imac.bit',
    keyInfo: {
      coin_type: CoinType.ETH,
      key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
    },
    registerYears: 1,
  }, {
    account: '007.imac.bit',
    keyInfo: {
      coin_type: CoinType.ETH,
      key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
    },
    registerYears: 1,
  }]

  // it('should work', async function () {
  //   const txs = await account.mintSubAccounts(mintParams)
  //
  //   expect(txs.hash_list.length).toBe(1)
  // }, 10000)

  it('should throw error', async function () {
    await expect(account.mintSubAccounts(mintParams)).rejects.toThrow('Sub-account 006.imac.bit can not be registered, reason: registered, status 2')
  }, 10000)
})

describe('subAccounts', function () {
  it('should work', async function () {
    const subAccounts = await account.subAccounts()
    expect(subAccounts.list.length).toBeGreaterThan(1)
  }, 10000)
})

describe('checkSubAccounts', function () {
  it('work', async function () {
    const subAccounts: SubAccount[] = [{
      account: 'xyz.imac.bit',
      type: 'blockchain',
      key_info: {
        key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
        coin_type: CoinType.ETH,
      },
      register_years: 1,
    }]

    const result = await account.checkSubAccounts(subAccounts)
    expect(result.result[0].status).toBe(0)
    expect(result.result[0].message).toBe('')
  })

  it('should throw error', async function () {
    const subAccounts: SubAccount[] = [{
      account: '001.imac.bit',
      type: 'blockchain',
      key_info: {
        key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
        coin_type: CoinType.ETH,
      },
      register_years: 1,
    }]

    const result = await account.checkSubAccounts(subAccounts)
    expect(result.result[0].status).toBe(CheckSubAccountStatus.registered)
    expect(result.result[0].message).toBe('registered')
  })
})

describe('changeManager', function () {
  // it('should work', async function () {
  //   const txs = await account.changeManager({
  //     key: 'TPzZyfAgkqASrKkkxiMWBRoJ6jgt718SCX',
  //     coin_type: CoinType.TRX,
  //   })
  //
  //   expect(txs.hash).toBeTruthy()
  // }, 10000)

  it('should throw error: same address', async function () {
    await expect(account.changeManager({
      key: 'TPzZyfAgkqASrKkkxiMWBRoJ6jgt718SCX',
      coin_type: CoinType.TRX,
    })).rejects.toThrow('same address')
  }, 10000)
})

describe('changeOwner', function () {
  // it('should work', async function () {
  //   const txs = await account.changeOwner({
  //     key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
  //     coin_type: CoinType.ETH,
  //   })
  //
  //   expect(txs.hash).toBeTruthy()
  // }, 10000)

  it('should throw error: same address', async function () {
    await expect(account.changeOwner({
      key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
      coin_type: CoinType.ETH,
    })).rejects.toThrow('same address')
  }, 10000)
})
