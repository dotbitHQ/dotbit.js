import { MessageTypes, TypedMessage } from '@metamask/eth-sig-util'
import { JsonRpcSigner } from '@ethersproject/providers'
import { Wallet } from 'ethers'
import { CoinType, EvmChainId2CoinType } from '../const'
import { TxsSignedOrUnSigned } from '../fetchers/SubAccountAPI'
import { BitErrorCode, CodedError } from '../tools/CodedError'
import { remove0x } from '../tools/common'

export abstract class BitSigner {
  signer: JsonRpcSigner| Wallet

  abstract signTypedData (data: TypedMessage<MessageTypes>): Promise<string>

  signPersonal (data: string| Buffer): Promise<string> {
    return this.signer.signMessage(data)
  }

  getChainId () {
    return this.signer.getChainId()
  }

  async getCoinType (): Promise<CoinType> {
    const chainId = await this.getChainId()
    const coinType = EvmChainId2CoinType[chainId]

    if (!coinType) {
      throw new CodedError(`Unsupported EVM chainId: ${chainId}`, BitErrorCode.UnsupportedEVMChainId)
    }

    return coinType
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
        if (signList.sign_msg) {
          signList.sign_msg = await this.signData(Buffer.from(remove0x(signList.sign_msg), 'hex'))
        }
      }
    }

    return txs
  }
}
