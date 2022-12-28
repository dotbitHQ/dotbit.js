# DotBit
## Table of Contents
- [constructor(config)](#constructorconfig)
- [network](#network)
- [cacheProvider](#cacheprovider)
- [bitIndexer](#bitindexer)
- [bitBuilder](#bitbuilder)
- [signer](#signer)
- [plugins](#plugins)
- [installPlugin(plugin)](#installpluginplugin)
- [uninstallPlugin(plugin)](#uninstallpluginplugin)
- [serverInfo()](#serverinfo)
- [reverse(keyInfo)](#reversekeyinfo)
- [alias](#alias)
- [accountsOfOwner(keyInfo)](#accountsofownerkeyinfo)
- [account(account)](#accountaccount)
- [exist(account)](#existaccount)
- [accountById(accountId)](#accountbyidaccountid)
- [records(account, key)](#recordsaccount-key)
- [accountInfo(account)](#accountinfoaccount)
- [addresses(account, chain)](#addressesaccount-chain)
- [addrs(account, chain)](#addrsaccount-chain)
- [dwebs(account, key)](#dwebsaccount-key)
- [dweb(account)](#dwebaccount)
- [profiles(account, key)](#profilesaccount-key)
- [avatar(account)](#avataraccount)

## constructor(config)
To create a new DotBit instance.
> Note: For a better development experience, we suggest you using `createInstance` to initialize DotBit, since it has already set a bunch of default configs (e.g. network, indexer, builder and signer).
### Parameter
config: DotBitConfig
  - (Optional) network: `BitNetwork`,
  - (Optional) cacheProvider: `CacheProvider`,
  - (Optional) bitIndexer: `BitIndexer`,
  - (Optional) bitBuilder: `RemoteTxBuilder`,
  - (Optional) signer: `BitSigner`,
### Return Value
`DotBit`
### Example
```javascript
const { DotBit } = require('dotbit');

// To create a new DotBit instance.
const config = {
  network: "testnet",
  bitIndexer: new BitIndexer({
    uri: "https://test-indexer.did.id",
  }),
  bitBuilder: new RemoteTxBuilder({
    subAccountUri: "https://test-subaccount-api.did.id/v1",
    registerUri: "https://test-register-api.did.id/v1",
  }),
};
const dotbit = new DotBit(config);
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

## network
To get the network of current DotBit instance.
### Parameter
N/A
### Return Value
'mainnet' | 'testnet'
### Example
```javascript
// To get the network of current DotBit instance.
console.log(dotbit.network)

// ...
// The printed result would be like:
mainnet
```

## cacheProvider
To get the cache provider of current DotBit instance.
### Parameter
N/A
### Return Value
`CacheProvider`
### Example
```javascript
// To get the cache provider of current DotBit instance
console.log(dotbit.cacheProvider)

// ...
// The printed result would be like:
{ get: [Function: get], set: [Function: set] }
```

## bitIndexer
To get the indexer of current DotBit instance.
### Parameter
N/A
### Return Value
`BitIndexer`
### Example
```javascript
// To get the indexer of current DotBit instance
console.log(dotbit.bitIndexer)

// ...
// The printed result would be like:
BitIndexer { rpc: JSONRPC { url: 'https://indexer-v1.did.id', id: 0 } }
```

## bitBuilder
To get the builder of current DotBit instance.
### Parameter
N/A
### Return Value
`RemoteTxBuilder`
### Example
```javascript
// To get the builder of current DotBit instance.
console.log(dotbit.bitBuilder)

// ...
// The printed result would be like:
RemoteTxBuilder {
  subAccountAPI: SubAccountAPI {
    baseUri: 'https://subaccount-api.did.id/v1',
    net: Networking { baseUri: 'https://subaccount-api.did.id/v1' }
  },
  registerAPI: RegisterAPI {
    baseUri: 'https://register-api.did.id/v1',
    net: Networking { baseUri: 'https://register-api.did.id/v1' }
  }
}
```

## signer
To get the signer of current DotBit instance.
### Parameter
N/A
### Return Value
`BitSigner`
### Example
```javascript
// To get the signer of current DotBit instance.
console.log(dotbit.signer)

// ...
// The printed result would be like:
EthersSigner {
  signer: Wallet {
    _isSigner: true,
    _signingKey: [Function (anonymous)],
    _mnemonic: [Function (anonymous)],
    address: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
    provider: InfuraProvider {
      _isProvider: true,
      _events: [],
      _emitted: [Object],
      disableCcipRead: false,
      formatter: [Formatter],
      anyNetwork: false,
      _network: [Object],
      _maxInternalBlockNumber: -1024,
      _lastBlockNumber: -2,
      _maxFilterBlockRange: 10,
      _pollingInterval: 4000,
      _fastQueryDate: 0,
      connection: [Object],
      _nextId: 42,
      apiKey: '84842078b09946638c03157f83405213',
      projectId: '84842078b09946638c03157f83405213',
      projectSecret: null
    }
  }
}
```

## plugins
To get all the installed plugins in current DotBit instance.
### Parameter
N/A
### Return Value
`BitPluginBase[]`
  - (Optional) version: `string`,
  - (Optional) name: `string`,
  - onInstall: `(dotbit: DotBit) => void`,
  - (Optional) onUninstall: `(dotbit: DotBit) => void`,
  - (Optional) onInitAccount: `(bitAccount: BitAccount) => void`,
### Example
```javascript
// To get all the installed plugins in current DotBit instance
console.log(dotbit.plugins)

// ...
// The printed result would be like:
undefined
```

## installPlugin(plugin)
To install a plugin for .bit SDK.
### Parameters
- plugin: BitPluginBase
  - (Optional) version: `string`,
  - (Optional) name: `string`,
  - onInstall: `(dotbit: DotBit) => void`,
  - (Optional) onUninstall: `(dotbit: DotBit) => void`,
  - (Optional) onInitAccount: `(bitAccount: BitAccount) => void`,
### Return Value
N/A
### Example
```javascript
import { createInstance } from 'dotbit'
import { BitPluginAvatar } from '@dotbit/plugin-avatar'

const dotbit = createInstance()
// To install the BitPluginAvatar plugin
dotbit.installPlugin(new BitPluginAvatar())
dotbit.avatar('imac.bit').then(console.log) // { url: 'https://thiscatdoesnotexist.com' }
```

## uninstallPlugin(plugin)
To uninstall a plugin for .bit SDK.
### Parameters
- plugin: BitPluginBase
  - (Optional) version: `string`,
  - (Optional) name: `string`,
  - onInstall: `(dotbit: DotBit) => void`,
  - (Optional) onUninstall: `(dotbit: DotBit) => void`,
  - (Optional) onInitAccount: `(bitAccount: BitAccount) => void`,
### Return Value
N/A
### Example
```javascript
import { createInstance } from 'dotbit'
import { BitPluginAvatar } from '@dotbit/plugin-avatar'

const dotbit = createInstance()
const avatarPlugin = new BitPluginAvatar()
dotbit.installPlugin(avatarPlugin)

// ...
// To uninstall the BitPluginAvatar plugin
dotbit.uninstallPlugin(avatarPlugin)
```

## serverInfo()
To get the server info of current .bit indexer.
### Parameters
N/A
### Return Value
Promise<DasServerInfo>
- is_latest_block_number: `boolean`,
- current_block_number: `number`,
### Example
```javascript
// To get the server info of current .bit indexer
dotbit.serverInfo().then(console.log);

// ...
// The printed result would be like:
{ is_latest_block_number: true, current_block_number: 8834119 }
```

## reverse(keyInfo)
To get the .bit alias for a given blockchain address
> Note: Only when .bit alias is set at https://app.did.id/alias by user, reverse record is valid.

### Parameters
- keyInfo: `KeyInfo`
  - key: `string`. The address on a certain blockchain
  - (Optional) coin_type: `string`. (60: ETH, 195: TRX, 714: BNB, 966: Matic)
### Return Value
Promise<BitAccount>
### Example
```javascript
// To get the BitAccount instance of Ethereum addresss '0x1d643fac9a463c9d544506006a6348c234da485f'
dotbit.reverse({
  key: '0x1d643fac9a463c9d544506006a6348c234da485f',
  coin_type: "60" // The coin type of ETH
}).then(console.log)

// ...
// The printed result would be like:
BitAccount {
  account: 'jeffx.bit',
  bitIndexer: BitIndexer {
    rpc: JSONRPC { url: 'https://indexer-v1.did.id', id: 1 }
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
  signer: EthersSigner {
    signer: Wallet {
      _isSigner: true,
      _signingKey: [Function (anonymous)],
      _mnemonic: [Function (anonymous)],
      address: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
      provider: [InfuraProvider]
    }
  }
}
```

## alias
The API is the same as [reverse(keyInfo)](#reversekeyinfo).

## accountsOfOwner(keyInfo)
List all .bit accounts (including SubDID accounts) of a given blockchain address
### Parameters
- keyInfo: `KeyInfo`
  - key: `string`. The address on a certain blockchain
  - (Optional) coin_type: `string`. (60: ETH, 195: TRX, 714: BNB, 966: Matic)
### Return Value
Promise<BitAccount[]>
### Example
```javascript
// To get all BitAccount instances of Ethereum addresss '0x1d643fac9a463c9d544506006a6348c234da485f'
dotbit.accountsOfOwner({
  key: "0x1d643fac9a463c9d544506006a6348c234da485f",
  coin_type: "60" // The coin type of ETH
}).then(console.log);

// ...
// The printed result would be like:
[
  ...,
  BitAccount {
    account: 'cz-vs-sbf.bit',
    bitIndexer: BitIndexer { rpc: [JSONRPC] },
    bitBuilder: RemoteTxBuilder {
      subAccountAPI: [SubAccountAPI],
      registerAPI: [RegisterAPI]
    },
    signer: EthersSigner { signer: [Wallet] }
  },
  BitSubAccount {
    account: 'jeff.makeafriend.bit',
    bitIndexer: BitIndexer { rpc: [JSONRPC] },
    bitBuilder: RemoteTxBuilder {
      subAccountAPI: [SubAccountAPI],
      registerAPI: [RegisterAPI]
    },
    signer: EthersSigner { signer: [Wallet] },
    isSubAccount: true,
    mainAccount: 'makeafriend.bit'
  }
]
```

## account(account)
To get the BitAccount instance of a given account name.
### Parameters
- account: `string`
### Return Value
BitAccount
(Note: It is not a promise.)
### Example
```javascript
// To get the BitAccount instance of "west.bit"
const result = dotbit.account("west.bit");
console.log(result);

// ...
// The printed result would be like:
BitAccount {
  account: 'west.bit',
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
  signer: EthersSigner {
    signer: Wallet {
      _isSigner: true,
      _signingKey: [Function (anonymous)],
      _mnemonic: [Function (anonymous)],
      address: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
      provider: [InfuraProvider]
    }
  }
}
```


## exist(account)
To determine whether a given account exists.
### Parameters
- account: `string`
### Return Value
Promise\<boolean>
### Example
```javascript
// To check if the account "west.bit" exists
dotbit.exist("west.bit").then(console.log)

// ...
// The printed result would be like:
true
```

## accountById(accountId)
To get the BitAccount instance of a given account ID.
### Parameters
- accountId: `string`. Remember it is a hexadecimal ID, not the account name. 
### Return Value
Promise\<BitAccount>
### Example
```javascript
// To get the BitAccount instance of account ID '0x5728088435fb8788472a9ca601fbc0b9cbea8be3'
dotbit.accountById("0x5728088435fb8788472a9ca601fbc0b9cbea8be3").then(console.log);

// ...
// The printed result would be like:
BitAccount {
  account: 'imac.bit',
  bitIndexer: BitIndexer {
    rpc: JSONRPC { url: 'https://indexer-v1.did.id', id: 1 }
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
  signer: EthersSigner {
    signer: Wallet {
      _isSigner: true,
      _signingKey: [Function (anonymous)],
      _mnemonic: [Function (anonymous)],
      address: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
      provider: [InfuraProvider]
    }
  }
}
```

## records(account, key)
To get all records of a given account.
### Parameters
- account: `string`
- (Optional) key: `string`. The key related to a specific record, only the matched record will be displayed.
### Return Value
Promise\<BitAccountRecordExtended[]>
- key: `string`,
- value: `string`,
- label: `string`,
- ttl: `string`,
- type: `string`,
- subtype: `string`,
### Example
```javascript
// Get all records of "west.bit"
dotbit.records("west.bit").then(console.log)

// ...
// The printed result would be like:
[
  ...
  {
    key: 'address.polygon',
    label: 'Usually',
    value: '0xB2bE2887A26f44555835EEaCC47d65B88b6B42c2',
    ttl: '300',
    type: 'address',
    subtype: 'polygon'
  },
  {
    key: 'profile.discord',
    label: 'Discord Username',
    value: 'west.bit#8906',
    ttl: '300',
    type: 'profile',
    subtype: 'discord'
  },
  ...
]

// Get record of profile.discord of "west.bit"
dotbit.records("west.bit", "profile.discord").then(console.log)

// ...
// The printed result would be like:
[
  {
    key: 'profile.discord',
    label: 'Discord Username',
    value: 'west.bit#8906',
    ttl: '300',
    type: 'profile',
    subtype: 'discord'
  }
]
```
> Note: If no record with the given key exists, an empty array will be returned.

## accountInfo(account)
To get the account info of a given account.
### Parameters
- account: `string`
### Return Value
Promise\<AccountInfo>
- account: `string`,
- account_alias: `string`,
- account_id_hex: `string`,
- next_account_id_hex: `string`,
- create_at_unix: `number`,
- expired_at_unix: `number`,
- status: `number`,
- das_lock_arg_hex: `string`,
- owner_algorithm_id: `number`,
- owner_key: `string`,
- manager_algorithm_id: `number`,
- manager_key: `string`,
### Example
```javascript
// Get the account info of "imac.bit"
dotbit.accountInfo("imac.bit").then(console.log)

// ...
// The printed result would be like:
{
  account: 'imac.bit',
  account_alias: 'imac.bit',
  account_id_hex: '0x5728088435fb8788472a9ca601fbc0b9cbea8be3',
  next_account_id_hex: '0x57280ab92f213d74c7a185e9b9d26d0a795108de',
  create_at_unix: 1671164348,
  expired_at_unix: 1702700348,
  status: 0,
  das_lock_arg_hex: '0x05b2be2887a26f44555835eeacc47d65b88b6b42c205b2be2887a26f44555835eeacc47d65b88b6b42c2',
  owner_algorithm_id: 5,
  owner_key: '0xb2be2887a26f44555835eeacc47d65b88b6b42c2',
  manager_algorithm_id: 5,
  manager_key: '0xb2be2887a26f44555835eeacc47d65b88b6b42c2'
}
```

## addresses(account, chain)
### Parameters
- account: `string`
- (Optional) chain: `string`. It could be the coin types defined in [slip44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)(e.g. '60' for ETH / '9006' for BSC). It could also be the symbols of coin (e.g. 'eth' / 'bsc')
### Return Value
Promise\<BitAccountRecordAddress[]>
- key: `string`,
- value: `string`,
- label: `string`,
- ttl: `string`,
- type: `string`,
- subtype: `string`,
- coin_type: `string`,
### Example
```javascript
// Get all addresses of "west.bit"
dotbit.addresses("west.bit").then(console.log)

// ...
// The printed result would be like:
[
  {
    key: 'address.bsc',
    label: 'HyperPay',
    value: '0x44A042eFA495A10E10d47269BB33bcB4991b80f4',
    ttl: '300',
    type: 'address',
    subtype: 'bsc',
    coin_type: '9006'
  },
  {
    key: 'address.trx',
    label: 'HyperPay',
    value: 'TJBr5JqG8mUX6PdKAbM4Qy3n1eZe7wP8bv',
    ttl: '300',
    type: 'address',
    subtype: 'trx',
    coin_type: '195'
  },
  ...
]

// Get the Ethereum address of "west.bit" by passing coin types
dotbit.addresses("west.bit", "60").then(console.log);

// Get the Ethereum address of "west.bit" by passing coin symbols
// Note: Developers are encouraged to use coin_type instead of plain symbol like 'eth' as coin_type is a more standard way to identify a chain/coin, and there will only be coin_type on chain in the future.
dotbit.addresses("west.bit", "eth").then(console.log);

// ...
// The printed result would be the same:
[
  {
    key: 'address.eth',
    label: 'Private Account',
    value: '0xB2bE2887A26f44555835EEaCC47d65B88b6B42c2',
    ttl: '300',
    type: 'address',
    subtype: 'eth',
    coin_type: '60'
  }
]
```

## addrs(account, chain)
An alias for API [addresses(account, chain)](#addressesaccount-chain).

## dwebs(account, key)
Get all DWebs of a given account
### Parameters
- account: `string`
- (Optional) key: `string`. Only records of matched subtype will be displayed.
### Return Value
Promise\<BitAccountRecordExtended[]>
- key: `string`,
- value: `string`,
- label: `string`,
- ttl: `string`,
- type: `string`,
- subtype: `string`,
### Example
```javascript
// Get all DWebs of "code.bit"
dotbit.dwebs("code.bit").then(console.log)

// ...
// The printed result would be like:
[
  {
    key: 'dweb.ipns',
    label: '',
    value: 'k51qzi5uqu5dgqjy1i78mz3oumplzt0cye32w9m8ix8hg9chpz5trvj8luwv0c',
    ttl: '300',
    type: 'dweb',
    subtype: 'ipns'
  }
]

// Get all ipns DWebs of "code.bit"
dotbit.dwebs("code.bit", "ipns").then(console.log);

// ...
// The printed result would be like:
[
  {
    key: 'dweb.ipns',
    label: '',
    value: 'k51qzi5uqu5dgqjy1i78mz3oumplzt0cye32w9m8ix8hg9chpz5trvj8luwv0c',
    ttl: '300',
    type: 'dweb',
    subtype: 'ipns'
  }
]
```

> Note: If no record with the given key exists, an empty array will be returned.

## dweb(account)
Get the first DWeb of a given account. If multiple DWebs are owned by an account, the result will be displayed in this order of priority: 'ipns', 'ipfs', 'skynet', 'resilio'.
### Parameters
- account: `string`
### Return Value
Promise\<BitAccountRecordExtended>
- key: `string`,
- value: `string`,
- label: `string`,
- ttl: `string`,
- type: `string`,
- subtype: `string`,
### Example
```javascript
// Get the first DWeb of "code.bit"
dotbit.dweb("code.bit").then(console.log)

// ...
// The printed result would be like:
{
  key: 'dweb.ipns',
  label: '',
  value: 'k51qzi5uqu5dgqjy1i78mz3oumplzt0cye32w9m8ix8hg9chpz5trvj8luwv0c',
  ttl: '300',
  type: 'dweb',
  subtype: 'ipns'
}

// Get the first DWeb of "west.bit"
dotbit.dweb("west.bit").then(console.log)

// ...
// The printed result would be null since no DWeb exists for "west.bit"
null
```

## profiles(account, key)
Get all profiles of a given account.
### Parameters
- account: `string`
- (Optional) key: `string`. Only profiles of matched subtype will be displayed.
### Return Value
Promise\<`BitAccountRecordExtended[]`>
- key: `string`,
- value: `string`,
- label: `string`,
- ttl: `string`,
- type: `string`,
- subtype: `string`,
### Example
```javascript
// Get all profiles of "west.bit"
dotbit.profiles("west.bit").then(console.log);

// ...
// The printed result would be like:
[
  {
    key: 'profile.discord',
    label: 'Discord Username',
    value: 'west.bit#8906',
    ttl: '300',
    type: 'profile',
    subtype: 'discord'
  },
  {
    key: 'profile.twitter',
    label: '',
    value: 'kylexiang',
    ttl: '300',
    type: 'profile',
    subtype: 'twitter'
  },
  ...
] 

// Get Discord profile of "west.bit"
dotbit.profiles("west.bit", "discord").then(console.log);

// ...
// The printed result would be like:
[
  {
    key: 'profile.discord',
    label: 'Discord Username',
    value: 'west.bit#8906',
    ttl: '300',
    type: 'profile',
    subtype: 'discord'
  }
] 
```

## avatar(account)
Get the avatar of a given account.
> Note: You have to install [@dotbit/plugin-avatar](https://github.com/mozwell/dotbit.js/blob/main/packages/plugin-avatar/README.md) before using this API. Otherwise an error will be thrown.
### Parameters
- account: `string`

For details, please refer to the documentation of [@dotbit/plugin-avatar](https://github.com/mozwell/dotbit.js/blob/main/packages/plugin-avatar/README.md)