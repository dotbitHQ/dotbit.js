import { MessageTypes, TypedMessage } from '@metamask/eth-sig-util'
import { ChainType, EditRecordAction, EvmChainId } from '../const'
import { Networking } from '../tools/Networking'
import { BitAccountRecord } from './BitIndexer.type'

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

export interface EditAccountParams<T> {
  // todo-open: all chain_type should be deprecated
  chain_type: ChainType,
  evm_chain_id: EvmChainId,
  address: string,
  account: string,
  raw_param: T,
}

export interface EditAccountRecord {
  type: string, // eg: `profile`
  key: string, // eg: `twitter`
  label: string,
  value: string,
  ttl: string,
}

export interface RecordsRawParam {
  records: EditAccountRecord[],
}

export type EditAccountManagerParam = EditAccountParams<ManagerRawParam>
export type EditAccountOwnerParam = EditAccountParams<OwnerRawParam>
export type EditAccountRecordsParam = EditAccountParams<RecordsRawParam>

export function toEditingRecord (record: BitAccountRecord): EditAccountRecord {
  return {
    ...record,
    type: record.key.split('.')[0],
    key: record.key.split('.')[1],
  }
}

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

  editAccountRecords (params: EditAccountRecordsParam): Promise<TxsWithMMJsonSignedOrUnSigned> {
    return this.net.post('account/edit/records', params)
  }

  // todo-open: response should have same signature with SubAccountAPI.sendTransaction
  sendTransaction (params: Omit<TxsWithMMJsonSignedOrUnSigned, 'mm_json'>): Promise<{hash: string}> {
    return this.net.post('transaction/send', {
      sign_key: params.sign_key,
      sign_list: params.sign_list,
    } as Omit<TxsWithMMJsonSignedOrUnSigned, 'mm_json'>)
  }
}

export function fromSplitRecordToUnifiedRecord () {

}
