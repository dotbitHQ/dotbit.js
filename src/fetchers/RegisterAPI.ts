import { Networking } from '../tools/Networking'
import { computedEvmChainTypeByCoinType } from '../tools/common'
import { graphemesAccount } from '../tools/account'
import { BitAccountRecord } from './BitIndexer.type'
import {
  EditAccountManagerParam,
  EditAccountOwnerParam,
  EditAccountRecord,
  EditAccountRecordsParam,
  PayWithDotbitBalanceParam,
  ReturnTrxHashToServiceParam,
  SubmitRegisterAccountOrderParam,
  SubmitRegisterAccountOrderRes,
  TxsWithMMJsonSignedOrUnSigned
} from './RegisterAPI.type'

export function toEditingRecord (record: BitAccountRecord): EditAccountRecord {
  return {
    ...record,
    type: record.key.split('.')[0], // eg: `profile`
    key: record.key.split('.')[1], // eg: `twitter`
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

  submitRegisterAccountOrder (params: SubmitRegisterAccountOrderParam): Promise<SubmitRegisterAccountOrderRes> {
    const address = params.keyInfo.key
    const coinType = params.keyInfo.coin_type
    const account = params.account

    return this.net.post('account/order/register', {
      chain_type: computedEvmChainTypeByCoinType(coinType),
      address,
      account,
      pay_token_id: params.paymentMethodID,
      pay_address: address,
      register_years: params.registerYears,
      coin_type: coinType,
      inviter_account: params.inviterAccount,
      channel_account: params.channelAccount,
      account_char_str: graphemesAccount(account.split('.')[0], true),
      cross_coin_type: params.crossTo
    })
  }

  payWithDotbitBalance (params: PayWithDotbitBalanceParam): Promise<TxsWithMMJsonSignedOrUnSigned> {
    const address = params.keyInfo.key
    const coinType = params.keyInfo.coin_type

    return this.net.post('balance/pay', {
      chain_type: computedEvmChainTypeByCoinType(coinType),
      address,
      evm_chain_id: params.evmChainId,
      order_id: params.orderId
    })
  }

  /**
   * Return the transaction hash to the backend service.
   * @param params
   */
  returnTrxHashToService (params: ReturnTrxHashToServiceParam): Promise<void> {
    const address = params.keyInfo.key
    const coinType = params.keyInfo.coin_type

    return this.net.post('account/order/pay/hash', {
      chain_type: computedEvmChainTypeByCoinType(coinType),
      address,
      account: params.account,
      order_id: params.orderId,
      pay_hash: params.txHash
    })
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
