import { Networking } from '../tools/Networking'
import { graphemesAccount } from '../tools/account'
import { BitAccountRecord } from './BitIndexer.type'
import {
  EditAccountManagerParam,
  EditAccountOwnerParam,
  EditAccountRecord,
  EditAccountRecordsParam,
  PayWithDotbitBalanceParam,
  ReturnTrxHashToServiceParam,
  SignTxListParams,
  SignTxListRes,
  SubmitRegisterAccountOrderParam,
  SubmitRegisterAccountOrderRes,
  SubmitRenewAccountOrderParam,
  SubmitRenewAccountOrderRes
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

  editAccountManager (params: EditAccountManagerParam): Promise<SignTxListParams> {
    return this.net.post('account/edit/manager', {
      type: 'blockchain',
      ...params,
      key_info: params.keyInfo,
    })
  }

  editAccountOwner (params: EditAccountOwnerParam): Promise<SignTxListParams> {
    return this.net.post('account/edit/owner', {
      type: 'blockchain',
      ...params,
      key_info: params.keyInfo,
    })
  }

  editAccountRecords (params: EditAccountRecordsParam): Promise<SignTxListParams> {
    return this.net.post('account/edit/records', {
      type: 'blockchain',
      ...params,
      key_info: params.keyInfo,
    })
  }

  submitRegisterAccountOrder (params: SubmitRegisterAccountOrderParam): Promise<SubmitRegisterAccountOrderRes> {
    const address = params.keyInfo.key
    const coinType = params.keyInfo.coin_type
    const account = params.account

    return this.net.post('account/order/register', {
      type: 'blockchain',
      key_info: params.keyInfo,
      account,
      pay_token_id: params.paymentMethodID,
      pay_address: address,
      register_years: params.registerYears,
      coin_type: coinType,
      inviter_account: params.inviterAccount,
      channel_account: params.channelAccount,
      account_char_str: graphemesAccount(account.split('.')[0], true)
    })
  }

  submitRenewAccountOrder (params: SubmitRenewAccountOrderParam): Promise<SubmitRenewAccountOrderRes> {
    const address = params.keyInfo.key
    const account = params.account

    return this.net.post('account/order/renew', {
      type: 'blockchain',
      key_info: params.keyInfo,
      account,
      pay_token_id: params.paymentMethodID,
      pay_address: address,
      renew_years: params.renewYears
    })
  }

  payWithDotbitBalance (params: PayWithDotbitBalanceParam): Promise<SignTxListParams> {
    return this.net.post('balance/pay', {
      type: 'blockchain',
      key_info: params.keyInfo,
      evm_chain_id: params.evmChainId,
      order_id: params.orderId
    })
  }

  /**
   * Return the transaction hash to the backend service.
   * @param params
   */
  returnTrxHashToService (params: ReturnTrxHashToServiceParam): Promise<void> {
    return this.net.post('account/order/pay/hash', {
      type: 'blockchain',
      key_info: params.keyInfo,
      account: params.account,
      order_id: params.orderId,
      pay_hash: params.txHash
    })
  }

  sendTransaction (params: SignTxListRes): Promise<{hash: string}> {
    return this.net.post('transaction/send', params)
  }
}

export function fromSplitRecordToUnifiedRecord () {

}
