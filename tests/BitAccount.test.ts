import { BitAccount, RoleKeyInfo } from '../src/BitAccount'
import { SIGN_TYPE, CheckSubAccountStatus, CoinType, DWebProtocol } from '../src/const'
import { SubAccountMintParams } from '../src/fetchers/SubAccountAPI'
import { sleep } from '../src/tools/common'
import { accountNotExist, accountWithSigner, accountWithSignerProd, accountWithSignerProdRecords } from './common/index'
import { createInstance, graphemesAccount } from '../src'

describe('constructor', () => {
  expect(() => {
    const account = new BitAccount({
      account: '.bit',
    })
  }).toThrow('.bit is not a valid .bit account')
})

describe('info', function () {
  it('work', async function () {
    const start = Date.now()
    const info1 = await accountWithSigner.info()
    const end1 = Date.now()

    const info2 = await accountWithSigner.info()
    const end2 = Date.now()

    expect(end1 - start).toBeGreaterThan(100) // network time
    expect(end2 - end1).toBe(0) // cache effect
    expect(info1).toMatchObject({
      account: 'imac.bit',
      account_id_hex: '0x5728088435fb8788472a9ca601fbc0b9cbea8be3',
      next_account_id_hex: '0x5728686c791549e76c20e29cce61a025c545f343',
      create_at_unix: 1656672987,
      expired_at_unix: 1688208987,
      status: 0,
      owner_algorithm_id: 17000,
      owner_key: '0x1d643fac9a463c9d544506006a6348c234da485f',
      enable_sub_account: 0
    })
  })
})

describe('owner', function () {
  it('work', async function () {
    const owner = await accountWithSigner.owner()
    expect(owner).toMatchObject({
      key: '0x1d643fac9a463c9d544506006a6348c234da485f',
      coin_type: CoinType.ETH,
      algorithm_id: SIGN_TYPE.eth712,
    } as RoleKeyInfo)
  })
})

describe('manager', function () {
  it('work', async function () {
    const manager = await accountWithSigner.manager()
    expect(manager).toMatchObject({
      key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
      coin_type: CoinType.ETH,
      algorithm_id: SIGN_TYPE.eth712,
    } as RoleKeyInfo)
  })
})

describe('records', function () {
  it('work', async function () {
    const records = await accountWithSignerProd.records()

    expect(records).toStrictEqual(accountWithSignerProdRecords)
  })

  it('filter by key', async function () {
    const records = await accountWithSignerProd.records('address.eth')

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
    const records = await accountWithSignerProd.records('address.trx')

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
    const records = await accountWithSignerProd.records('address.btc')

    expect(records).toMatchObject([])
  })

  it('not exist account', function () {
    return expect(accountNotExist.records()).rejects.toThrow('account not exist')
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
    const addrs = await accountWithSignerProd.addrs()

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
    const addrs = await accountWithSignerProd.addrs('trx')

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
    const addrs = await accountWithSignerProd.addrs('eth')

    expect(addrs).toMatchObject(ethAddrs)
  })

  it('filter `ETH`', async function () {
    const addrs = await accountWithSignerProd.addrs('ETH')

    expect(addrs).toMatchObject(ethAddrs)
  })

  it('filter `60`', async function () {
    const addrs = await accountWithSignerProd.addrs('60')

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
    const profiles = await accountWithSignerProd.profiles()

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
    const profiles = await accountWithSignerProd.profiles('website')

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
    await expect(accountWithSigner.mintSubAccount(mintParam)).rejects.toThrow('Second-level DID 005.imac.bit can not be registered, reason: registered, status 2')
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
  }, {
    account: '008.imac.bit',
    registerYears: 1,
    mintForAccount: 'imac.bit'
  }]

  // it('should work', async function () {
  //   const txs = await account.mintSubAccounts(mintParams)
  //
  //   expect(txs.hash_list.length).toBe(1)
  // }, 10000)

  it('should throw error', async function () {
    await expect(accountWithSigner.mintSubAccounts(mintParams)).rejects.toThrow('Second-level DID 006.imac.bit can not be registered, reason: registered, status 2')
  }, 10000)
})

describe('subAccounts', function () {
  it('should work', async function () {
    const subAccounts = await accountWithSigner.subAccounts()
    expect(subAccounts.list.length).toBeGreaterThan(1)
  }, 10000)
})

describe('checkSubAccounts', function () {
  it('work', async function () {
    const subAccounts: SubAccountMintParams[] = [{
      account: 'xyz.imac.bit',
      type: 'blockchain',
      key_info: {
        key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
        coin_type: CoinType.ETH,
      },
      register_years: 1,
      account_char_str: graphemesAccount('xyz')
    }]

    const result = await accountWithSigner.checkSubAccounts(subAccounts)
    expect(result.result[0].status).toBe(0)
    expect(result.result[0].message).toBe('')
  })

  it('should throw error', async function () {
    const subAccounts: SubAccountMintParams[] = [{
      account: '001.imac.bit',
      type: 'blockchain',
      key_info: {
        key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
        coin_type: CoinType.ETH,
      },
      register_years: 1,
      account_char_str: graphemesAccount('001')
    }]

    const result = await accountWithSigner.checkSubAccounts(subAccounts)
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

  it('should throw error: edit manager permission denied', async function () {
    await expect(accountWithSigner.changeManager({
      key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
      coin_type: CoinType.ETH,
    })).rejects.toThrow('30011: edit manager permission denied')
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

  it('should throw error: transfer owner permission denied', async function () {
    await sleep(1000)
    await expect(accountWithSigner.changeOwner({
      key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
      coin_type: CoinType.ETH,
    })).rejects.toThrow('30011: transfer owner permission denied')
  }, 10000)
})

describe('updateRecords', function () {
  it('should work', async function () {
    const tx = await accountWithSigner.updateRecords([{
      key: 'profile.email',
      value: 'hr@apple.com',
      label: 'HR',
      ttl: '3000',
    }])
    expect(tx.hash).toBeTruthy()
  }, 10000)
})

describe('editRecords', function () {
  // what if label and ttl is missing?
  it('should work', async function () {
    const editor = await accountWithSigner.editRecords()
    editor.delete({
      key: 'profile.email',
    }).add({
      key: 'profile.email',
      value: 'recruit@apple.com',
    })

    expect(editor.records).toMatchObject([
      {
        ttl: '300',
        label: '',
        key: 'profile.email',
        value: 'recruit@apple.com'
      }
    ])
  })
})

describe('dwebs', function () {
  jest.setTimeout(60 * 1000)
  const dotbit = createInstance()

  it('dwebs()', async function () {
    const account = dotbit.account('web3max.bit')
    const res = await account.dwebs()
    expect(res.length > 0).toBeTruthy()
  })

  it('dwebs(DWebProtocol.ipns)', async function () {
    const account = dotbit.account('web3max.bit')
    const res = await account.dwebs(DWebProtocol.ipns)
    expect(res[0].subtype).toBe(DWebProtocol.ipns)
  })
})

describe('dweb', function () {
  jest.setTimeout(60 * 1000)
  it('dweb()', async function () {
    const dotbit = createInstance()
    const account = dotbit.account('web3max.bit')
    const res = await account.dweb()
    expect(res?.subtype).toBe(DWebProtocol.ipns)
  })
})
