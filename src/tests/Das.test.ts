import test from 'ava'

import { Das } from '../Das'
import { ChainId, CoinType } from '../types/publicTypes'

let das: Das

test.before(() => {
  das = new Das({
    url: 'https://indexer-not-use-in-production-env.da.systems/',
  })
})

test(
  'das.account()',
  async (t, account) => {
    const accountInfo = await das.account(account)

    t.truthy(accountInfo)
    t.is(accountInfo.account, account)
    t.is(accountInfo.avatar, `https://identicons.da.systems/identicon/${account}`)
  },
  'phone.bit'
)

test(
  'das.records()',
  async (t, account) => {
    const records = await das.records(account)
    const filteredRecords = records.filter(record => record.key === 'address.eth')

    t.true(records.length > 0)

    const ethRecords = await das.records(account, 'address.eth')
    t.deepEqual(ethRecords, filteredRecords)
    t.is(ethRecords.length, filteredRecords.length)
  },
  'phone.bit',
)

test(
  'das.addrs()',
  async (t, account) => {
    const addrs = await das.addrs(account, 'ETH')
    const records = await das.records(account, 'address.eth')

    t.true(addrs.length > 0)
    t.is(addrs.length, records.length)
    t.deepEqual(addrs, records)
  },
  'phone.bit',
)

test(
  'das.reserveRecord()',
  async (t, address) => {
    const accounts = await das.reserveRecord({
      type: 'blockchain',
      key_info: {
        coin_type: CoinType.ETH,
        chain_id: ChainId.ETH,
        key: address
      }
    })

    t.true(accounts.length > 0)
  },
  '0x0b4eba3efe8ad25f1fe0bb972fe82349ad9e5155',
)
