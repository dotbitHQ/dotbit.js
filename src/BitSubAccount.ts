import { BitAccount, BitAccountOptions } from './BitAccount'
import { BitAccountRecord, KeyInfo } from './fetchers/BitIndexer.type'
import { EditAccountRecord, toEditingRecord } from './fetchers/RegisterAPI'
import {
  EditSubAccountEditKey,
  EditSubAccountParams,
  SubAccountListParams,
  SubAccountMintParams,
  TxsSignedOrUnSigned
} from './fetchers/SubAccountAPI'
import { BitErrorCode, DotbitError } from './errors/DotbitError'
import { isSubAccount } from './tools/account'

export class BitSubAccount extends BitAccount {
  isSubAccount = true
  mainAccount: string

  constructor (options: BitAccountOptions) {
    super(options)
    if (!isSubAccount(options.account)) {
      throw new DotbitError(`${options.account} is not a legit SubDID`, BitErrorCode.InvalidSubAccount)
    }
    this.mainAccount = this.account.replace(/^.+?\./, '')
  }

  /** writer **/
  // setReverseRecord () {
  //   this.requireBitBuilder()
  // }

  enableSubAccount (): null {
    throw new DotbitError(`'enableSubAccount' is not supported by SubDID ${this.account}`, BitErrorCode.SubAccountDoNotSupportSubAccount)
  }

  subAccounts (params: Omit<SubAccountListParams, 'account'> = { page: 1, size: 100, keyword: '' }): null {
    throw new DotbitError(`'subAccounts' is not supported by SubDID ${this.account}`, BitErrorCode.SubAccountDoNotSupportSubAccount)
  }

  checkSubAccounts (subAccounts: SubAccountMintParams[]): null {
    throw new DotbitError(`'checkSubAccounts' is not supported by SubDID ${this.account}`, BitErrorCode.SubAccountDoNotSupportSubAccount)
  }

  mintSubAccounts (): null {
    throw new DotbitError(`'mintSubAccounts' is not supported by SubDID ${this.account}`, BitErrorCode.SubAccountDoNotSupportSubAccount)
  }

  mintSubAccount (): null {
    throw new DotbitError(`'mintSubAccount' is not supported by SubDID ${this.account}`, BitErrorCode.SubAccountDoNotSupportSubAccount)
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

    let mmJsonTxs: TxsSignedOrUnSigned
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

    const res = await this.signer.signTxList(mmJsonTxs)

    return await this.bitBuilder.subAccountAPI.sendTransaction(res)
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
