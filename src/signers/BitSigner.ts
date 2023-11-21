import { MessageTypes, SignTypedDataVersion, TypedDataUtils, TypedMessage } from '@metamask/eth-sig-util'
import { JsonRpcSigner } from '@ethersproject/providers'
import { Wallet } from 'ethers'
import { SIGN_TYPE, CoinType, EvmChainId2CoinType } from '../const'
import { BitErrorCode, DotbitError } from '../errors/DotbitError'
import { SignTxListParams, SignTxListRes } from '../fetchers/RegisterAPI.type'

/**
 * get mmJson hash and chainId hex
 * @param typedData
 * @param chainId
 */
export function mmJsonHashAndChainIdHex (typedData: TypedMessage<any>, chainId: number): string {
  const mmHash = TypedDataUtils.eip712Hash(typedData, SignTypedDataVersion.V4).toString('hex')
  const chainIdHex = chainId.toString(16).padStart(16, '0')
  return mmHash + chainIdHex
}

export interface SendTransactionParam {
  to: string,
  value: string,
  data: string,
}

export abstract class BitSigner {
  signer: JsonRpcSigner| Wallet

  abstract signTypedData (data: TypedMessage<MessageTypes>): Promise<string>

  abstract sendTransaction (sendTransactionParam: SendTransactionParam): Promise<string>

  signPersonal (data: string| Buffer): Promise<string> {
    return this.signer.signMessage(data)
  }

  getAddress () {
    return this.signer.getAddress()
  }

  getChainId () {
    return this.signer.getChainId()
  }

  async getCoinType (): Promise<CoinType> {
    const chainId = await this.getChainId()
    const coinType = EvmChainId2CoinType[chainId]

    if (!coinType) {
      throw new DotbitError(`Unsupported EVM chainId: ${chainId}`, BitErrorCode.UnsupportedEVMChainId)
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

  async signTxList (txs: SignTxListParams): Promise<SignTxListRes> {
    for (const signItem of txs.sign_list) {
      if (signItem.sign_type === SIGN_TYPE.noSign) {
        continue
      }
      if (signItem.sign_type === SIGN_TYPE.eth712 && !!txs.mm_json) {
        const mmJson = JSON.parse(JSON.stringify(txs.mm_json))
        mmJson.message.digest = signItem.sign_msg
        const signDataRes = await this.signData(mmJson, true)
        if (signDataRes && mmJson.domain.chainId) {
          signItem.sign_msg = signDataRes + mmJsonHashAndChainIdHex(mmJson, mmJson.domain.chainId)
        }
      }
      else {
        signItem.sign_msg = await this.signData(signItem.sign_msg)
      }
    }

    delete txs.mm_json
    // @ts-expect-error
    delete txs.list

    return txs
  }
}
