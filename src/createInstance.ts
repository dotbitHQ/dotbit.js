import { RemoteTxBuilder } from './builders/RemoteTxBuilder'
import { BitNetwork } from './const'
import { DotBit, DotBitConfig } from './DotBit'
import { BitIndexer } from './fetchers/BitIndexer'
import { BitSigner } from './signers/BitSigner'

interface CreateInstanceConfig {
  network?: BitNetwork,
  bitIndexerUri?: string,
  remoteTxBuilderConfig?: {
    subAccountUri: string,
    registerUri: string,
  },
  signer?: BitSigner,
}

export const DefaultConfig: { [key: string]: CreateInstanceConfig} = {
  [BitNetwork.mainnet]: {
    network: BitNetwork.mainnet,
    bitIndexerUri: 'https://indexer-v1.did.id',
    remoteTxBuilderConfig: {
      subAccountUri: 'https://subaccount-api.did.id/v1',
      registerUri: 'https://register-api.did.id/v1',
    },
  },
  [BitNetwork.testnet]: {
    network: BitNetwork.testnet,
    bitIndexerUri: 'https://test-indexer.did.id',
    remoteTxBuilderConfig: {
      subAccountUri: 'https://test-subaccount-api.did.id/v1',
      registerUri: 'https://test-register-api.did.id/v1',
    }
  },
}

export function createInstance (config: CreateInstanceConfig = {}): DotBit {
  const defaultConfig = DefaultConfig[config.network || BitNetwork.mainnet]

  config = Object.assign({}, defaultConfig, config)

  const dotBitConfig: DotBitConfig = {
    network: config.network,
    bitIndexer: new BitIndexer({
      uri: config.bitIndexerUri
    }),
    bitBuilder: new RemoteTxBuilder(config.remoteTxBuilderConfig),
    signer: config.signer,
  }

  return new DotBit(dotBitConfig)
}
