import test from 'ava'

import { Das } from '../Das'
import ResolutionError, { ResolutionErrorCode } from '../errors/resolutionError'

let das: Das

test.before(() => {
  das = new Das({
    network: 'aggron'
  })
})

test(
  'das.getAccountData()',
  async (t, domain: string) => {
    const accountData = await das.getAccountData(domain)

    console.log(accountData.account_data)

    t.not(accountData, null)
    t.not(accountData.account_data, null)
    t.is(accountData.account_data.account, domain)
    t.not(accountData.account_data.records.length, 0)
  },
  'jeffjing.bit',
);

test(
  'das.record()',
  async (t, domain: string, address: string) => {
    const error: ResolutionError = await t.throwsAsync(das.record(domain, 'eth'))
    t.true(error.code === ResolutionErrorCode.RecordNotFound)

    const ethAddress = await das.record(domain, 'address.eth')
    const ethAddressWithUpperCaseKey = await das.record(domain, 'address.ETH')

    t.is(ethAddress, address)
    t.true(ethAddress === ethAddressWithUpperCaseKey)
  },
  'jeffjing.bit',
  '0x5fd1d0DAD20817951E40043fEE7655548838D82E'
)

test(
  'das.records()',
  async (t, domain: string, keys: string[]) => {
    const records = await das.records(domain, keys)

    console.log(records)

    t.not(Object.keys(records).length, 0)
    t.is(records['address.eth'], '0x5fd1d0DAD20817951E40043fEE7655548838D82E')
  },
  'jeffjing.bit',
  ['address.eth', 'profile.phone', 'address.btc'],
)
