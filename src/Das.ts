import FetchProvider from './FetchProvider'
import ConfigurationError, { ConfigurationErrorCode } from './errors/configurationError'
import ResolutionError, { ResolutionErrorCode } from './errors/resolutionError'
import {
  AccountData,
  AccountDataCell,
} from './types/AccountData'
import {
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

  async account(account: string): Promise<AccountData & {avatar: string}> {
    if (!this.isSupportedDomain(account)) {
      throw new ResolutionError(ResolutionErrorCode.UnregisteredDomain, {
        domain: account,
      })
    }

    const data = await this.provider.request({
      method: 'das_searchAccount',
      params: [
        account,
      ]
    }) as {data: AccountDataCell}

    if (!data.data) {
      throw new ResolutionError(ResolutionErrorCode.UnregisteredDomain, {
        domain: account,
      });
    }

    data.data.account_data.records.forEach(record => {
      // the raw data is string, '300'
      record.ttl = Number(record.ttl)
      record.avatar = `https://identicons.da.systems/identicon/${account}`
    })

    return {
      ...data.data.account_data,
      avatar: `https://identicons.da.systems/identicon/${account}`
    }
  }

  async records(account: string, key?: string) {
    const accountData = await this.account(account)

    if (!key) {
      return accountData.records
    }

    key = key.toLowerCase()
    return accountData.records.filter(record => record.key === key)
  }

  async addrs(account: string, chain: string) {
    return this.records(account, `address.${chain}`)
  }

  async accountsForOwner(address: string) {
    const res = await this.provider.request({
      method: 'das_getAddressAccount',
      params: [address]
    }) as { data: AccountDataCell[] }

    const data = res.data || []

    return data.map( account => {
      return {
        ...account.account_data,
        avatar: `https://identicons.da.systems/identicon/${account}`
      }
    })
  }
}
