import { BitAccount } from '../src/BitAccount'
import { DotBit } from '../src/DotBit'
import { BitIndexer } from '../src/index'

const dotbit = new DotBit({
  bitIndexer: new BitIndexer({
    uri: 'https://indexer-v1.did.id',
  })
})

describe('serverInfo', function () {
  it('work', async function () {
    const info = await dotbit.serverInfo()

    expect(info.current_block_number).toBeGreaterThan(10000)
  }, 10000)
})

describe('accountsOfOwner', function () {
  it('work', async function () {
    const accounts = await dotbit.accountsOfOwner({
      key: '0x1d643fac9a463c9d544506006a6348c234da485f',
    })

    expect(accounts[0]).toBeInstanceOf(BitAccount)
    expect(accounts.length).toBeGreaterThan(10)
  })
})

describe('accountById', function () {
  it('work', async function () {
    const account = await dotbit.accountById('0x5728088435fb8788472a9ca601fbc0b9cbea8be3')
    expect(account).toBeInstanceOf(BitAccount)
    expect(account.account).toBe('imac.bit')
  })
})

describe('reverse', function () {
  it('work', async function () {
    const account = await dotbit.reverse({
      key: '0x1d643fac9a463c9d544506006a6348c234da485f',
    })
    expect(account).toBeInstanceOf(BitAccount)
    expect(account.account).toBe('jeffx.bit')
  })
})
