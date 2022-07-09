import { KeyInfo } from '../fetchers/BitIndexer.type'
import { TxsSignedOrUnSigned, SubAccountAPI } from '../fetchers/SubAccountAPI'

interface RemoteTxBuilderConfig {
  subAccountUri: string,
}

export class RemoteTxBuilder {
  subAccountAPI: SubAccountAPI

  constructor (config: RemoteTxBuilderConfig) {
    this.subAccountAPI = new SubAccountAPI(config.subAccountUri)
  }

  enableSubAccount (account: string, keyInfo: KeyInfo): Promise<TxsSignedOrUnSigned> {
    return this.subAccountAPI.initSubAccount(account, keyInfo)
  }
}
