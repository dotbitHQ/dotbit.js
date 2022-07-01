import { BitAccount } from '../src/BitAccount'
import { BitIndexer } from '../src/fetchers/BitIndexer'

const bitIndexer = new BitIndexer({
  uri: 'https://indexer-v1.did.id'
})
const account = new BitAccount({
  account: 'imac.bit',
  bitIndexer,
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
      next_account_id_hex: '0x572861ec594b4f8d2dda64885f0561e4fb1591ca',
      create_at_unix: 1631851320,
      expired_at_unix: 1663387320,
      status: 0,
      das_lock_arg_hex: '0x051d643fac9a463c9d544506006a6348c234da485f051d643fac9a463c9d544506006a6348c234da485f',
      owner_algorithm_id: 5,
      owner_key: '0x1d643fac9a463c9d544506006a6348c234da485f',
      manager_algorithm_id: 5,
      manager_key: '0x1d643fac9a463c9d544506006a6348c234da485f'
    })
  })
})

describe('records', function () {
  it('work', async function () {
    const records = await account.records()

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
      }
    ])
  })

  it('filter by key', async function () {
    const records = await account.records('address.eth')

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
    const records = await account.records('address.trx')

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
    const records = await account.records('address.btc')

    expect(records).toMatchObject([])
  })
})

describe('addrs', function () {
  it('no filter', async function () {
    const addrs = await account.addrs()

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
    const addrs = await account.addrs('trx')

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
    const addrs = await account.addrs('eth')

    expect(addrs).toMatchObject([{
      key: 'address.eth',
      type: 'address',
      subtype: 'eth',
      label: '',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
      ttl: '300'
    }])
  })

  it('filter `ETH`', async function () {
    const addrs = await account.addrs('ETH')

    expect(addrs).toMatchObject([{
      key: 'address.eth',
      type: 'address',
      subtype: 'eth',
      label: '',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
      ttl: '300'
    }])
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
    const profiles = await account.profiles()

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
    }])
  })

  it('filter `website`', async function () {
    const profiles = await account.profiles('website')

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
