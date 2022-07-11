import { MessageTypes, signTypedData, SignTypedDataVersion, TypedMessage } from '@metamask/eth-sig-util'
import { Wallet } from 'ethers'
import { remove0x } from '../tools/common'
import { BitSigner } from './BitSigner'

export class EthersSigner extends BitSigner {
  constructor (public signer: Wallet) {
    super()
  }

  async signTypedData (data: TypedMessage<MessageTypes>) {
    // the result of ethers' `_signTypedData` method is different from that of metamask's, we had to figure it out why
    // return await this.signer._signTypedData(data.domain as any, data.types, data.message)
    return signTypedData({
      privateKey: Buffer.from(remove0x(this.signer.privateKey), 'hex'),
      data,
      version: SignTypedDataVersion.V4,
    })
  }
}
