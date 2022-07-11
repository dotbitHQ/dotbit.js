import { BitAccount } from './BitAccount'
import { RemoteTxBuilder } from './builders/RemoteTxBuilder'
import { BitNetwork } from './const'
import { BitIndexer } from './fetchers/BitIndexer'
import { KeyInfo } from './fetchers/BitIndexer.type'
import { BitSigner } from './signers/BitSigner'

interface CacheProvider {
  get: (key: string, options?: any) => any,
  set: (key: string, value: any, options?: any) => any,
}

export interface DotBitConfig {
  network?: BitNetwork,
  cacheProvider?: CacheProvider,
  bitIndexer?: BitIndexer,
  bitBuilder?: RemoteTxBuilder,
  signer?: BitSigner,
}

export class DotBit {
  network: BitNetwork
  cacheProvider: CacheProvider
  bitIndexer: BitIndexer
  bitBuilder: RemoteTxBuilder
  signer: BitSigner

  constructor (config: DotBitConfig) {
    this.network = config.network
    this.cacheProvider = config.cacheProvider
    this.bitIndexer = config.bitIndexer
    this.bitBuilder = config.bitBuilder
    this.signer = config.signer
  }

  private getAccount (account: string): BitAccount {
    const cachedAccount = this.cacheProvider?.get(`account:${account}`)
    if (cachedAccount) return cachedAccount

    const bitAccount = new BitAccount({
      account,
      bitIndexer: this.bitIndexer,
      bitBuilder: this.bitBuilder,
      signer: this.signer,
    })

    this.cacheProvider?.set(`account:${account}`, bitAccount)

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

  records (account: string, key?: string) {
    const bitAccount = this.getAccount(account)

    return bitAccount.records(key)
  }

  accountInfo (account: string) {
    const bitAccount = this.getAccount(account)

    return bitAccount.info()
  }

  #addrs (account: string, chain?: string) {
    const bitAccount = this.getAccount(account)

    return bitAccount.addrs(chain)
  }

  addresses (account: string, chain?: string) {
    return this.#addrs(chain)
  }

  addrs (account: string, chain?: string) {
    return this.#addrs(chain)
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
