import { MessageTypes, signTypedData, SignTypedDataVersion, TypedMessage } from '@metamask/eth-sig-util'
import { Signer, Wallet, ethers, VoidSigner } from 'ethers'
import { JsonRpcSigner } from '@ethersproject/providers'
import { CoinType, EvmChainId2CoinType } from '../const'
import { TxsSignedOrUnSigned } from '../fetchers/SubAccountAPI'
import { BitErrorCode, CodedError } from '../tools/CodedError'
import { remove0x } from '../tools/common'

function isWallet (wallet: JsonRpcSigner|Wallet): wallet is Wallet {
  // @ts-expect-error
  return !!wallet.privateKey
}

export class EthersSigner {
  constructor (public signer: JsonRpcSigner |Wallet) {
    this.signer = signer
  }

  async getChainId () {
    return await this.signer.getChainId()
  }

  async getCoinType (): Promise<CoinType> {
    const chainId = await this.getChainId()
    const coinType = EvmChainId2CoinType[chainId]

    if (!coinType) {
      throw new CodedError(`Unsupported EVM chainId: ${chainId}`, BitErrorCode.UnsupportedEVMChainId)
    }

    return coinType
  }

  async signTypedData (data: TypedMessage<MessageTypes>) {
    // ethers' result is different from metamask's result, we had to figure it out why
    if (isWallet(this.signer)) {
      // return await this.signer._signTypedData(data.domain as any, data.types, data.message)
      return signTypedData({
        privateKey: Buffer.from(remove0x(this.signer.privateKey), 'hex'),
        data,
        version: SignTypedDataVersion.V4,
      })
    }
    // With Web3Provider/JsonRpcSigner, we can only rely on the result of the provider.
    // Fortunately, the result is usually reliable.
    else {
      return await this.signer._signTypedData(data.domain as any, data.types, data.message)
    }
  }

  signPersonal (data: string| Buffer): Promise<string> {
    return this.signer.signMessage(data)
  }

  async signData (data: string | Buffer | object, isEIP712?: boolean): Promise<string> {
    if (isEIP712) {
      return await this.signTypedData(data as TypedMessage<MessageTypes>)
    }
    else {
      return await this.signPersonal(data as string | Buffer)
    }
  }

  async signTxList (txs: TxsSignedOrUnSigned): Promise<TxsSignedOrUnSigned> {
    for (const list of txs.list) {
      for (const signList of list.sign_list) {
        signList.sign_msg = await this.signData(Buffer.from(remove0x(signList.sign_msg), 'hex'))
      }
    }

    return txs
  }
}
