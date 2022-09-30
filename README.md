dotbit: .bit JavaScript SDK
==================
![NPM](https://img.shields.io/npm/l/dotbit)
![npm](https://img.shields.io/npm/v/dotbit)

A complete [.bit](https://did.id) SDK and utilities in JavaScript (and TypeScript).

> This is the new version of .bit (Previously DAS) JavaScript SDK. If you are looking for the source code of npm package [das-sdk](https://www.npmjs.com/package/das-sdk)(Deprecated), please check out the branch [das-sdk](https://github.com/dotbitHQ/dotbit.js/tree/das-sdk).

## Features
- Query .bit account info, including **owner, manager, status**, and more.
- Query .bit account records, including **addresses, profiles, dwebs and custom data**.
- Enable .bit [Sub-Account](https://www.did.id/sub-account) for a specific account.
- **Mint a sub-account** of a .bit main account.
- Query all the sub-accounts of a .bit main account.
- Manage the **ownership** of a .bit account(sub-account included).
- Manage the **records** of a .bit account(sub-account included).
- **Register a .bit account** with CKB. (Coming soon)

## Installation
```shell
npm install dotbit --save
```

## QuickStart
#### Query users' addresses
```javascript
// import { createInstance } from 'dotbit' // For ES Module
const { createInstance } = require('dotbit')
const dotbit = createInstance()

// Get all `eth` addresses of a .bit account
dotbit.addrs('imac.bit', '60').then(console.log)  // Result is the same as below, using coin_type
dotbit.addrs('imac.bit', 'eth').then(console.log)
```

Developers are encouraged to use `coin_type` instead of plain symbol like 'eth' as `coin_type` is a more standard way to identify a chain/coin, and there will only be `coin_type` on chain in the future. [What is coin_type](https://github.com/dotbitHQ/dotbit.js#what-is-coin_type)

#### Query other different records:

```javascript
// Get `twitter` account of a .bit account
dotbit.profiles('imac.bit', 'twitter').then(console.log)

// Get all `dwebs` of a .bit account
dotbit.dwebs('imac.bit').then(console.log)

// Get all .bit account records, please only use it when necessary.
dotbit.records('imac.bit').then(console.log)
```

#### Query [.bit Alias](https://www.did.id/bit-alias)(Reverse Record)
⚠️Notice: Only when .bit alias is set at https://app.did.id/alias by user, reverse record is valid.
```javascript
const account = await dotbit.reverse({
  key: '0x1D643FAc9a463c9d544506006a6348c234dA485f'
})
console.log(account.account) // jeffx.bit
```
#### Query the accounts that an owner address is holding
```javascript
const accounts = await dotbit.accountsOfOwner({
    key: '0x1d643fac9a463c9d544506006a6348c234da485f',
})

console.log(accounts[0].account) // thefirst💯registeredbydevteamtoensuredassuccessfullylaunched10.bit
```
#### Mint a sub-account in `testnet`:

> Currently, sub-account is fully available in **testnet**, and need whitelist on **mainnet**.
> If you would like to distribute sub-accounts on **mainnet**, please email [supermancy@did.id](supermancy@did.id) with a brief description of your project.

```javascript
// import { createInstance, ProviderSigner, BitNetwork } from 'dotbit' // For ES Module
const { createInstance, ProviderSigner, BitNetwork } = require('dotbit')

const signer = new ProviderSigner(window.ethereum)
const dotbit = createInstance({
  network: BitNetwork.testnet,
  signer
})

const bitAccount = dotbit.account('imac.bit')

bitAccount.mintSubAccount({
  account: '001.imac.bit',
  keyInfo: {
    key: '0x...',
    coin_type: '60', // See FAQ below to get the defination of coin_type
  },
  registerYears: 1,
}).then(console.log)
```

For more complete usages, please check out the examples: [For browser](./example/browser/index.js), [For Node.js](./example/node/index.js).

## Plugins
.bit has partnerships with the greatest teams & projects in the ecosystems.

`dotbit.js` provided a simple yet powerful plugin system, with which we can add more powerful features to this library.

#### Usage
Basically, you can install and use a plugin like the codes below.

```javascript
import { PluginXXX } from 'dotbit-plugin-xxx'
import { createInstance } from 'dotbit'

const dotbit = createInstance()

dotbit.installPlugin(new PluginXXX())

dotbit.methodAddedByXXX()
```

For detailed usage, please follow the instructions in the specific plugin's README.

#### List of plugins
- [@dotbit/plugin-template](./packages/plugin-template/README.md): A demo plugin demonstrating the basic structure of a .bit plugin.
- [@dotbit/plugin-web3mq](./packages/plugin-web3mq/README.md): A plugin for integrating [Web3MQ](https://www.web3messaging.online/)

#### Write your own plugin
Write a plugin for .bit is easy! 

If you want to write a plugin for your or other projects, please follow the same structure of [plugin template](./packages/plugin-template/README.md).

## FAQ

#### What is coin_type?
`coin_type` is the Coin Types defined in [slip44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) to distinguish different Coins/Chains.

For example, `60` is the `coin_type` of ETH, `0` is the `coin_type` of BTC, `714` is the `coin_type` of BNB, etc.

#### Which coin_type does .bit support?

.bit use `coin_type` in multiple ways, here are 2 mainly usages:
- .bit use `coin_type` to identify each chain/coin in .bit records. In this situation, .bit support all `coin_type` defined in slip44.
- .bit use `coin_type` to identify different types of `owner/manager` key info. You can use ETH address(coin_type: 60) as your .bit owner and TRON address(coin_type: 195) as your manager. For all `coin_type` that .bit supported in `key_info`, please check [const.ts](./src/const.ts)


## Get help
Please join our [Discord channel](https://discord.gg/fVppR7z4ht), or raise an issue: [Issues](https://github.com/dotbitHQ/dotbit.js/issues)

## Contribute
This SDK is still under heavily development. Any contribution including PR is welcome.

Please raise an [issue](https://github.com/dotbitHQ/dotbit.js/issues) if you find any bugs or have any suggestions.

## License
MIT License (including **all** dependencies).
