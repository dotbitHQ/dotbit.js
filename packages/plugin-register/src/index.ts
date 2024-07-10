import {
  BitAccount,
  BitPluginBase,
  DotBit,
  PaymentMethodIDs,
  RegisterParam,
  RegisterRes,
  RenewParam,
  RenewRes,
  isSubAccount
} from 'dotbit'
import { version } from './version'

export class BitPluginRegister implements BitPluginBase {
  version = version
  name = 'BitPluginRegister'

  onInstall (dotbit: DotBit) {
  }

  onUninstall (dotbit: DotBit) {
  }

  onInitAccount (bitAccount: BitAccount) {
    bitAccount.register = async function (this: BitAccount, param: RegisterParam): Promise<RegisterRes> {
      this.requireSigner()
      this.requireBitBuilder()
      const coinType = await this.signer.getCoinType()
      const address = await this.signer.getAddress()
      const account = this.account
      const keyInfo = {
        key: address,
        coin_type: coinType
      }

      param = {
        ...param,
        keyInfo: param.keyInfo ?? keyInfo,
      }

      let txHash: string
      const orderInfo = await this.bitBuilder.submitRegisterAccountOrder({
        ...param,
        keyInfo: param.keyInfo!,
        account
      })

      if (param.paymentMethodID === PaymentMethodIDs.dotbitBalance) {
        const chainId = await this.signer.getChainId()
        const mmJsonTxs = await this.bitBuilder.payWithDotbitBalance({
          keyInfo: param.keyInfo!,
          orderId: orderInfo.order_id,
          evmChainId: chainId
        })
        const signatureList = await this.signer.signTxList(mmJsonTxs)
        const { hash } = await this.bitBuilder.registerAPI.sendTransaction(signatureList)
        txHash = hash
      }
      else {
        txHash = await this.signer.sendTransaction({
          to: orderInfo.receipt_address,
          value: orderInfo.amount,
          data: orderInfo.order_id,
        })
      }

      await this.bitBuilder.returnTrxHashToService({
        account,
        keyInfo: param.keyInfo!,
        orderId: orderInfo.order_id,
        txHash,
      })

      return {
        ...param,
        account,
        orderId: orderInfo.order_id,
        txHash
      }
    }

    bitAccount.renew = async function (this: BitAccount, param: RenewParam): Promise<RenewRes> {
      this.requireSigner()
      this.requireBitBuilder()
      const coinType = await this.signer.getCoinType()
      const address = await this.signer.getAddress()
      const account = this.account
      const keyInfo = {
        key: address,
        coin_type: coinType
      }

      if (isSubAccount(account)) {
        throw new Error('Second-level DID renewal is not supported for now.')
      }

      let txHash: string
      const orderInfo = await this.bitBuilder.submitRenewAccountOrder({
        account,
        keyInfo,
        paymentMethodID: param.paymentMethodID,
        payAddress: address,
        renewYears: param.renewYears
      })

      if (param.paymentMethodID === PaymentMethodIDs.dotbitBalance) {
        const chainId = await this.signer.getChainId()
        const mmJsonTxs = await this.bitBuilder.payWithDotbitBalance({
          keyInfo,
          orderId: orderInfo.order_id,
          evmChainId: chainId
        })
        const signatureList = await this.signer.signTxList(mmJsonTxs)
        const { hash } = await this.bitBuilder.registerAPI.sendTransaction(signatureList)
        txHash = hash
      }
      else {
        txHash = await this.signer.sendTransaction({
          to: orderInfo.receipt_address,
          value: orderInfo.amount,
          data: orderInfo.order_id,
        })
      }

      return {
        ...param,
        keyInfo,
        account,
        orderId: orderInfo.order_id,
        txHash
      }
    }
  }
}
