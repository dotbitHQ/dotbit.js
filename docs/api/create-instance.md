# createInstance
## Table of Contents
- [createInstance(config)](#createinstanceconfig)

## createInstance(config)
To create a DotBit instance. You could take advantage of the default config or pass your customized config to override it.
### Parameters
- config: `CreateInstanceConfig`
  - (Optional) network: `BitNetwork`,
  - (Optional) bitIndexerUri: `string`,
  - (Optional) remoteTxBuilderConfig: `RemoteTxBuilderConfig`,
  - (Optional) signer: `BitSigner`,
### Return Value
`DotBit`
### Example
```javascript
const { createInstance } = require('dotbit')

// To create a DotBit instance by using default config
const dotbit = createInstance();
console.log(dotbit);

// ...
// The printed result would be like:
DotBit {
  plugins: [],
  network: 'mainnet',
  cacheProvider: undefined,
  bitIndexer: BitIndexer {
    rpc: JSONRPC { url: 'https://indexer-v1.did.id', id: 0 }
  },
  bitBuilder: RemoteTxBuilder {
    subAccountAPI: SubAccountAPI {
      baseUri: 'https://subaccount-api.did.id/v1',
      net: [Networking]
    },
    registerAPI: RegisterAPI {
      baseUri: 'https://register-api.did.id/v1',
      net: [Networking]
    }
  },
  signer: undefined
}

// To create a DotBit instance by using customized config
const dotbit = createInstance({
  network: "testnet",
  bitIndexerUri: "https://test-indexer.did.id",
  remoteTxBuilderConfig: {
    subAccountUri: "https://test-subaccount-api.did.id/v1",
    registerUri: "https://test-register-api.did.id/v1",
  },
});
console.log(dotbit);

// ...
// The printed result would be like:
DotBit {
  plugins: [],
  network: 'testnet',
  cacheProvider: undefined,
  bitIndexer: BitIndexer {
    rpc: JSONRPC { url: 'https://test-indexer.did.id', id: 0 }
  },
  bitBuilder: RemoteTxBuilder {
    subAccountAPI: SubAccountAPI {
      baseUri: 'https://test-subaccount-api.did.id/v1',
      net: [Networking]
    },
    registerAPI: RegisterAPI {
      baseUri: 'https://test-register-api.did.id/v1',
      net: [Networking]
    }
  },
  signer: undefined
}
```