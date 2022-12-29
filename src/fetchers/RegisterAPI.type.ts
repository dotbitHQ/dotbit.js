import { MessageTypes, TypedMessage } from '@metamask/eth-sig-util'
import { ChainType, CoinType, EvmChainId, PaymentMethodIDs } from '../const'
import { KeyInfo } from './BitIndexer.type'

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

// todo-open: this format should be aborted
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

export interface SubmitRegisterAccountOrderParam {
  account: string,
  keyInfo: KeyInfo,
  registerYears: number,
  paymentMethodID: PaymentMethodIDs,
  crossTo?: CoinType,
  inviterAccount?: string,
  channelAccount?: string,
}

export interface SubmitRegisterAccountOrderRes {
  order_id: string,
  receipt_address: string,
  amount: string,
  token_id: string,
}

export interface PayWithDotbitBalanceParam {
  keyInfo: KeyInfo,
  orderId: string,
  evmChainId: EvmChainId,
}

export interface ReturnTrxHashToServiceParam {
  account: string,
  keyInfo: KeyInfo,
  orderId: string,
  txHash: string,
}

export type EditAccountManagerParam = EditAccountParams<ManagerRawParam>
export type EditAccountOwnerParam = EditAccountParams<OwnerRawParam>
export type EditAccountRecordsParam = EditAccountParams<RecordsRawParam>
