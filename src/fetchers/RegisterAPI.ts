import { MessageTypes, TypedMessage } from '@metamask/eth-sig-util'
import { Networking } from '../tools/Networking'

export interface SignList {
  sign_type: number,
  sign_msg: string,
}

// todo-open: should be merged with TxsSignedOrUnsigned
export interface TxsWithMMJsonSignedOrUnSigned {
  sign_key: string,
  sign_list: SignList[],
  mm_json: TypedMessage<MessageTypes>,
}

// todo-open: should be replaced with owner
export interface OwnerRawParam {
  receiver_chain_type: number,
  receiver_address: string,
}

export interface ManagerRawParam {
  manager_address: string,
  manager_chain_type: number,
}

export interface EditAccountPermissionParam<T> {
  // todo-open: all chain_type should be deprecated
  chain_type: number,
  evm_chain_id: number,
  address: string,
  account: string,
  raw_param: T,
}

export type EditAccountManagerParam = EditAccountPermissionParam<ManagerRawParam>
export type EditAccountOwnerParam = EditAccountPermissionParam<OwnerRawParam>

export class RegisterAPI {
  net: Networking

  constructor (public baseUri: string) {
    this.net = new Networking(baseUri)
  }

  editAccountManager (params: EditAccountManagerParam): Promise<TxsWithMMJsonSignedOrUnSigned> {
    return this.net.post('account/edit/manager', params)
  }

  editAccountOwner (params: EditAccountOwnerParam): Promise<TxsWithMMJsonSignedOrUnSigned> {
    return this.net.post('account/edit/owner', params)
  }

  // todo: response should have same signature with SubAccountAPI.sendTransaction
  sendTransaction (params: Omit<TxsWithMMJsonSignedOrUnSigned, 'mm_json'>): Promise<{hash: string}> {
    return this.net.post('transaction/send', {
      sign_key: params.sign_key,
      sign_list: params.sign_list,
    } as Omit<TxsWithMMJsonSignedOrUnSigned, 'mm_json'>)
  }
}
