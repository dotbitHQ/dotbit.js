import { BitAccount } from '../src/BitAccount'
import { BitSubAccount } from '../src/BitSubAccount'
import { dotbitProd } from './common/index'

describe('serverInfo', function () {
  it('work', async function () {
    const info = await dotbitProd.serverInfo()

    expect(info.current_block_number).toBeGreaterThan(10000)
  }, 10000)
})

describe('account', function () {
  it('main account', function () {
    const bitAccount = dotbitProd.account('imac.bit')
    expect(bitAccount).toBeInstanceOf(BitAccount)
    expect(bitAccount.account).toBe('imac.bit')
  })

  it('sub account', function () {
    const bitSubAccount = dotbitProd.account('001.imac.bit')
    expect(bitSubAccount).toBeInstanceOf(BitSubAccount)
    expect(bitSubAccount.account).toBe('001.imac.bit')
  })
})

describe('exist', function () {
  it('exist', async () => {
    expect(await dotbitProd.exist('imac.bit')).toBe(true)
  })

  it('not exist', async () => {
    expect(await dotbitProd.exist('imac123abc.bit')).toBe(false)
  })
})

describe('accountsOfOwner', function () {
  it('work', async function () {
    const accounts = await dotbitProd.accountsOfOwner({
      key: '0x1d643fac9a463c9d544506006a6348c234da485f',
    })

    expect(accounts[0]).toBeInstanceOf(BitAccount)
    expect(accounts.length).toBeGreaterThan(10)
  })
})

describe('accountById', function () {
  it('work', async function () {
    const account = await dotbitProd.accountById('0x5728088435fb8788472a9ca601fbc0b9cbea8be3')
    expect(account).toBeInstanceOf(BitAccount)
    expect(account.account).toBe('imac.bit')
  })
})

describe('records', function () {
  it('work for not exist account', function () {
    return expect(dotbitProd.records('imac-1.bit')).rejects.toThrow('account not exist')
  })
})

describe('reverse', function () {
  it('work', async function () {
    const account = await dotbitProd.reverse({
      key: '0x1d643fac9a463c9d544506006a6348c234da485f',
    })
    expect(account).toBeInstanceOf(BitAccount)
    expect(account.account).toBe('jeffx.bit')
  })
})

describe('addrs', function () {
  it('work', async function () {
    const addrs = await dotbitProd.addrs('imac.bit')
    expect(addrs.length).toBeGreaterThan(1)
  }, 10000)

  it('work with filter', async function () {
    const addrs = await dotbitProd.addrs('imac.bit', 'eth')
    expect(addrs.length).toBe(1)
  }, 10000)
})
