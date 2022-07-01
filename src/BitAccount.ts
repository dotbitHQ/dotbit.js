import { AccountStatus, RecordType } from './const'
import { BitIndexer } from './fetchers/BitIndexer'
import { AccountInfo, BitAccountRecordExtended } from './fetchers/BitIndexer.type'
import { isSupportedAccount } from './tools/account'
import { BitIndexerErrorCode, CodedError } from './tools/CodedError'

interface BitAccountOptions {
  account: string,
  bitIndexer?: BitIndexer,
  txBuilder?: any,
  signer?: any,
}

export class BitAccount {
  account: string
  bitIndexer: BitIndexer
  txBuilder: any
  signer: any

  constructor (options: BitAccountOptions) {
    if (!isSupportedAccount(options.account)) {
      throw new CodedError(`${options.account} is not a valid .bit account`, BitIndexerErrorCode.AccountFormatInvalid)
    }

    this.account = options.account
    this.bitIndexer = options.bitIndexer
    this.txBuilder = options.txBuilder
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

  requireTxProvider () {
    if (!this.txBuilder) {
      throw new Error('txProvider is required')
    }
  }

  /** writer **/
  setOwner (address: string, coinType: string) {
    this.requireTxProvider()
  }

  setManager () {
    this.requireTxProvider()
  }

  setRecords (key: string, records: any[]) {
    this.requireTxProvider()
  }

  setReverseRecord () {
    this.requireTxProvider()
  }

  createSubAccount () {
    this.requireTxProvider()
  }

  /** reader **/

  async info (): Promise<AccountInfo> {
    if (!this.#info) {
      this.#info = (await this.bitIndexer.accountInfo(this.account)).account_info
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
