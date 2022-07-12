import { CheckSubAccountStatus } from '../const'
import { Networking } from '../tools/Networking'
import { BitKeyInfo, KeyInfo } from './BitIndexer.type'

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

export interface SubAccount extends BitKeyInfo {
  account: string,
  register_years: number,
}

export interface CheckAccountsParams extends BitKeyInfo {
  account: string,
  sub_account_list: SubAccount[],
}

export interface SubAccountWithStatus extends SubAccount {
  status: CheckSubAccountStatus,
  message: string,
}

export interface CreateSubAccountParams extends BitKeyInfo {
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

  sendTransaction (tx: TxsSignedOrUnSigned): Promise<{ hash: string, hash_list: string[] }> {
    return this.net.post('transaction/send', tx)
  }

  subAccountList (params: SubAccountListParams): Promise<SubAccountListRes> {
    return this.net.post('sub/account/list', params)
  }

  checkSubAccounts (params: CheckAccountsParams): Promise<{result: SubAccountWithStatus[]}> {
    return this.net.post('sub/account/check', params)
  }

  createSubAccounts (CreateSubAccountParams: CreateSubAccountParams): Promise<TxsSignedOrUnSigned> {
    return this.net.post('sub/account/create', CreateSubAccountParams)
  }
}
