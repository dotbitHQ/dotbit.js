import { MessageTypes, SignTypedDataVersion, TypedMessage, signTypedData } from '@metamask/eth-sig-util'
import { BrowserProvider, hexlify, toUtf8Bytes, Wallet } from 'ethers'
import { SIGN_TYPE, CoinType, EvmChainId2CoinType } from '../const'
import { BitErrorCode, DotbitError } from '../errors/DotbitError'
import { SignTxListParams, SignTxListRes } from '../fetchers/RegisterAPI.type'
import { SendTransactionParam, BitSigner } from './BitSigner'
import { mmJsonHashAndChainIdHex, remove0x } from '../tools/common'

export class EvmSigner extends BitSigner {
  async signTypedData (data: TypedMessage<MessageTypes>): Promise<string> {
    const _data = JSON.parse(JSON.stringify(data))

    // if ((this.signer as Wallet).privateKey) {
    //   return signTypedData({
    //     privateKey: Buffer.from(remove0x((this.signer as Wallet).privateKey), 'hex'),
    //     data: _data,
    //     version: SignTypedDataVersion.V4,
    //   })
    // }
    // else {
    //   return await (this.signer.provider as BrowserProvider).send('eth_signTypedData_v4', [await this.signer.getAddress(), JSON.stringify(data)])
    // }

    delete _data?.types?.EIP712Domain
    return await this.signer.signTypedData(_data.domain, _data.types, _data.message)
  }

  async sendTransaction (sendTransactionParam: SendTransactionParam): Promise<string> {
    const _data = hexlify(toUtf8Bytes(sendTransactionParam.data))
    const { hash } = await this.signer.sendTransaction({
      to: sendTransactionParam.to,
      value: BigInt(sendTransactionParam.value),
      data: _data
    })
    return hash
  }

  signPersonal (data: string| Uint8Array): Promise<string> {
    return this.signer.signMessage(data)
  }

  async getAddress () {
    return await this.signer.getAddress()
  }

  async getChainId () {
    const network = await this.signer.provider?.getNetwork()
    return Number(network?.chainId)
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
      if (signItem.sign_msg === '' || signItem.sign_type === SIGN_TYPE.noSign) {
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
