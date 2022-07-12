import { RemoteTxBuilder } from './builders/RemoteTxBuilder'
import { AccountStatus, CheckSubAccountStatus, RecordType } from './const'
import { BitIndexer } from './fetchers/BitIndexer'
import { AccountInfo, BitAccountRecordExtended, KeyInfo } from './fetchers/BitIndexer.type'
import { SubAccountListParams } from './fetchers/SubAccountAPI'
import { BitSigner } from './signers/BitSigner'
import { isSupportedAccount, toDottedStyle } from './tools/account'
import { BitErrorCode, BitIndexerErrorCode, CodedError } from './tools/CodedError'

interface BitAccountOptions {
  account: string,
  bitIndexer?: BitIndexer,
  bitBuilder?: RemoteTxBuilder,
  signer?: BitSigner,
}

export interface SubAccountParams {
  account: string,
  keyInfo: KeyInfo,
  registerYears: number,
}

export class BitAccount {
  account: string
  bitIndexer: BitIndexer
  bitBuilder: RemoteTxBuilder
  signer: BitSigner

  constructor (options: BitAccountOptions) {
    if (!isSupportedAccount(options.account)) {
      throw new CodedError(`${options.account} is not a valid .bit account`, BitIndexerErrorCode.AccountFormatInvalid)
    }

    this.account = options.account
    this.bitIndexer = options.bitIndexer
    this.bitBuilder = options.bitBuilder
    this.signer = options.signer
  }

  #info: AccountInfo
  #records: BitAccountRecordExtended[]

  status: AccountStatus

  requireSigner () {
    if (!this.signer) {
      throw new CodedError('signer is required', BitErrorCode.SignerRequired)
    }
  }

  requireBitBuilder () {
    if (!this.bitBuilder) {
      throw new CodedError('bitBuilder is required', BitErrorCode.BitBuilderRequired)
    }
  }

  /** writer **/
  setOwner (address: string, coinType: string) {
    this.requireBitBuilder()
  }

  setManager () {
    this.requireBitBuilder()
  }

  setRecords (key: string, records: any[]) {
    this.requireBitBuilder()
  }

  setReverseRecord () {
    this.requireBitBuilder()
  }

  async enableSubAccount () {
    this.requireBitBuilder()
    this.requireSigner()

    const info = await this.info()
    const coinType = await this.signer.getCoinType()

    const txs = await this.bitBuilder.enableSubAccount(this.account, {
      key: info.owner_key,
      coin_type: coinType,
    })

    await this.signer.signTxList(txs)

    const res = await this.bitBuilder.subAccountAPI.sendTransaction(txs)
    return res
  }

  /**
   * Mint multiple sub accounts at once
   * @param params
   */
  async mintSubAccounts (params: SubAccountParams[]) {
    this.requireBitBuilder()
    this.requireSigner()

    const info = await this.info()
    const coinType = await this.signer.getCoinType()

    const mintSubAccountsParams = {
      account: this.account,
      type: 'blockchain',
      key_info: {
        key: info.owner_key,
        coin_type: coinType
      },
      sub_account_list: params.map(param => {
        return {
          account: toDottedStyle(param.account),
          type: 'blockchain',
          key_info: param.keyInfo,
          register_years: param.registerYears,
        }
      })
    }

    const checkResults = await this.bitBuilder.subAccountAPI.checkSubAccounts(mintSubAccountsParams)

    checkResults.result.forEach(result => {
      if (result.status !== CheckSubAccountStatus.ok) {
        throw new CodedError(`Sub-account ${result.account} can not be registered, reason: ${result.message}, status ${result.status}`, BitErrorCode.SubAccountStatusInvalid)
      }
    })

    const txs = await this.bitBuilder.subAccountAPI.createSubAccounts(mintSubAccountsParams)

    await this.signer.signTxList(txs)

    return await this.bitBuilder.subAccountAPI.sendTransaction(txs)
  }

  /**
   * Mint a sub account
   * @param params
   */
  mintSubAccount (params: SubAccountParams) {
    return this.mintSubAccounts([params])
  }

  /**
   * List the sub accounts of a main account, with pagination and filter
   * @param params Omit<SubAccountListParams, 'account'>
   */
  subAccounts (params: Omit<SubAccountListParams, 'account'> = { page: 1, size: 100, keyword: '' }) {
    return this.bitBuilder.subAccountAPI.subAccountList({
      account: this.account,
      page: params.page,
      size: params.size,
      keyword: params.keyword,
    })
  }

  /** reader **/

  async info (): Promise<AccountInfo> {
    if (!this.#info) {
      const info = (await this.bitIndexer.accountInfo(this.account)).account_info

      this.#info = info
    }

    return this.#info
  }

  async owner () {
    const info = await this.info()
    return info.owner_key
  }

  async records (key?: string): Promise<BitAccountRecordExtended[]> {
    if (!this.#records) {
      const records =  (await this.bitIndexer.accountRecords(this.account))

      this.#records = records.map(record => {
        return Object.assign(record, {
          type: record.key.split('.')[0],
          subtype: record.key.split('.')[1],
        })
      })
    }

    key = key?.toLowerCase()

    return key ? this.#records.filter(record => record.key === key) : this.#records
  }

  async #addrs (chain?: string) {
    const records = await this.records()

    const addresses = records.filter(record => record.type === RecordType.address)
    return chain ? addresses.filter(record => record.subtype === chain.toLowerCase()) : addresses
  }

  addresses (chain?: string) {
    return this.#addrs(chain)
  }

  addrs (chain?: string) {
    return this.#addrs(chain)
  }

  async dwebs (protocol?: string) {
    const records = await this.records()

    const dwebs = records.filter(record => record.type === RecordType.dweb)
    return protocol ? dwebs.filter(record => record.subtype === protocol.toLowerCase()) : dwebs
  }

  /**
   * Resolve a dweb in a specific sequence
   */
  async dweb () {
    const dwebs = await this.dwebs()

    if (!dwebs.length) {
      return null
    }
    else if (dwebs.length === 1) {
      return dwebs[0]
    }
    else {
      ;['ipns', 'ipfs', 'skynet', 'resilio'].find(protocol => dwebs.find(dweb => dweb.subtype === protocol))
    }
  }

  async profiles (subtype?: string) {
    const records = await this.records()

    const profiles = records.filter(record => record.type === RecordType.profile)
    return subtype ? profiles.filter(record => record.subtype === subtype.toLowerCase()) : profiles
  }

  async avatar () {

  }
}
