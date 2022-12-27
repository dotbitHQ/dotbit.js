import { version } from '../package.json'
import { BitAccount, BitPluginBase, DotBit, PaymentMethodIDs, RegisterParam, RegisterRes } from 'dotbit'

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

      let trxHash: string
      const orderInfo = await this.bitBuilder.submitRegisterAccountOrder({
        ...param,
        account: this.account
      })

      if (param.paymentMethodID === PaymentMethodIDs.dotbitBalance) {
        const chainId = await this.signer.getChainId()
        const mmJsonTxs = await this.bitBuilder.payWithDotbitBalance({
          keyInfo: param.keyInfo,
          orderId: orderInfo.order_id,
          evmChainId: chainId
        })
        const res = await this.signer.signTxList(mmJsonTxs)
        const { hash } = await this.bitBuilder.registerAPI.sendTransaction(res)
        trxHash = hash
      }
      else {
        trxHash = await this.signer.sendTransaction({
          to: orderInfo.receipt_address,
          value: orderInfo.amount,
          data: orderInfo.order_id,
        })
      }

      await this.bitBuilder.returnTrxHashToService({
        account: this.account,
        keyInfo: param.keyInfo,
        orderId: orderInfo.order_id,
        txHash: trxHash,
      })

      return {
        ...param,
        account: this.account,
        orderId: orderInfo.order_id,
        txHash: trxHash
      }
    }
  }
}
