import { MessageTypes, signTypedData, SignTypedDataVersion, TypedMessage } from '@metamask/eth-sig-util'
import { Signer, Wallet, ethers, VoidSigner } from 'ethers'
import { JsonRpcSigner } from '@ethersproject/providers'
import { remove0x } from '../tools/common'

function isWallet (wallet: JsonRpcSigner|Wallet): wallet is Wallet {
  // @ts-expect-error
  return !!wallet.privateKey
}

export class EthersSigner {
  constructor (public signer: JsonRpcSigner |Wallet) {
    this.signer = signer
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

  signPersonal (data: string) {
    return this.signer.signMessage(data)
  }

  // signEth() {
  //   return this.signer.si
  // }

  async signData (data: string | any, isEIP712?: boolean): Promise<string> {
    if (isEIP712) {
      return await this.signTypedData(data)
    }
    else {
      return await this.signPersonal(data)
    }
  }
}
