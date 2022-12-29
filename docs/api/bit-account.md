# BitAccount
## Table of Contents
- [constructor(options)](#constructoroptions)
- [account](#account)
- [bitIndexer](#bitindexer)
- [bitBuilder](#bitbuilder)
- [signer](#signer)
- [status](#status)
- [enableSubAccount()](#enablesubaccount)
- [subAccounts(params)](#subaccountsparams)
- [checkSubAccounts(subAccounts)](#checksubaccountssubaccounts)
- [mintSubAccounts(params)](#mintsubaccountsparams)
- [mintSubAccount(params)](#mintsubaccountparams)
- [changeOwner(keyInfo)](#changeownerkeyinfo)
- [changeManager(keyInfo)](#changemanagerkeyinfo)
- [updateRecords(records)](#updaterecordsrecords)
- [editRecords()](#editrecords)
- [info()](#info)
- [owner()](#owner)
- [manager()](#manager)
- [records(key)](#recordskey)
- [addresses(chain)](#addresseschain)
- [addrs(chain)](#addrschain)
- [dwebs(protocol)](#dwebsprotocol)
- [dweb()](#dweb)
- [profiles(subtype)](#profilessubtype)
- [avatar(account)](#avataraccount)

## constructor(options)
To create a BitAccount instance.
### Parameters
- options: `BitAccountOptions`
  - account: `string`,
  - (Optional) bitIndexer: `BitIndexer`,
  - (Optional) bitBuilder: `RemoteTxBuilder`,
  - (Optional) signer: `BitSigner`,
### Return Value
`BitAccount`
### Example
```javascript
const { BitAccount } = require('dotbit')

// To create a BitAccount instance.
const account = new BitAccount({account: 'west.bit'});
console.log(account);

// ...
// The printed result would be like:
BitAccount {
  account: 'west.bit',
  bitIndexer: undefined,
  bitBuilder: undefined,
  signer: undefined
}
```

## account
To get the account of a BitAccount instance.
### Parameters
N/A
### Return Value
`string`
### Example
```javascript
const account = new BitAccount({account: 'west.bit'});
// To get the account of 'west.bit'.
console.log(account.account);

// ...
// The printed result would be like:
west.bit
```

## bitIndexer
To get the indexer of current BitAccount instance.
### Parameter
N/A
### Return Value
`BitIndexer`
### Example
```javascript
const account = new BitAccount({account: 'west.bit'});
// To get the indexer of current BitAccount instance
console.log(account.bitIndexer)

// ...
// The printed result would be like:
BitIndexer { rpc: JSONRPC { url: 'https://indexer-v1.did.id', id: 0 } }
```

## bitBuilder
To get the builder of current BitAccount instance.
### Parameter
N/A
### Return Value
`RemoteTxBuilder`
### Example
```javascript
const account = new BitAccount({account: 'west.bit'});
// To get the builder of current BitAccount instance
console.log(account.bitBuilder)

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
To get the signer of current BitAccount instance.
### Parameter
N/A
### Return Value
`BitSigner`
### Example
```javascript
const { EthersSigner } = require('../../lib/index')
const { ethers, Wallet } = require('ethers')

const privateKey = "INPUT_YOUR_PRIVATE_KEY_HERE";

const provider = new ethers.providers.InfuraProvider()
const wallet = new Wallet(privateKey, provider)
const signer = new EthersSigner(wallet)

const account = new BitAccount({account: 'west.bit', signer});

// To get the signer of current BitAccount instance
console.log(account.signer)
```

## status
To get the account status of current BitAccount instance.
### Parameter
N/A
### Return Value
`AccountStatus`
### Example
```javascript
const account = new BitAccount({account: 'west.bit'});
// To get the account status of 'west.bit'
console.log(account.status)

// ...
// The printed result would be like:
undefined
```

## enableSubAccount()
To enable sub-accounts of a main account.
> Note: This is a write API, which means you need to set up a signer before calling it. See example below for how to set up a signer.
### Parameters
N/A
### Return Value
Promise<{ hash?: `string`, hash_list: `string[]` }>
### Example
```javascript
const { EthersSigner } = require('../../lib/index')
const { ethers, Wallet } = require('ethers')

const privateKey = "INPUT_YOUR_PRIVATE_KEY_HERE";

const provider = new ethers.providers.InfuraProvider()
const wallet = new Wallet(privateKey, provider)
const signer = new EthersSigner(wallet)

const account = new BitAccount({account: 'imac.bit', signer});
// To enable sub-accounts of 'imac.bit'.
const result = await account.enableSubAccount()
console.log(result)

// ...
// The printed result would be like:
{
  hash: '0xadc19c5a8bd9ce963cbfc876e55a9f11b0518073114ceb967d521e695d8b41a4'
}
```

## subAccounts(params)
List the sub accounts of a main account, with pagination and filter.
### Parameters
- (Optional) params: `Omit<SubAccountListParams, 'account'>`
  - page: `number`. The default value is `1`.
  - size: `number`. The default value is `100`.
  - keyword: `string`. The default value is `''`.
### Return Value
Promise<`SubAccountListRes`>
### Example
```javascript
const account = new BitAccount({account: 'makeafriend.bit'});
// To list the sub-accounts of a main account, with 100 items per page.
const subAccounts = await account.subAccounts()
console.log(subAccounts)

// ...
// The printed result would be like:
{ total: 100, list: [
  ...,
  {
    account: 'xxy229.makeafriend.bit',
    owner: [Object],
    manager: [Object],
    registered_at: 1669713664000,
    expired_at: 1701249664000,
    status: 0,
    enable_sub_account: 0,
    renew_sub_account_price: 0,
    nonce: 0
  },
  ...,
]}
```


## checkSubAccounts(subAccounts)
To check if all given sub-accounts could be registered.
### Parameters
- subAccounts: `SubAccountMintParams`
### Return Value
Promise<{result: `SubAccountWithStatus[]`}>
### Example
```javascript
const account = new BitAccount({account: 'imac.bit'});

const subAccounts: SubAccountMintParams[] = [{
  account: 'xyz.imac.bit',
  type: 'blockchain',
  key_info: {
    key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
    coin_type: 'eth',
  },
  register_years: 1,
  account_char_str: graphemesAccount('xyz')
}]

const result = await account.checkSubAccounts(subAccounts)

// ...
// The printed result would be like:
{
  result: [
    {
      account: 'xyz.imac.bit',
      mint_for_account: '',
      account_char_str: [Array],
      register_years: 1,
      type: 'blockchain',
      key_info: [Object],
      status: 1,
      message: 'account suffix diff: imac.bit'
    }
  ]
}
```

## mintSubAccounts(params)
To mint multiple sub-accounts for a BitAccount instance.
> Note: This is a write API, which means you need to set up a signer before calling it. See example below for how to set up a signer.
> Note: Currently, SubDID is fully available in testnet, and need whitelist on mainnet. If you would like to distribute SubDIDs on mainnet, please email supermancy@did.id with a brief description of your project.
### Parameters
- params: `SubAccountParams[]`
  - account: `string`,
  - (Optional) keyInfo: `KeyInfo`. (The keyInfo has a higher priority than mintForAccount.)
  - (Optional) mintForAccount: `string`,
  - registerYears: `number`,
### Return Value
Promise<{ hash?: `string`, hash_list: `string[]` }>
### Example
```javascript
const { EthersSigner } = require('../../lib/index')
const { ethers, Wallet } = require('ethers')

const privateKey = "INPUT_YOUR_PRIVATE_KEY_HERE";

const provider = new ethers.providers.InfuraProvider()
const wallet = new Wallet(privateKey, provider)
const signer = new EthersSigner(wallet)

const account = new BitAccount({account: 'imac.bit', signer});
const mintParam = [{
  account: '006.imac.bit',
  keyInfo: {
    coin_type: 'eth',
    key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
  },
  registerYears: 1,
}, {
  account: '007.imac.bit',
  keyInfo: {
    coin_type: 'eth',
    key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
  },
  registerYears: 1,
}, {
  account: '008.imac.bit',
  registerYears: 1,
  mintForAccount: 'imac.bit'
}]
const result = await account.mintSubAccounts(mintParam);
console.log(result);

// ...
// The printed result would be like:
{
  hash: '0xadc19c5a8bd9ce963cbfc876e55a9f11b0518073114ceb967d521e695d8b41a4'
}
```

## mintSubAccount(params)
To mint a sub-account for a BitAccount instance.
> Note: This is a write API, which means you need to set up a signer before calling it. See example below for how to set up a signer.
> Note: Currently, SubDID is fully available in testnet, and need whitelist on mainnet. If you would like to distribute SubDIDs on mainnet, please email supermancy@did.id with a brief description of your project.
### Parameters
- params: `SubAccountParams`
  - account: `string`,
  - (Optional) keyInfo: `KeyInfo`. (The keyInfo has a higher priority than mintForAccount.)
  - (Optional) mintForAccount: `string`,
  - registerYears: `number`,
### Return Value
Promise<{ hash?: `string`, hash_list: `string[]` }>
### Example
```javascript
const { EthersSigner } = require('../../lib/index')
const { ethers, Wallet } = require('ethers')

const privateKey = "INPUT_YOUR_PRIVATE_KEY_HERE";

const provider = new ethers.providers.InfuraProvider()
const wallet = new Wallet(privateKey, provider)
const signer = new EthersSigner(wallet)

const account = new BitAccount({account: 'imac.bit', signer});
const mintParam = {
  account: '005.imac.bit',
  keyInfo: {
    coin_type: 'eth',
    key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
  },
  registerYears: 1,
}
const result = await account.mintSubAccount(mintParam);
console.log(result);

// ...
// The printed result would be like:
{
  hash: '0xadc19c5a8bd9ce963cbfc876e55a9f11b0518073114ceb967d521e695d8b41a4'
}
```

## changeOwner(keyInfo)
To change the owner of a BitAccount instance.
> Note: This is a write API, which means you need to set up a signer before calling it. See example below for how to set up a signer.
### Parameters
- keyInfo: `KeyInfo`
  - key: `string`. The address on a certain blockchain
  - (Optional) coin_type: `string`. (60: ETH, 195: TRX, 714: BNB, 966: Matic). See [What is coin_type?](../../README.md#what-is-coin_type) in FAQ for more details.
### Return Value
Promise<{ hash?: `string`, hash_list: `string[]` }>
### Example
```javascript
const { EthersSigner } = require('../../lib/index')
const { ethers, Wallet } = require('ethers')

const privateKey = "INPUT_YOUR_PRIVATE_KEY_HERE";

const provider = new ethers.providers.InfuraProvider()
const wallet = new Wallet(privateKey, provider)
const signer = new EthersSigner(wallet)

const account = new BitAccount({account: 'west.bit', signer});
const result = await account.changeOwner({
  key: '0x1d643fac9a463c9d544506006a6348c234da485f',
  coin_type: "60" // The coin type of ETH
})
console.log(result);

// ...
// The printed result would be like:
{
  hash: '0xadc19c5a8bd9ce963cbfc876e55a9f11b0518073114ceb967d521e695d8b41a4'
}
```

## changeManager(keyInfo)
To change the manager of a BitAccount instance.
> Note: This is a write API, which means you need to set up a signer before calling it. See example below for how to set up a signer.
### Parameters
- keyInfo: `KeyInfo`
  - key: `string`. The address on a certain blockchain
  - (Optional) coin_type: `string`. (60: ETH, 195: TRX, 714: BNB, 966: Matic). See [What is coin_type?](../../README.md#what-is-coin_type) in FAQ for more details.
### Return Value
Promise<{ hash?: `string`, hash_list: `string[]` }>
### Example
```javascript
const { EthersSigner } = require('../../lib/index')
const { ethers, Wallet } = require('ethers')

const privateKey = "INPUT_YOUR_PRIVATE_KEY_HERE";

const provider = new ethers.providers.InfuraProvider()
const wallet = new Wallet(privateKey, provider)
const signer = new EthersSigner(wallet)

const account = new BitAccount({account: 'west.bit', signer});
const result = await account.changeManager({
  key: '0x1d643fac9a463c9d544506006a6348c234da485f',
  coin_type: "60" // The coin type of ETH
})
console.log(result);

// ...
// The printed result would be like:
{
  hash: '0xadc19c5a8bd9ce963cbfc876e55a9f11b0518073114ceb967d521e695d8b41a4'
}
```

## updateRecords(records)
To update all records of a BitAccount instance.
> Note: This is a write API, which means you need to set up a signer before calling it. See example below for how to set up a signer.
> Note: The existing records will be erased.
### Parameters
- records: `BitAccountRecord[]`
  - key: `string`,
  - value: `string`,
  - label: `string`,
  - ttl: `string`,
### Return Value
Promise<{ hash?: `string`, hash_list: `string[]` }>
### Example
```javascript
const { EthersSigner } = require('../../lib/index')
const { ethers, Wallet } = require('ethers')

const privateKey = "INPUT_YOUR_PRIVATE_KEY_HERE";

const provider = new ethers.providers.InfuraProvider()
const wallet = new Wallet(privateKey, provider)
const signer = new EthersSigner(wallet)

const account = new BitAccount({account: 'west.bit', signer});
const result = await account.updateRecords([{
  key: 'profile.email',
  value: 'hr@apple.com',
  label: 'HR',
  ttl: '3000',
}])
console.log(result);

// ...
// The printed result would be like:
{
  hash: '0xadc19c5a8bd9ce963cbfc876e55a9f11b0518073114ceb967d521e695d8b41a4'
}
```

## editRecords()
To create a record editor for a BitAccount instance.
> Note: This is a write API, which means you need to set up a signer before calling it. See example below for how to set up a signer.

### Parameters
N/A
### Return Value
`RecordsEditor`
```javascript
const { EthersSigner } = require('../../lib/index')
const { ethers, Wallet } = require('ethers')

const privateKey = "INPUT_YOUR_PRIVATE_KEY_HERE";

const provider = new ethers.providers.InfuraProvider()
const wallet = new Wallet(privateKey, provider)
const signer = new EthersSigner(wallet)

const account = new BitAccount({
  account: "imac.bit",
  bitIndexer: new BitIndexer({
    uri: "https://indexer-v1.did.id",
  }),
  signer,
});

const editor = await account.editRecords()
editor.delete({
  key: 'profile.email',
}).add({
  key: 'profile.email',
  value: 'recruit@apple.com',
})
console.log(editor.records)

// ...
// The printed result would be like:
[
  {
    ttl: '300',
    label: '',
    key: 'profile.email',
    value: 'recruit@apple.com'
  }
]
```

## info()
To get the account info of a BitAccount instance.
### Parameters
N/A
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
const account = new BitAccount({
  account: "imac.bit",
  bitIndexer: new BitIndexer({
    uri: "https://indexer-v1.did.id",
  }),
});
// Get the account info of "imac.bit"
account.info().then(console.log)

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

## owner()
To get the owner of a BitAccount instance.
### Parameters
N/A
### Return Value
Promise<`RoleKeyInfo`>
  - key: `string`. The address on a certain blockchain
  - (Optional) coin_type: `string`. (60: ETH, 195: TRX, 714: BNB, 966: Matic). See [What is coin_type?](../../README.md#what-is-coin_type) in FAQ for more details.
  - algorithm_id: `number`
### Example
```javascript
const account = new BitAccount({
  account: "west.bit",
  bitIndexer: new BitIndexer({
    uri: "https://indexer-v1.did.id",
  }),
});

// Get the owner of "west.bit"
account.owner().then(console.log)

// ...
// The printed result would be like:
{
  key: '0xb2be2887a26f44555835eeacc47d65b88b6b42c2',
  coin_type: '60',
  algorithm_id: 5
}
```

## manager()
To get the manager of a BitAccount instance.
### Parameters
N/A
### Return Value
Promise<`RoleKeyInfo`>
  - key: `string`. The address on a certain blockchain
  - (Optional) coin_type: `string`. (60: ETH, 195: TRX, 714: BNB, 966: Matic). See [What is coin_type?](../../README.md#what-is-coin_type) in FAQ for more details.
  - algorithm_id: `number`
### Example
```javascript
const account = new BitAccount({
  account: "west.bit",
  bitIndexer: new BitIndexer({
    uri: "https://indexer-v1.did.id",
  }),
});

// Get the manager of "west.bit"
account.manager().then(console.log)

// ...
// The printed result would be like:
{
  key: '0xb2be2887a26f44555835eeacc47d65b88b6b42c2',
  coin_type: '60',
  algorithm_id: 5
}
```

## records(key)
To get all records of a BitAccount instance.
### Parameters
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
const account = new BitAccount({
  account: "west.bit",
  bitIndexer: new BitIndexer({
    uri: "https://indexer-v1.did.id",
  }),
});

// Get all records of "west.bit"
account.records().then(console.log)

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
account.records("profile.discord").then(console.log)

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

## addresses(chain)
### Parameters
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
const account = new BitAccount({
  account: "west.bit",
  bitIndexer: new BitIndexer({
    uri: "https://indexer-v1.did.id",
  }),
});

// Get all addresses of "west.bit"
account.addresses().then(console.log)

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
account.addresses("60").then(console.log);

// Get the Ethereum address of "west.bit" by passing coin symbols
// Note: Developers are encouraged to use coin_type instead of plain symbol like 'eth' as coin_type is a more standard way to identify a chain/coin, and there will only be coin_type on chain in the future.
account.addresses("eth").then(console.log);

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

## addrs(chain)
An alias for API [addresses(chain)](#addresseschain).

## dwebs(protocol)
Get all DWebs of a BitAccount instance
### Parameters
- (Optional) protocol: `string`. Only records of matched subtype will be displayed.
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
const account = new BitAccount({
  account: "code.bit",
  bitIndexer: new BitIndexer({
    uri: "https://indexer-v1.did.id",
  }),
});
// Get all DWebs of "code.bit"
account.dwebs().then(console.log)

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
account.dwebs("ipns").then(console.log);

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

## dweb()
Get the first DWeb of a BitAccount instance. If multiple DWebs are owned by an account, the result will be displayed in this order of priority: 'ipns', 'ipfs', 'skynet', 'resilio'.
### Parameters
N/A
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
const account = new BitAccount({
  account: "code.bit",
  bitIndexer: new BitIndexer({
    uri: "https://indexer-v1.did.id",
  }),
});
// Get the first DWeb of "code.bit"
account.dweb().then(console.log)

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
```

## profiles(subtype)
To get all profiles of a BitAccount instance.
### Parameters
- (Optional) subtype: `string`
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
const account = new BitAccount({
  account: "west.bit",
  bitIndexer: new BitIndexer({
    uri: "https://indexer-v1.did.id",
  }),
});
// Get all profiles of "west.bit"
account.profiles().then(console.log);

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
account.profiles("discord").then(console.log);

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