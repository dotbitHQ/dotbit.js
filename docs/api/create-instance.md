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
  bitIndexer: BitIndexer {},
  bitBuilder: RemoteTxBuilder {},
  signer: undefined
}

// To create a DotBit instance by using customized config
const dotbit = createInstance({
  network: "testnet",
  bitIndexerUri: "https://test-indexer.d.id",
  remoteTxBuilderConfig: {
    subAccountUri: "https://test-subaccount-api.d.id/v1",
    registerUri: "https://test-register-api.d.id/v1",
  },
});
console.log(dotbit);

// ...
// The printed result would be like:
DotBit {
  plugins: [],
  network: 'testnet',
  cacheProvider: undefined,
  bitIndexer: BitIndexer {},
  bitBuilder: RemoteTxBuilder {},
  signer: undefined
}
```
