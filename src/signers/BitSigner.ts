import { MessageTypes, SignTypedDataVersion, TypedDataUtils, TypedMessage } from '@metamask/eth-sig-util'
import { JsonRpcSigner } from '@ethersproject/providers'
import { Wallet } from 'ethers'
import { AlgorithmId, CoinType, EvmChainId2CoinType } from '../const'
import { TxsWithMMJsonSignedOrUnSigned } from '../fetchers/RegisterAPI'
import { TxsSignedOrUnSigned } from '../fetchers/SubAccountAPI'
import { BitErrorCode, DotbitError } from '../errors/DotbitError'
import { remove0x } from '../tools/common'

function isMMJson (txs: TxsSignedOrUnSigned | TxsWithMMJsonSignedOrUnSigned): txs is TxsWithMMJsonSignedOrUnSigned {
  return 'mm_json' in txs
}

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

export abstract class BitSigner {
  signer: JsonRpcSigner| Wallet

  abstract signTypedData (data: TypedMessage<MessageTypes>): Promise<string>

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

  // todo-open: TxsSignedOrUnSigned and TxsWithMMJsonSignedOrUnSigned is pretty much the same, while they are from different api. We need to unify them in backend.
  async signTxList (txs: TxsSignedOrUnSigned): Promise<TxsSignedOrUnSigned>
  async signTxList (txs: TxsWithMMJsonSignedOrUnSigned): Promise<TxsWithMMJsonSignedOrUnSigned>
  async signTxList (txs: TxsSignedOrUnSigned | TxsWithMMJsonSignedOrUnSigned): Promise<TxsSignedOrUnSigned | TxsWithMMJsonSignedOrUnSigned> {
    if (isMMJson(txs)) {
      for (const signItem of txs.sign_list) {
        if (signItem.sign_msg) {
          if (signItem.sign_type === AlgorithmId.eip712) {
            const mmJson = JSON.parse(JSON.stringify(txs.mm_json))
            mmJson.message.digest = signItem.sign_msg
            const signDataRes = await this.signTypedData(mmJson)
            signItem.sign_msg = signDataRes + mmJsonHashAndChainIdHex(mmJson, mmJson.domain.chainId)
          }
          else {
            signItem.sign_msg = await this.signData(Buffer.from(remove0x(signItem.sign_msg), 'hex'))
          }
        }
      }
    }
    else {
      for (const list of txs.list) {
        for (const signItem of list.sign_list) {
          if (signItem.sign_msg) {
            signItem.sign_msg = await this.signData(Buffer.from(remove0x(signItem.sign_msg), 'hex'))
          }
        }
      }
    }

    return txs
  }
}
