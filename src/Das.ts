import FetchProvider from './FetchProvider'
import ConfigurationError, { ConfigurationErrorCode } from './errors/configurationError'
import ResolutionError, { ResolutionErrorCode } from './errors/resolutionError'
import {
  AccountData,
  AccountInfo, AccountRecord, AccountRecordsData,
} from './types/AccountData'
import {
  KeyDescriptor,
  NamingServiceName,
  NamingServiceSource,
  Provider,
} from './types/publicTypes'

export class Das {
  readonly url?: string
  readonly provider: Provider
  readonly name = NamingServiceName.DAS

  constructor (source: NamingServiceSource = {}) {
    this.url = source.url

    if (source.provider) {
      this.provider = source.provider
    }
    else if (source.url) {
      this.provider = new FetchProvider(this.name, source.url)
    }
    else {
      throw new ConfigurationError(ConfigurationErrorCode.UnspecifiedUrl, {
        method: NamingServiceName.DAS
      })
    }
  }

  isSupportedDomain (account: string): boolean {
    return /.+\.bit/.test(account) && account.split('.').every(v => Boolean(v.length))
  }

  async account(account: string): Promise<AccountInfo & {avatar: string}> {
    if (!this.isSupportedDomain(account)) {
      throw new ResolutionError(ResolutionErrorCode.UnsupportedService, {
        domain: account,
      })
    }

    const data = await this.provider.request({
      method: 'das_accountInfo',
      params: [{
        account,
      }]
    }) as {data: AccountData}

    if (!data.data) {
      throw new ResolutionError(ResolutionErrorCode.UnregisteredDomain, {
        domain: account,
      })
    }

    return {
      ...data.data.account_info,
      avatar: `https://identicons.da.systems/identicon/${account}`
    }
  }

  async records(account: string, key?: string): Promise<AccountRecord[]> {
    if (!this.isSupportedDomain(account)) {
      throw new ResolutionError(ResolutionErrorCode.UnsupportedDomain, {
        domain: account,
      })
    }

    const res = await this.provider.request({
      method: 'das_accountRecords',
      params: [{
        account,
      }]
    }) as {data: AccountRecordsData}

    const accountData = res.data

    if (!accountData) {
      throw new ResolutionError(ResolutionErrorCode.UnregisteredDomain, {
        domain: account,
      })
    }

    if (!key) {
      return accountData.records
    }

    key = key.toLowerCase()
    return accountData.records.filter(record => record.key === key)
  }

  async addrs(account: string, chain: string) {
    return this.records(account, `address.${chain}`)
  }

  async reserveRecord(descriptor: KeyDescriptor): Promise<string> {
    const res = await this.provider.request({
      method: 'das_reverseRecord',
      params: [descriptor]
    }) as { data: {  account: string } }

    return res.data.account
  }
}
