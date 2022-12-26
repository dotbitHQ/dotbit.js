import { ethers } from 'ethers'
import { ExternalProvider } from '@ethersproject/providers'
import { MessageTypes, TypedMessage } from '@metamask/eth-sig-util'
import { BitSigner, SendTransactionParam } from './BitSigner'

export class ProviderSigner extends BitSigner {
  constructor (public provider: ExternalProvider) {
    super()
    this.signer = new ethers.providers.Web3Provider(provider).getSigner()
  }

  private request (method: string, params?: any[]) {
    return this.provider.request({ method, params })
  }

  async signTypedData (data: TypedMessage<MessageTypes>) {
    // ethers signTypedData behave differently from metamask's, we had to figure it out why
    // return await this.signer._signTypedData(data.domain as any, data.types, data.message)
    return await this.request('eth_signTypedData_v4', [await this.signer.getAddress(), JSON.stringify(data)])
  }

  async sendTransaction (sendTransactionParam: SendTransactionParam): Promise<string> {
    return await this.request('eth_sendTransaction', [await this.signer.getAddress(), JSON.stringify(sendTransactionParam)])
  }
}
