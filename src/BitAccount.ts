import { RecordsEditor } from './builders/RecordsEditor'
import { RemoteTxBuilder } from './builders/RemoteTxBuilder'
import {
  AccountStatus,
  SignType2CoinType,
  CheckSubAccountStatus,
  PaymentMethodIDs,
  DWebProtocol,
  RecordType
} from './const'
import { BitIndexer } from './fetchers/BitIndexer'
import {
  AccountInfo,
  BitAccountRecord,
  BitAccountRecordAddress,
  BitAccountRecordExtended,
  KeyInfo,
} from './fetchers/BitIndexer.type'
import { toEditingRecord } from './fetchers/RegisterAPI'
import {
  CheckAccountsParams,
  SubAccountListParams, SubAccountMintForAccount, SubAccountMintForAddress,
  SubAccountMintParams,
} from './fetchers/SubAccountAPI'
import { BitSigner } from './signers/BitSigner'
import { mapCoinTypeToSymbol, mapSymbolToCoinType } from './slip44/slip44'
import {
  isSupportedAccount,
  graphemesAccount,
  toDottedStyle,
  toRecordExtended,
} from './tools/account'
import { BitErrorCode, BitIndexerErrorCode, DotbitError } from './errors/DotbitError'
import { SignTxListParams } from './fetchers/RegisterAPI.type'
import { matchDWebProtocol } from './tools/common'

export interface BitAccountOptions {
  account: string,
  bitIndexer?: BitIndexer,
  bitBuilder?: RemoteTxBuilder,
  signer?: BitSigner,
}

export interface SubAccountParams {
  account: string,
  keyInfo?: KeyInfo, // The keyInfo has higher priority than mintForAccount.
  mintForAccount?: string,
  registerYears: number,
}

export interface RoleKeyInfo extends KeyInfo {
  algorithm_id: number,
}

export interface RegisterParam {
  keyInfo?: KeyInfo,
  registerYears: number,
  paymentMethodID: PaymentMethodIDs,
  inviterAccount?: string,
  channelAccount?: string,
}

export interface RenewParam {
  paymentMethodID: PaymentMethodIDs,
  renewYears: number,
}

export interface RenewRes extends RenewParam {
  keyInfo: KeyInfo,
  account: string,
  orderId: string,
  txHash: string,
}

export interface RegisterRes extends RegisterParam {
  account: string,
  orderId: string,
  txHash: string,
}

export class BitAccount {
  account: string
  bitIndexer: BitIndexer
  bitBuilder: RemoteTxBuilder
  signer: BitSigner

  constructor (options: BitAccountOptions) {
    if (!isSupportedAccount(options.account)) {
      throw new DotbitError(`${options.account} is not a valid .bit account`, BitIndexerErrorCode.AccountFormatInvalid)
    }

    this.account = options.account

    if (options.bitIndexer) {
      this.bitIndexer = options.bitIndexer
    }

    if (options.bitBuilder) {
      this.bitBuilder = options.bitBuilder
    }

    if (options.signer) {
      this.signer = options.signer
    }
  }

  protected _info: AccountInfo
  protected _records: BitAccountRecordExtended[]

  status: AccountStatus

  protected requireSigner () {
    if (!this.signer) {
      throw new DotbitError('signer is required', BitErrorCode.SignerRequired)
    }
  }

  protected requireBitBuilder () {
    if (!this.bitBuilder) {
      throw new DotbitError('bitBuilder is required', BitErrorCode.BitBuilderRequired)
    }
  }

  /** writer **/
  setReverseRecord () {
    this.requireBitBuilder()
    // TODO
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

  async checkSubAccounts (subAccounts: SubAccountMintParams[]) {
    const address = await this.signer.getAddress()
    const coinType = await this.signer.getCoinType()

    return await this.bitBuilder.subAccountAPI.checkSubAccounts({
      account: this.account,
      type: 'blockchain',
      key_info: {
        key: address,
        coin_type: coinType
      },
      sub_account_list: subAccounts
    })
  }

  /**
   * Mint multiple sub accounts at once
   * Please wait for about 2~3 minutes between each invocation of this method. (We need to wait for previous tx confirmed for 4 blocks)
   * Please mint no more than 50 sub accounts for every invocation.(The hard limit is 80 due to the block size of nervos network, so 50 would be a safe value)
   * @param params
   */
  async mintSubAccounts (params: SubAccountParams[]) {
    this.requireBitBuilder()
    this.requireSigner()

    const address = await this.signer.getAddress()
    const coinType = await this.signer.getCoinType()

    const mintSubAccountsParams: CheckAccountsParams = {
      account: this.account,
      type: 'blockchain',
      key_info: {
        key: address,
        coin_type: coinType
      },
      sub_account_list: params.map(param => {
        const account = toDottedStyle(param.account)

        if (param.mintForAccount) {
          return {
            account,
            mint_for_account: param.mintForAccount,
            register_years: param.registerYears,
            account_char_str: graphemesAccount(account.split('.')[0]),
          } as SubAccountMintForAccount
        }
        else {
          return {
            account,
            type: 'blockchain',
            key_info: param.keyInfo,
            register_years: param.registerYears,
            account_char_str: graphemesAccount(account.split('.')[0])
          } as SubAccountMintForAddress
        }
      })
    }

    const checkResults = await this.checkSubAccounts(mintSubAccountsParams.sub_account_list)

    checkResults.result.forEach(result => {
      if (result.status !== CheckSubAccountStatus.ok) {
        throw new DotbitError(`Second-level DID ${result.account} can not be registered, reason: ${result.message}, status ${result.status}`, BitErrorCode.SubAccountStatusInvalid)
      }
    })

    const txs = await this.bitBuilder.mintSubAccounts(mintSubAccountsParams)

    const signatureList = await this.signer.signTxList(txs)

    return await this.bitBuilder.subAccountAPI.sendTransaction(signatureList)
  }

  /**
   * Mint a sub account
   * @param params
   */
  mintSubAccount (params: SubAccountParams) {
    return this.mintSubAccounts([params])
  }

  async #changeOwnerManager (keyInfo: KeyInfo, isOwner = true) {
    const signerAddress = await this.signer.getAddress()
    const signerCoinType = await this.signer.getCoinType()
    const signerChainId = await this.signer.getChainId()

    let mmJsonTxs: SignTxListParams
    if (isOwner) {
      mmJsonTxs = await this.bitBuilder.changeOwner({
        keyInfo: {
          coin_type: signerCoinType,
          key: signerAddress
        },
        evm_chain_id: signerChainId,
        account: this.account,
        raw_param: {
          receiver_address: keyInfo.key,
          receiver_coin_type: keyInfo.coin_type,
        },
      })
    }
    else {
      mmJsonTxs = await this.bitBuilder.changeManager({
        keyInfo: {
          coin_type: signerCoinType,
          key: signerAddress
        },
        evm_chain_id: signerChainId,
        account: this.account,
        raw_param: {
          manager_address: keyInfo.key,
          manager_coin_type: keyInfo.coin_type,
        },
      })
    }

    const signatureList = await this.signer.signTxList(mmJsonTxs)

    return await this.bitBuilder.registerAPI.sendTransaction(signatureList)
  }

  /**
   * Change the owner key of an account
   * You should wait for 5 minutes between each invocation of this method
   * @param keyInfo
   */
  changeOwner (keyInfo: KeyInfo) {
    return this.#changeOwnerManager(keyInfo, true)
  }

  /**
   * Change the manager key of an account
   * You should wait for 5 minutes between each invocation of this method
   * @param keyInfo
   */
  changeManager (keyInfo: KeyInfo) {
    return this.#changeOwnerManager(keyInfo, false)
  }

  /**
   * Update all the records with given records
   * @param records
   */
  async updateRecords (records: BitAccountRecord[]) {
    this.requireBitBuilder()
    this.requireSigner()

    const signerAddress = await this.signer.getAddress()
    const signerCoinType = await this.signer.getCoinType()
    const signerChainId = await this.signer.getChainId()

    const txs = await this.bitBuilder.editRecords({
      keyInfo: {
        coin_type: signerCoinType,
        key: signerAddress
      },
      evm_chain_id: signerChainId,
      account: this.account,
      raw_param: {
        records: records.map(toEditingRecord)
      },
    })

    const signatureList = await this.signer.signTxList(txs)
    return await this.bitBuilder.registerAPI.sendTransaction(signatureList)
  }

  /**
   * Update records in a chaining way
   */
  async editRecords () {
    const records = await this.records()
    return new RecordsEditor(records, this)
  }

  /** reader **/

  async info (): Promise<AccountInfo> {
    if (!this._info) {
      const info = (await this.bitIndexer.accountInfo(this.account)).account_info

      this._info = info
    }

    return this._info
  }

  async owner (): Promise<RoleKeyInfo> {
    const info = await this.info()
    return {
      key: info.owner_key,
      coin_type: SignType2CoinType[info.owner_algorithm_id],
      algorithm_id: info.owner_algorithm_id,
    }
  }

  async manager (): Promise<RoleKeyInfo> {
    const info = await this.info()
    return {
      key: info.manager_key,
      coin_type: SignType2CoinType[info.manager_algorithm_id],
      algorithm_id: info.manager_algorithm_id,
    }
  }

  async records (key?: string): Promise<BitAccountRecordExtended[]> {
    if (!this._records) {
      const records =  (await this.bitIndexer.accountRecords(this.account))

      this._records = records.map(toRecordExtended)
    }

    key = key?.toLowerCase()

    return key ? this._records.filter(record => record.key === key) : this._records
  }

  async #addrs (chain?: string): Promise<BitAccountRecordAddress[]> {
    const records = await this.records()

    const addresses = records
      .filter(record => record.type === RecordType.address)
      .map<BitAccountRecordAddress>(record => {
      return ({
        ...record,
        coin_type: mapSymbolToCoinType(record.subtype),
      })
    })
    // for the sake of compatibility, we need to search for both coinType & symbol
    if (chain) {
      const coinType = mapSymbolToCoinType(chain)
      const symbol = mapCoinTypeToSymbol(chain).toLowerCase()

      return addresses.filter(record => record.coin_type === coinType || record.subtype === symbol || record.subtype === coinType)
    }
    else {
      return addresses
    }
  }

  addresses (chain?: string) {
    return this.#addrs(chain)
  }

  addrs (chain?: string) {
    return this.#addrs(chain)
  }

  async dwebs (protocol?: DWebProtocol): Promise<BitAccountRecordExtended[]> {
    const records = await this.records()

    let dwebs = records.filter(record => record.type === RecordType.dweb)
    dwebs = dwebs.map((record) => {
      const matched = matchDWebProtocol(record.value)
      if (matched) {
        record.value = matched[2]
      }
      return record
    })
    return protocol ? dwebs.filter(record => record.subtype === protocol.toLowerCase()) : dwebs
  }

  /**
   * Resolve a dweb in a specific sequence
   */
  async dweb (): Promise<BitAccountRecordExtended | undefined> {
    const dwebs = await this.dwebs()

    if (!dwebs.length) {
      return undefined
    }
    else if (dwebs.length === 1) {
      return dwebs[0]
    }
    else {
      const protocol = [DWebProtocol.ipns, DWebProtocol.ipfs, DWebProtocol.arweave, DWebProtocol.skynet, DWebProtocol.resilio].find(protocol => dwebs.find(dweb => dweb.subtype === protocol))
      return dwebs.find(dweb => dweb.subtype === protocol)
    }
  }

  async profiles (subtype?: string) {
    const records = await this.records()

    const profiles = records.filter(record => record.type === RecordType.profile)
    return subtype ? profiles.filter(record => record.subtype === subtype.toLowerCase()) : profiles
  }

  avatar (): Promise<{ linkage: Array<{ type: string, content: string }>, url: string } | null>
  avatar (): any {
    throw new DotbitError('Please install @dotbit/plugin-avatar to get users avatar', BitErrorCode.PluginRequired)
  }

  register (param: RegisterParam): Promise<RegisterRes> {
    throw new DotbitError('Please install plugin @dotbit/plugin-register', BitErrorCode.PluginRequired)
  }

  renew (param: RenewParam): Promise<RenewRes> {
    throw new DotbitError('Please install plugin @dotbit/plugin-register', BitErrorCode.PluginRequired)
  }
}
