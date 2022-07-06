import { KeyInfo } from '../fetchers/BitIndexer.type'
import { SubAccountAPI } from '../fetchers/SubAccountAPI'

interface RemoteTxBuilderConfig {
  subAccountUri: string,
}

export class RemoteTxBuilder {
  subAccountAPI: SubAccountAPI

  constructor (config: RemoteTxBuilderConfig) {
    this.subAccountAPI = new SubAccountAPI(config.subAccountUri)
  }
}
