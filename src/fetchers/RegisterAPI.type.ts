import { MessageTypes, TypedMessage } from '@metamask/eth-sig-util'
import { CoinType, EvmChainId, PaymentMethodIDs } from '../const'
import { KeyInfo } from './BitIndexer.type'

export interface SignInfo {
  sign_type: number,
  sign_msg: string,
}

export interface SignTxListParams {
  action?: string,
  sub_action?: string,
  sign_key: string,
  sign_list: SignInfo[],
  mm_json?: TypedMessage<MessageTypes>,
}

export interface SignTxListRes {
  action?: string,
  sub_action?: string,
  sign_key: string,
  sign_list: SignInfo[],
  sign_address?: string,
}

// todo-open: should be replaced with owner
export interface OwnerRawParam {
  receiver_coin_type: CoinType,
  receiver_address: string,
}

export interface ManagerRawParam {
  manager_address: string,
  manager_coin_type: CoinType,
}

export interface EditAccountParams<T> {
  keyInfo: KeyInfo,
  evm_chain_id: EvmChainId,
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
  keyInfo: KeyInfo,
  account: string,
  registerYears: number,
  paymentMethodID: PaymentMethodIDs,
  inviterAccount?: string,
  channelAccount?: string,
}

export interface SubmitRegisterAccountOrderRes {
  order_id: string,
  receipt_address: string,
  amount: string,
  token_id: string,
}

export interface SubmitRenewAccountOrderParam {
  keyInfo: KeyInfo,
  account: string,
  paymentMethodID: PaymentMethodIDs,
  payAddress: string,
  renewYears: number,
}

export interface SubmitRenewAccountOrderRes {
  order_id: string,
  token_id: string,
  receipt_address: string,
  amount: string,
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
