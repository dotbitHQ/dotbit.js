import {
  accountIdHex,
  BitAccount,
  BitNetwork,
  BitPluginBase,
  CrossChainDirection,
  CrossChainAccountStatusRes,
  DotBit,
  LockAccountRes,
  MintBitAccountRes,
  MintEthNftRes,
  PaymentMethodIDs,
  RegisterParam,
  RegisterRes,
  RenewParam,
  RenewRes,
  isSubAccount
} from 'dotbit'
import EthersAdapter from '@safe-global/safe-ethers-lib'
import Safe from '@safe-global/protocol-kit'
import SafeSignature from '@safe-global/protocol-kit/dist/src/utils/signatures/SafeSignature'
import EthNftGnosisAbi from './EthNftGnosisAbi.json'
import EthNftAbi from './EthNftAbi.json'
import { ethers } from 'ethers'
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
        keyInfo: param.keyInfo || keyInfo,
      }

      let txHash: string
      const orderInfo = await this.bitBuilder.submitRegisterAccountOrder({
        ...param,
        keyInfo: param.keyInfo,
        account
      })

      if (param.paymentMethodID === PaymentMethodIDs.dotbitBalance) {
        const chainId = await this.signer.getChainId()
        const mmJsonTxs = await this.bitBuilder.payWithDotbitBalance({
          keyInfo: param.keyInfo,
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
        keyInfo: param.keyInfo,
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

    bitAccount.lockAccount = async function (): Promise<LockAccountRes> {
      this.requireSigner()
      this.requireBitBuilder()
      const coinType = await this.signer.getCoinType()
      const address = await this.signer.getAddress()
      const account = this.account
      const keyInfo = {
        key: address,
        coin_type: coinType
      }

      const mmJsonTxs = await this.bitBuilder.crossChainLockAccount({
        key_info: keyInfo,
        account
      })

      const signatureList = await this.signer.signTxList(mmJsonTxs)
      const { hash: txHash } = await this.bitBuilder.crossChainSendTransaction(signatureList)

      return {
        keyInfo,
        account,
        txHash
      }
    }

    bitAccount.crossChainAccountStatus = async function (): Promise<CrossChainAccountStatusRes> {
      this.requireSigner()
      const coinType = await this.signer.getCoinType()
      const address = await this.signer.getAddress()
      const account = this.account
      const keyInfo = {
        key: address,
        coin_type: coinType
      }

      const lockAccountStatus = await this.bitBuilder.crossChainAccountStatus({
        key_info: keyInfo,
        account
      })

      return lockAccountStatus
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
      const nonce = (await gnosisContract.uuidNonces(accountIdHex(account))).toNumber()

      const safeSdk = await Safe.create({
        ethAdapter,
        safeAddress: CrossEthGnosisAddress
      })

      const safeTransactionData = {
        to: CrossEthContract,
        value: '0',
        nonce,
        data
      }

      const safeTransaction = await safeSdk.createTransaction({ safeTransactionData })

      signatures.forEach((signature) => {
        safeTransaction.addSignature(new SafeSignature(signature.signer, signature.data))
      })

      safeSdk.getOwnersWhoApprovedTx = () => Promise.resolve([]) // We ignore sdk's some internal logic for now.

      const { hash: txHash } = await safeSdk.executeTransaction(safeTransaction)

      await this.bitBuilder.crossChainReturnTrxHashToService({
        account,
        key_info: keyInfo,
        txHash,
        direction: CrossChainDirection.toETH
      })

      return {
        account,
        keyInfo,
        txHash
      }
    }

    bitAccount.mintBitAccount = async function (this: BitAccount, network = BitNetwork.mainnet): Promise<MintBitAccountRes> {
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
      const contract = new ethers.Contract(CrossEthContract, EthNftAbi, this.signer.signer)
      const { hash: txHash } = await contract.recycle(accountIdHex(account), {
        gasLimit: 90000
      })

      await this.bitBuilder.crossChainReturnTrxHashToService({
        account,
        key_info: keyInfo,
        txHash,
        direction: CrossChainDirection.toCKB
      })

      return {
        account,
        keyInfo,
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
        throw new Error('SubDID renewal is not supported for now.')
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
