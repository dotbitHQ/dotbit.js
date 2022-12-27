<p align="center">
  <a href="https://did.id/">
    <img width="1000" src="/docs/dotbit-banner.png">
  </a>
</p>
<h1 align="center">Dotbit.js</h2>
<p align="center">The Official <a href="https://did.id/">.bit</a> JavaScript SDK provided by .bit team.</p>
<div align="center">

![NPM](https://img.shields.io/npm/l/dotbit) ![npm](https://img.shields.io/npm/v/dotbit)
</div>

> This is the new version of .bit (Previously DAS) JavaScript SDK. If you are looking for the source code of npm package [das-sdk](https://www.npmjs.com/package/das-sdk)(Deprecated), please check out the branch [das-sdk](https://github.com/dotbitHQ/dotbit.js/tree/das-sdk).

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [CHANGELOG](#changelog)
- [API Documentation](#api-documentation)
- [Plugins](#plugins)
- [FAQ](#faq)
- [Get Help](#get-help)
- [Contribute](#contribute)
- [License](#license)

## Features
- Query .bit account info (e.g. **owner, manager, status**, etc.)
- Query .bit account records (e.g. **addresses, profiles, dwebs and custom data**.)
- Enable .bit [SubDID](https://www.did.id/subdid) for a specific account.
- **Mint a SubDID** of a .bit main account.
- Query all the SubDIDs of a .bit main account.
- Manage the **ownership** of a .bit account(SubDID included).
- Manage the **records** of a .bit account(SubDID included).
- **Register a .bit account** with CKB. (Coming soon)

## Getting Started

First, you need to install Dotbit.js using [`npm`](https://www.npmjs.com/package/dotbit)
```bash
npm install dotbit --save
```
or [`yarn`](https://yarnpkg.com/package/dotbit).
```bash
yarn add dotbit
```

Then, you need to import Dotbit.js SDK in your code and create an instance before interacting with it:
```javascript
// For CommonJS
const { createInstance } = require('dotbit')
const dotbit = createInstance()
```

```javascript
// For ES Module
import { createInstance } from 'dotbit'
const dotbit = createInstance()
```

Now you could perform various operations using Dotbit.js SDK. Here is a simple example:
```javascript
// Get the account info of a .bit account
dotbit.accountInfo("imac.bit").then(console.log)
```
A sample result would be like:
```javascript
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

For more details about each API, you could refer to our [API Documentation](#api-documentation).
We also provide code examples here: [For browser](./example/browser/index.js), [For Node.js](./example/node/mint-sub-account.js).

## CHANGELOG
TBD

## API Documentation
- [createInstance](/docs/api/create-instance.md)
- [DotBit](/docs/api/dotbit.md)
- [BitAccount](/docs/api/bit-account.md)
- [BitSubAccount](/docs/api/bit-subaccount.md)

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
- [@dotbit/plugin-web3mq](./packages/plugin-web3mq/README.md): A plugin for integrating [Web3MQ](https://www.web3messaging.online/).
- [@dotbit/plugin-avatar](./packages/plugin-avatar/README.md): A plugin for resolving users' avatar.

#### Write your own plugin
Write a plugin for .bit is easy! 

If you want to write a plugin for your or other projects, please follow the same structure of [plugin template](./packages/plugin-template/README.md).

## FAQ
#### What is coin_type?
`coin_type` is the Coin Types defined in [slip44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) to distinguish between different Coins/Chains.

For example, `60` is the `coin_type` of ETH, `0` is the `coin_type` of BTC, `714` is the `coin_type` of BNB, etc.

#### Which coin_type does .bit support?

.bit use `coin_type` in multiple ways, here are 2 mainly usages:
- .bit use `coin_type` to identify each chain/coin in .bit records. In this situation, .bit support all `coin_type` defined in slip44.
- .bit use `coin_type` to identify different types of `owner/manager` key info. You can use ETH address(coin_type: 60) as your .bit owner and TRON address(coin_type: 195) as your manager. For all `coin_type` that .bit supported in `key_info`, please check [const.ts](./src/const.ts)

## Get Help
Please join our [Discord channel](https://discord.gg/fVppR7z4ht), or raise [issues](https://github.com/dotbitHQ/dotbit.js/issues) on GitHub.

## Contribute
This SDK is still under heavily development. Any contribution including PR is welcome.

Please raise an [issue](https://github.com/dotbitHQ/dotbit.js/issues) if you find any bugs or have any suggestions.

## License
MIT License (including **all** dependencies).