import { CheckSubAccountStatus } from '../const'
import { Networking } from '../tools/Networking'
import { KeyInfo } from './BitIndexer.type'

export interface SignList {
  sign_type: number,
  sign_msg: string,
}

export interface List {
  sign_list: SignList[],
}

export interface TxsSignedOrUnSigned {
  action: string,
  sign_key: string,
  list: List[],
}

export interface SubAccount {
  account: string,
  type: string, // blockchain
  key_info: KeyInfo,
  register_years: number,
}

export interface CheckAccountsParams {
  account: string,
  type: string,
  key_info: KeyInfo,
  sub_account_list: SubAccount[],
}

export interface SubAccountWithStatus extends SubAccount {
  status: CheckSubAccountStatus,
  message: string,
}

export interface CreateSubAccountParams {
  account: string,
  type: string,
  key_info: KeyInfo,
  sub_account_list: SubAccount[],
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

  checkSubAccounts (params: CheckAccountsParams): Promise<{result: SubAccountWithStatus[]}> {
    return this.net.post('sub/account/check', params)
  }

  createSubAccounts (CreateSubAccountParams: CreateSubAccountParams): Promise<TxsSignedOrUnSigned> {
    return this.net.post('sub/account/create', CreateSubAccountParams)
  }
}
