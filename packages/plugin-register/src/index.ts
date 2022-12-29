import { version } from '../package.json'
import {
  accountIdHex,
  BitAccount,
  BitNetwork,
  BitPluginBase,
  CrossChainDirection,
  DotBit,
  MintEthNftRes,
  PaymentMethodIDs,
  RegisterParam,
  RegisterRes
} from 'dotbit'
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
import GnosisSDK, { EthSignSignature } from '@gnosis.pm/safe-core-sdk'
import EthNftGnosisAbi from './EthNftGnosisAbi.json'
import { ethers } from 'ethers'

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
        keyInfo: param.keyInfo || keyInfo,
      }

      let trxHash: string
      const orderInfo = await this.bitBuilder.submitRegisterAccountOrder({
        ...param,
        keyInfo: param.keyInfo,
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
        account: account,
        keyInfo: param.keyInfo,
        orderId: orderInfo.order_id,
        txHash: trxHash,
      })

      return {
        ...param,
        account: account,
        orderId: orderInfo.order_id,
        txHash: trxHash
      }
    }

    bitAccount.mintEthNft = async function (this: BitAccount, network = BitNetwork.mainnet): Promise<MintEthNftRes> {
      this.requireSigner()
      this.requireBitBuilder()
      const coinType = await this.signer.getCoinType()
      const address = await this.signer.getAddress()
      const account = this.account
      const keyInfo = {
        key: address,
        coin_type: coinType
      }

      const CrossEthContract = network === BitNetwork.mainnet ? '0x60eB332Bd4A0E2a9eEB3212cFdD6Ef03Ce4CB3b5' : '0x7eCBEE03609f353d041942FF50CdA2A120ABddd9'
      const CrossEthGnosisAddress = network === BitNetwork.mainnet ? '0x513EF3F0d5259a0819370459A86930d047Bf8E9d' : '0xd51D9Bc5F462e825e59CCae110675E96519F36Aa'

      const { data, gnosis_signatures: signatures } = await this.bitBuilder.crossChainMintNftSignInfo({
        key_info: keyInfo,
        account: account
      })

      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: this.signer.signer
      })
      const gnosisContract = new ethers.Contract(CrossEthGnosisAddress, EthNftGnosisAbi, this.signer.signer)
      const nonce =  (await gnosisContract.uuidNonces(accountIdHex(account))).toNumber()

      const gnosisSdk = await GnosisSDK.create({
        ethAdapter,
        safeAddress: CrossEthGnosisAddress
      })

      const transaction = {
        to: CrossEthContract,
        value: '0',
        nonce,
        data
      }

      const tx = await gnosisSdk.createTransaction(transaction)

      signatures.forEach((signature) => {
        tx.addSignature(new EthSignSignature(signature.signer, signature.data))
      })

      gnosisSdk.getOwnersWhoApprovedTx = () => Promise.resolve([]) // We ignore sdk's some internal logic for now.

      const { hash } = await gnosisSdk.executeTransaction(tx)

      await this.bitBuilder.crossChainReturnTrxHashToService({
        account: account,
        key_info: keyInfo,
        txHash: hash,
        direction: CrossChainDirection.toETH
      })

      return {
        account,
        keyInfo,
        txHash: hash
      }
    }
  }
}
