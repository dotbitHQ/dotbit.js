import test from 'ava'

import { Das } from '../Das'
import ResolutionError, { ResolutionErrorCode } from '../errors/resolutionError'

let das: Das

test.before(() => {
  das = new Das({
    url: Das.UrlMap['aggron'],
    network: 'aggron'
  })
})

test(
  'das.getAccountData()',
  async (t, account: string) => {
    const accountData = await das.getAccountData(account)

    t.not(accountData, null)
    t.not(accountData, null)
    t.is(accountData.account, account)
    t.not(accountData.records.length, 0)
  },
  'jeffjing.bit',
);

test(
  'das.record()',
  async (t, account: string, address: string) => {
    const error: ResolutionError = await t.throwsAsync(das.record(account, 'eth'))
    t.true(error.code === ResolutionErrorCode.RecordNotFound)

    const ethAddress = await das.record(account, 'address.eth')
    const ethAddressWithUpperCaseKey = await das.record(account, 'address.ETH')

    t.is(ethAddress, address)
    t.true(ethAddress === ethAddressWithUpperCaseKey)
  },
  'jeffjing.bit',
  '0x5fd1d0DAD20817951E40043fEE7655548838D82E'
)

test(
  'das.records()',
  async (t, account: string, keys: string[]) => {
    const records = await das.records(account, keys)

    t.not(Object.keys(records).length, 0)
    t.is(records['address.eth'], '0x5fd1d0DAD20817951E40043fEE7655548838D82E')
  },
  'jeffjing.bit',
  ['address.eth', 'profile.phone', 'address.btc'],
)

test(
  'das.recordsByKey()',
  async (t, account: string, key: string) => {
    const records = await das.recordsByKey(account, key)

    t.true(Array.isArray(records))
    t.truthy(records)

    console.log(records)
  },
  'jeffjing.bit',
  'address.eth',
)

test(
  'das.autonetwork()',
  async (t) => {
    const das = await Das.autonetwork()

    t.is(das.network, 'mainnet')
    t.is(das.url, '')

    console.log(das.network, das.url)
  },
)
