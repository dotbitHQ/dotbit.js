import { BitAccount } from './BitAccount'
import { BitIndexer } from './fetchers/BitIndexer'
import { KeyInfo } from './fetchers/BitIndexer.type'

interface CacheProvider {
  get: (key: string, options?: any) => any,
  set: (key: string, value: any, options?: any) => any,
}

interface DotBitConfig {
  network?: 'mainnet' | 'testnet',
  cacheProvider?: CacheProvider,
  bitIndexerUri?: string,
  bitBuilderUri?: string,
  ckbIndexerUri?: string,
  ckbRpcUri?: string,
  signer?: any,
}

export class DotBit {
  cache: CacheProvider
  bitIndexer: BitIndexer

  constructor ({
    cacheProvider,
    bitIndexerUri,
  }: DotBitConfig) {
    this.cache = cacheProvider
    this.bitIndexer = new BitIndexer({
      uri: bitIndexerUri
    })
  }

  private getAccount (account: string): BitAccount {
    const cachedAccount = this.cache?.get(`account:${account}`)
    if (cachedAccount) return cachedAccount

    const bitAccount = new BitAccount({
      account,
      bitIndexer: this.bitIndexer
    })

    this.cache?.set(`account:${account}`, bitAccount)

    return bitAccount
  }

  async serverInfo () {
    return await this.bitIndexer.serverInfo()
  }

  async reverse (keyInfo: KeyInfo): Promise<BitAccount> {
    const { account } = await this.bitIndexer.reverseRecord(keyInfo)

    if (account) {
      return this.getAccount(account)
    }
  }

  async accountsOfOwner (keyInfo: KeyInfo): Promise<BitAccount[]> {
    const accounts =  await this.bitIndexer.accountList(keyInfo)

    return accounts.map(account => this.getAccount(account))
  }

  account (account: string): BitAccount {
    return this.getAccount(account)
  }

  async accountById (accountId: string): Promise<BitAccount> {
    const bitAccount = await this.bitIndexer.accountInfoById(accountId)
    return this.getAccount(bitAccount.account_info.account)
  }

  async records (account: string, key?: string) {
    const bitAccount = this.getAccount(account)

    return await bitAccount.records(key)
  }

  async addrs (account: string, chain?: string) {
    const bitAccount = this.getAccount(account)

    return await bitAccount.addrs(chain)
  }

  async dwebs (account: string, key?: string) {
    const bitAccount = this.getAccount(account)

    return await bitAccount.dwebs(key)
  }

  async dweb (account: string) {
    const bitAccount = this.getAccount(account)

    return await bitAccount.dweb()
  }

  async profiles (account: string, key?: string) {
    const bitAccount = this.getAccount(account)

    return await bitAccount.profiles(key)
  }

  async avatar (account: string) {
    const bitAccount = this.getAccount(account)

    return await bitAccount.avatar()
  }
}
