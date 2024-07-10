import { BitAccount, BitAccountOptions } from './BitAccount'
import { BitAccountRecord, KeyInfo } from './fetchers/BitIndexer.type'
import { toEditingRecord } from './fetchers/RegisterAPI'
import { EditAccountRecord, SignTxListRes } from './fetchers/RegisterAPI.type'
import {
  EditSubAccountEditKey,
  EditSubAccountParams,
  SubAccountListParams,
  SubAccountMintParams
} from './fetchers/SubAccountAPI'
import { BitErrorCode, DotbitError } from './errors/DotbitError'
import { isSubAccount } from './tools/account'

export class BitSubAccount extends BitAccount {
  isSubAccount = true
  mainAccount: string

  constructor (options: BitAccountOptions) {
    super(options)
    if (!isSubAccount(options.account)) {
      throw new DotbitError(`${options.account} is not a legit Second-level DID`, BitErrorCode.InvalidSubAccount)
    }
    this.mainAccount = this.account.replace(/^.+?\./, '')
  }

  /** writer **/
  // setReverseRecord () {
  //   this.requireBitBuilder()
  // }

  subAccounts (params: Omit<SubAccountListParams, 'account'> = { page: 1, size: 100, keyword: '' }): any {
    throw new DotbitError(`'subAccounts' is not supported by Second-level DID ${this.account}`, BitErrorCode.SubAccountDoNotSupportSubAccount)
  }

  checkSubAccounts (subAccounts: SubAccountMintParams[]): any {
    throw new DotbitError(`'checkSubAccounts' is not supported by Second-level DID ${this.account}`, BitErrorCode.SubAccountDoNotSupportSubAccount)
  }

  mintSubAccounts (): any {
    throw new DotbitError(`'mintSubAccounts' is not supported by Second-level DID ${this.account}`, BitErrorCode.SubAccountDoNotSupportSubAccount)
  }

  mintSubAccount (): any {
    throw new DotbitError(`'mintSubAccount' is not supported by Second-level DID ${this.account}`, BitErrorCode.SubAccountDoNotSupportSubAccount)
  }

  async #editSubAccount (keyInfo: KeyInfo, editKey: 'manager'|'owner')
  async #editSubAccount (records: EditAccountRecord[], editKey: 'records')
  async #editSubAccount (value: KeyInfo|EditAccountRecord[], editKey: EditSubAccountEditKey) {
    const signerAddress = await this.signer.getAddress()
    const signerCoinType = await this.signer.getCoinType()

    const currentInfo: Pick<EditSubAccountParams, 'account'|'type'|'key_info'> = {
      account: this.account,
      type: 'blockchain',
      key_info: {
        key: signerAddress,
        coin_type: signerCoinType,
      },
    }

    let mmJsonTxs: SignTxListRes = {} as SignTxListRes
    if (editKey === 'owner') {
      value = value as KeyInfo
      mmJsonTxs = await this.bitBuilder.editSubAccount({
        ...currentInfo,
        edit_key: 'owner',
        edit_value: {
          owner: {
            type: 'blockchain',
            key_info: value
          }
        }
      })
    }
    else if (editKey === 'manager') {
      value = value as KeyInfo
      mmJsonTxs = await this.bitBuilder.editSubAccount({
        ...currentInfo,
        edit_key: 'manager',
        edit_value: {
          manager: {
            type: 'blockchain',
            key_info: value
          }
        }
      })
    }
    else if (editKey === 'records') {
      value = value as EditAccountRecord[]
      mmJsonTxs = await this.bitBuilder.editSubAccount({
        ...currentInfo,
        edit_key: 'records',
        edit_value: {
          records: value
        }
      })
    }

    const signatureList = await this.signer.signTxList(mmJsonTxs)

    return await this.bitBuilder.subAccountAPI.sendTransaction(signatureList)
  }

  /**
   * Change the owner key of an account
   * You should wait for 5 minutes between each invocation of this method
   * @param keyInfo
   */
  changeOwner (keyInfo: KeyInfo) {
    return this.#editSubAccount(keyInfo, 'owner')
  }

  /**
   * Change the manager key of an account
   * You should wait for 5 minutes between each invocation of this method
   * @param keyInfo
   */
  changeManager (keyInfo: KeyInfo) {
    return this.#editSubAccount(keyInfo, 'manager')
  }

  /**
   * Update all the records with given records
   * @param records
   */
  updateRecords (records: BitAccountRecord[]) {
    return this.#editSubAccount(records.map(toEditingRecord), 'records')
  }
}
