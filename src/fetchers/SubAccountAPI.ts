import { Networking } from '../tools/Networking'
import { KeyInfo } from './BitIndexer.type'

export interface SignList {
  sign_type: number,
  sign_msg: string,
}

export interface List {
  sign_list: SignList[],
}

export interface InitSubAccountRes {
  action: string,
  sign_key: string,
  list: List[],
}

export class SubAccountAPI {
  net: Networking

  constructor (public baseUri: string) {
    this.net = new Networking(baseUri)
  }

  async initSubAccount (account: string, keyInfo: KeyInfo): Promise<InitSubAccountRes> {
    return await this.net.post('sub/account/init', {
      account,
      type: 'blockchain',
      key_info: keyInfo,
    })
  }
}
