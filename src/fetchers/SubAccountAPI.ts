import { CheckSubAccountStatus } from '../const'
import { ICharInfo } from '../tools/account'
import { Networking } from '../tools/Networking'
import { BitKeyInfo, KeyInfo } from './BitIndexer.type'
import { EditAccountRecord } from './RegisterAPI'

export interface SignList {
  sign_type: number,
  sign_msg: string,
}

export interface TxsList {
  sign_list: SignList[],
}

export interface TxsSignedOrUnSigned {
  action: string,
  sign_key: string,
  list: TxsList[],
}

export interface SubAccount {
  type: string,
  account: string,
  register_years: number,
  key_info?: KeyInfo,
  mint_for_account?: string,
  status?: number,
  account_char_str?: ICharInfo[],
}

export interface CheckAccountsParams extends BitKeyInfo {
  account: string,
  sub_account_list: SubAccount[],
}

export interface SubAccountWithStatus extends SubAccount {
  status: CheckSubAccountStatus,
  message: string,
}

export interface CreateSubAccountsParams extends BitKeyInfo {
  account: string,
  sub_account_list: SubAccount[],
}

export interface SubAccountListParams {
  'account': string,
  'page': number,
  'size': number,
  'keyword': string,
}

export interface SubAccountListItem {
  account: string,
  owner: BitKeyInfo,
  manager: BitKeyInfo,
  registered_at: number,
  expired_at: number,
  status: number,
  enable_sub_account: number,
  renew_sub_account_price: number,
  nonce: number,
}

export interface SubAccountListRes {
  total: number,
  list: SubAccountListItem[],
}

export type EditSubAccountEditKey = 'manager'|'owner'|'records'
export interface EditSubAccountParamsGeneric<T> {
  account: string,
  type: string, // blockchain
  key_info: KeyInfo,
  edit_key: EditSubAccountEditKey,
  edit_value: T,
}

export type EditSubAccountManagerParams = EditSubAccountParamsGeneric<{
  manager: BitKeyInfo,
}>
export type EditSubAccountOwnerParams = EditSubAccountParamsGeneric<{
  owner: BitKeyInfo,
}>
export type EditSubAccountRecordsParams = EditSubAccountParamsGeneric<{
  records: EditAccountRecord[],
}>

// todo-open: this should be align with main-account
export type EditSubAccountParams = EditSubAccountOwnerParams | EditSubAccountManagerParams | EditSubAccountRecordsParams

export class SubAccountAPI {
  net: Networking

  constructor (public baseUri: string) {
    this.net = new Networking(baseUri)
  }

  initSubAccount (account: string, keyInfo: KeyInfo): Promise<TxsSignedOrUnSigned> {
    return this.net.post('sub/account/init', {
      account,
      type: 'blockchain',
      key_info: keyInfo,
    })
  }

  sendTransaction (tx: TxsSignedOrUnSigned): Promise<{ hash?: string, hash_list: string[] }> {
    return this.net.post('transaction/send', tx)
  }

  subAccountList (params: SubAccountListParams): Promise<SubAccountListRes> {
    return this.net.post('sub/account/list', params)
  }

  checkSubAccounts (params: CheckAccountsParams): Promise<{result: SubAccountWithStatus[]}> {
    return this.net.post('sub/account/check', params)
  }

  createSubAccounts (params: CreateSubAccountsParams): Promise<TxsSignedOrUnSigned> {
    return this.net.post('sub/account/create', params)
  }

  editSubAccount (params: EditSubAccountParams): Promise<TxsSignedOrUnSigned> {
    return this.net.post('sub/account/edit', params)
  }
}
