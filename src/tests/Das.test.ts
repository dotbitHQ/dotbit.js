import test from 'ava'

import { Das } from '../Das'
import { DasService } from '../DasService'
import ResolutionError, { ResolutionErrorCode } from '../errors/resolutionError'

let das: Das
let dasService: DasService

test.before(() => {
  dasService = new DasService({
    url: DasService.UrlMap['aggron'],
    network: 'aggron'
  })

  das = new Das({
    url: 'https://indexer.da.systems',
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
  'dasService.getAccountData()',
  async (t, account: string) => {
    const accountData = await dasService.getAccountData(account)

    t.not(accountData, null)
    t.not(accountData, null)
    t.is(accountData.account, account)
    t.not(accountData.records.length, 0)
  },
  'jeffjing.bit',
);

test(
  'dasService.record()',
  async (t, account: string, address: string) => {
    const error: ResolutionError = await t.throwsAsync(dasService.record(account, 'eth'))
    t.true(error.code === ResolutionErrorCode.RecordNotFound)

    const ethAddress = await dasService.record(account, 'address.eth')
    const ethAddressWithUpperCaseKey = await dasService.record(account, 'address.ETH')

    t.is(ethAddress, address)
    t.true(ethAddress === ethAddressWithUpperCaseKey)
  },
  'jeffjing.bit',
  '0x5fd1d0DAD20817951E40043fEE7655548838D82E'
)

test(
  'dasService.records()',
  async (t, account: string, keys: string[]) => {
    const records = await dasService.records(account, keys)

    t.not(Object.keys(records).length, 0)
    t.is(records['address.eth'], '0x5fd1d0DAD20817951E40043fEE7655548838D82E')
  },
  'jeffjing.bit',
  ['address.eth', 'profile.phone', 'address.btc'],
)

test(
  'dasService.recordsByKey()',
  async (t, account: string, key: string) => {
    const records = await dasService.recordsByKey(account, key)

    t.true(Array.isArray(records))
    t.truthy(records)
  },
  'jeffjing.bit',
  'address.eth',
)

test(
  'dasService.account()',
  async (t, account) => {
    const accountRes = await dasService.account(account)

    t.is(accountRes.avatar, 'https://identicons.da.systems/identicon/jeffjing.bit')
    t.is(accountRes.account, 'jeffjing.bit')

    t.true(accountRes.records.length > 0)

    t.true(Array.isArray(accountRes.profiles))

    t.is(typeof accountRes.profile, 'object')
    t.truthy(accountRes.address['eth'].value)
  },
  'jeffjing.bit',
)

test(
  'dasService.autonetwork()',
  async (t) => {
    const das = await DasService.autonetwork()

    t.is(das.network, 'mainnet')
    t.is(das.url, 'https://indexer.da.systems')
  },
)
