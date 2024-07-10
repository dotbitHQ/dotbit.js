import { BitAccount } from './BitAccount'
import { BitSubAccount } from './BitSubAccount'
import { RemoteTxBuilder } from './builders/RemoteTxBuilder'
import { BitNetwork, DWebProtocol } from './const'
import { BitIndexer } from './fetchers/BitIndexer'
import { BitAccountListItem, KeyInfo } from './fetchers/BitIndexer.type'
import { BitSigner } from './signers/BitSigner'
import { isSubAccount } from './tools/account'
import { BitErrorCode, BitIndexerErrorCode, DotbitError } from './errors/DotbitError'
import { isEmptyAddress } from './tools/common'
import { BitPluginBase } from './types'
import { version } from './version'

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
  version = version
  network: BitNetwork
  cacheProvider: CacheProvider
  bitIndexer: BitIndexer
  bitBuilder: RemoteTxBuilder
  signer: BitSigner

  plugins: BitPluginBase[] = []

  constructor (config: DotBitConfig = {}) {
    if (config.network) {
      this.network = config.network
    }

    if (config.cacheProvider) {
      this.cacheProvider = config.cacheProvider
    }

    if (config.bitIndexer) {
      this.bitIndexer = config.bitIndexer
    }

    if (config.bitBuilder) {
      this.bitBuilder = config.bitBuilder
    }

    if (config.signer) {
      this.signer = config.signer
    }
  }

  installPlugin (plugin: BitPluginBase) {
    if (plugin.onInstall) {
      plugin.onInstall(this)
      this.plugins.push(plugin)
    }
    else {
      console.warn(`Plugin '${plugin?.name ?? ''}' does not have 'onInstall' method, please check your plugin`)
    }
  }

  uninstallPlugin (plugin: BitPluginBase) {
    const index = this.plugins.indexOf(plugin)
    this.plugins.splice(index, 1)
    plugin.onUninstall?.(this)
  }

  private getAccount (account: string): BitAccount {
    let bitAccount: BitAccount = this.cacheProvider?.get(`account:${account}`)
    if (bitAccount) return bitAccount

    if (isSubAccount(account)) {
      bitAccount = new BitSubAccount({
        account,
        bitIndexer: this.bitIndexer,
        bitBuilder: this.bitBuilder,
        signer: this.signer,
      })
    }
    else {
      bitAccount = new BitAccount({
        account,
        bitIndexer: this.bitIndexer,
        bitBuilder: this.bitBuilder,
        signer: this.signer,
      })
    }

    this.plugins.forEach(plugin => plugin.onInitAccount?.(bitAccount))

    this.cacheProvider?.set(`account:${account}`, bitAccount)

    return bitAccount
  }

  async serverInfo () {
    return await this.bitIndexer.serverInfo()
  }

  async reverse (keyInfo: KeyInfo): Promise<BitAccount | undefined> {
    const { account } = await this.bitIndexer.reverseRecord(keyInfo)

    if (account) {
      return this.getAccount(account)
    }
  }

  alias (keyInfo: KeyInfo): Promise<BitAccount | undefined> {
    return this.reverse(keyInfo)
  }

  async accountsOfOwner (keyInfo: KeyInfo): Promise<BitAccountListItem[]> {
    const accounts =  await this.bitIndexer.accountList(keyInfo)

    return accounts
  }

  async accountsOfManager (keyInfo: KeyInfo): Promise<BitAccountListItem[]> {
    const accounts =  await this.bitIndexer.accountList(keyInfo, 'manager')

    return accounts
  }

  account (account: string): BitAccount {
    return this.getAccount(account)
  }

  exist (account: string): Promise<boolean> {
    const bitAccount = this.getAccount(account)

    return bitAccount.info()
      .then(() => true)
      .catch((err) => {
        if ((err as DotbitError).code === BitIndexerErrorCode.AccountNotExist) {
          return false
        }
        throw err
      })
  }

  async accountById (accountId: string): Promise<BitAccount> {
    if (isEmptyAddress(accountId)) {
      throw new DotbitError('Please provide a valid account id, current: ' + accountId, BitErrorCode.InvalidAccountId)
    }
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
    return this.#addrs(account, chain)
  }

  addrs (account: string, chain?: string) {
    return this.#addrs(account, chain)
  }

  async dwebs (account: string, key?: DWebProtocol) {
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

  /**
   * Check if the address has the specified Second-level DID under the designated account.
   * @param address
   * @param mainAccount
   * @param subAccount
   * @param verifyType default 0 === "owner", 1 === "manager"
   */
  async verifyAddrsByAccount (address: string, mainAccount: string, subAccount?: string, verifyType?: number) {
    return await this.bitIndexer.subAccountVerify(address, mainAccount, subAccount, verifyType)
  }

  /**
   * Query the valid alias address using the .bit alias.
   * @param account
   */
  async validDotbitAliasAddresses (account: string) {
    return await this.bitIndexer.validDotbitAliasAddresses(account)
  }

  /**
   * Batch query of account information. Currently, only information about whether the account can be registered is returned. A maximum of 50 accounts can be queried at a time.
   * @param accounts
   */
  async batchAccountInfo (accounts: string[]) {
    return await this.bitIndexer.batchAccountInfo(accounts)
  }

  /**
   * Get DOB list
   * @param keyInfo
   * @param didType
   * @param page
   * @param size
   */
  async dobList (keyInfo: KeyInfo, didType = 1, page = 1, size = 100) {
    return await this.bitIndexer.dobList({
      keyInfo,
      didType,
      page,
      size
    })
  }
}
