import FetchProvider from './FetchProvider'
import { NamingService } from './NamingService'
import ConfigurationError, { ConfigurationErrorCode } from './errors/configurationError'
import ResolutionError, { ResolutionErrorCode } from './errors/resolutionError'
import {
  AccountData,
  AccountDataCell,
  AccountRecord,
} from './types/AccountData'
import { BlockhanNetworkUrlMap, DasSupportedNetwork } from './types/index'
import {
  CryptoRecords,
  DasSource,
  NamingServiceName,
  Provider,
  ResolutionMethod,
} from './types/publicTypes'

export class Das extends NamingService {
  static readonly UrlMap: BlockhanNetworkUrlMap = {
    'mainnet': '', // todo: fill
    'testnet': 'http://47.243.90.165:8223',
    'aggron': 'http://47.243.90.165:8223',
  }

  readonly name = NamingServiceName.DAS
  readonly network: string // check if there is some numeric network id todo:
  readonly url: string | undefined
  readonly provider: Provider // temporarily not in use todo:

  constructor (source?: DasSource) {
    super();

    if (!source) {
      source = {
        url: Das.UrlMap['mainnet'],
        network: 'mainnet'
      }
    }

    if (!source.network || !DasSupportedNetwork.guard(source.network)) {
      throw new ConfigurationError(ConfigurationErrorCode.UnsupportedNetwork, {
        method: NamingServiceName.DAS,
      })
    }

    this.network = source.network
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.url = source.url || Das.UrlMap[this.network]
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.provider = source.provider || new FetchProvider(this.name, this.url)
  }

  // todo: implement autonetwork
  static async autonetwork(config: { url: string } | { provider: Provider }): Promise<Das> {
    return new Das({
      network: 'mainnet',
      provider: (config as {provider: Provider}).provider,
    })
  }

  serviceName (): ResolutionMethod {
    return this.name
  }

  isSupportedDomain (account: string): boolean {
    return /.+\.bit/.test(account) && account.split('.').every(v => Boolean(v.length))
  }

  // todo: implement namehash
  namehash (account: string): string {
    if (!this.isSupportedDomain(account)) {
      throw new ResolutionError(ResolutionErrorCode.UnregisteredDomain, {
        domain: account,
      })
    }

    return ''
  }

  // todo: implement childhash
  childhash (parentHash: string, label: string): string {
    return `${parentHash} ${label}`
  }

  async owner (account: string): Promise<string> {
    const accountData = await this.getAccountData(account)

    return accountData.owner_lock_args_hex
  }

  async resolver (account: string): Promise<string> {
    throw new ResolutionError(ResolutionErrorCode.UnsupportedMethod, {
      domain: account,
      methodName: 'resolver',
    })
  }

  async record(account: string, key: string): Promise<string> {
    key = key.toLowerCase()
    const returnee = (await this.allRecords(account))[key]

    if (!returnee) {
      throw new ResolutionError(ResolutionErrorCode.RecordNotFound, {
        domain: account,
        recordName: key,
      })
    }

    return returnee
  }

  async records (account: string, keys: string[]): Promise<CryptoRecords> {
    const records = await this.allRecords(account)

    return keys.reduce((returnee: Record<string, string>, key) => {
      returnee[key] = records[key] || ''
      return returnee
    }, {})
  }

  async allRecords (account: string): Promise<Record<string, string>> {
    const data = await this.getAccountData(account)

    if (data) {
      const records: {key: string, value: string}[] = data.records

      const returnee: CryptoRecords = {}

      records.forEach(record => {
        returnee[record.key.toLowerCase()] = record.value
      })

      return returnee
    }
    // no records
    else {
      return {}
    }
  }

  async reverse(address: string, currencyTicker: string): Promise<string | null> {
    if (!['ETH', 'CKB'].includes(currencyTicker)) {
      throw new Error('Das does not support any chain other than CKB and ETH')
    }

    const accounts = await this.allReverse(address)

    return accounts[0]
  }

  async isRegistered(account: string): Promise<boolean> {
    const accountData = await this.getAccountData(account);

    return Boolean(accountData);
  }

  twitter (account: string): Promise<string> {
    throw new ResolutionError(ResolutionErrorCode.UnsupportedMethod, {
      domain: account,
      methodName: 'twitter'
    })
  }
  /* -------- custom methods --------- */

  /**
   * return all the records for the give key
   * @param account
   * @param key
   */
  async recordsByKey(account: string, key: string): Promise<AccountRecord[]> {
    const accountData = await this.getAccountData(account)

    return await accountData.records.filter(record => record.key === key)
  }

  async addr(account: string, ticker: string) {
    return await this.record(account, `account.${ticker}`)
  }

  async allReverse(address: string): Promise<string[]> {
    const data = await this.provider.request({
      method: 'das_getAddressAccount',
      params: [address],
    }) as any

    const accounts: { account: string }[] = data.data.account_data

    return accounts.map(account => account.account)
  }

  async getAccountData(account: string): Promise<AccountData> {
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
    })

    return data.data.account_data
  }
}
