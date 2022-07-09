import { RemoteTxBuilder } from './builders/RemoteTxBuilder'
import { AccountStatus, CheckSubAccountStatus, RecordType } from './const'
import { BitIndexer } from './fetchers/BitIndexer'
import { AccountInfo, BitAccountRecordExtended, KeyInfo } from './fetchers/BitIndexer.type'
import { EthersSigner } from './signers/EthersSigner'
import { isSupportedAccount } from './tools/account'
import { BitErrorCode, BitIndexerErrorCode, CodedError } from './tools/CodedError'

interface BitAccountOptions {
  account: string,
  bitIndexer?: BitIndexer,
  bitBuilder?: RemoteTxBuilder,
  signer?: EthersSigner,
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
  signer: EthersSigner

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
      throw new Error('signer is required')
    }
  }

  requireTxBuilder () {
    if (!this.bitBuilder) {
      throw new Error('txBuilder is required')
    }
  }

  /** writer **/
  setOwner (address: string, coinType: string) {
    this.requireTxBuilder()
  }

  setManager () {
    this.requireTxBuilder()
  }

  setRecords (key: string, records: any[]) {
    this.requireTxBuilder()
  }

  setReverseRecord () {
    this.requireTxBuilder()
  }

  async enableSubAccount () {
    this.requireTxBuilder()
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

  async mintSubAccount (params: SubAccountParams) {
    this.requireTxBuilder()
    this.requireSigner()

    const info = await this.info()
    const coinType = await this.signer.getCoinType()

    const mintSubAccountParams = {
      account: this.account,
      type: 'blockchain',
      key_info: {
        key: info.owner_key,
        coin_type: coinType
      },
      sub_account_list: [{
        account: params.account,
        type: 'blockchain',
        key_info: params.keyInfo,
        register_years: params.registerYears,
      }],
    }

    const checkResults = await this.bitBuilder.subAccountAPI.checkSubAccounts(mintSubAccountParams)

    checkResults.result.forEach(result => {
      if (result.status !== CheckSubAccountStatus.ok) {
        throw new CodedError(`Sub-account ${result.account} can not be registered, reason: ${result.message}, status ${result.status}`, BitErrorCode.SubAccountStatusInvalid)
      }
    })

    const txs = await this.bitBuilder.subAccountAPI.createSubAccounts(mintSubAccountParams)

    await this.signer.signTxList(txs)

    return await this.bitBuilder.subAccountAPI.sendTransaction(txs)
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

  async addrs (chain?: string) {
    const records = await this.records()

    const addresses = records.filter(record => record.type === RecordType.address)
    return chain ? addresses.filter(record => record.subtype === chain.toLowerCase()) : addresses
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

  async subAccounts () {

  }
}
