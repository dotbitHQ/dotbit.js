import { JsonRpcSigner, Wallet } from 'ethers'
import { CoinType } from '../const'
import { SignTxListParams, SignTxListRes } from '../fetchers/RegisterAPI.type'
import { TypedMessage, MessageTypes } from '@metamask/eth-sig-util'

export interface SendTransactionParam {
  to: string,
  value: string,
  data: string,
}

export abstract class BitSigner {
  signer: JsonRpcSigner | Wallet

  constructor (signer: JsonRpcSigner | Wallet) {
    this.signer = signer
  }

  abstract signTypedData (data: TypedMessage<MessageTypes>): Promise<string>

  abstract sendTransaction (sendTransactionParam: SendTransactionParam): Promise<string>

  abstract signPersonal (data: string| Buffer): Promise<string>

  abstract getAddress (): Promise<string>

  abstract getChainId (): Promise<number>

  abstract getCoinType (): Promise<CoinType>

  abstract signData (data: string | Buffer | object, isEIP712?: boolean): Promise<string>

  abstract signTxList (txs: SignTxListParams): Promise<SignTxListRes>
}
