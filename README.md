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

> This is the new version of .bit (previously known as DAS) JavaScript SDK. If you are looking for the source code of the deprecated npm package [das-sdk](https://www.npmjs.com/package/das-sdk), please visit the [das-sdk](https://github.com/dotbitHQ/dotbit.js/tree/das-sdk) branch on GitHub.

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
- **Register a .bit account** with CKB.

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
`Dotbit.js` offers a simple and powerful plugin system that allows us to add advanced features to this library.

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
- [@dotbit/plugin-register](./packages/plugin-register/README.md): A plugin to register .bit account.
- [@dotbit/plugin-dweb](./packages/plugin-dweb/README.md): A plugin to handle DWeb records for .bit accounts.

#### Write your own plugin
Write a plugin for .bit is easy! 

If you want to write a plugin for your or other projects, please follow the same structure of [plugin template](./packages/plugin-template/README.md).

## FAQ
#### What is coin_type?
`coin_type` is a way to distinguish between different coins or blockchain networks using the Coin Types defined in [SLIP 44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md).
For example, the `coin_type` for ETH is `60`, the `coin_type` for BTC is `0`, and the `coin_type` for BNB is `714`, etc.

#### Which coin_type does .bit support?
.bit uses `coin_type` in a few different ways:
- .bit uses `coin_type` to identify each chain or coin in .bit records. In this case, .bit supports all `coin_type` values defined in [SLIP 44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md).
- .bit uses `coin_type` to identify different types of `owner/manager` key information. For example, you can use an ETH address (coin_type: 60) as your .bit owner and a TRON address (coin_type: 195) as your manager. 

For a complete list of `coin_type` values that .bit supports in `key_info`, please see [const.ts](./src/const.ts).

## Get Help
If you have questions or need help with Dotbit.js, there are several ways to get assistance:
- Join the .bit community on [Discord channel](https://discord.gg/fVppR7z4ht).
- File [issues](https://github.com/dotbitHQ/dotbit.js/issues) on the GitHub repository for Dotbit.js.

## Contribute
We welcome contributions to Dotbit.js! If you are interested in helping to improve the project, there are several ways you can contribute:
- Report bugs or suggest improvements by opening an [issue](https://github.com/dotbitHQ/dotbit.js/issues) on the GitHub repository.
- Submit a pull request with your changes to the code.

Please note that Dotbit.js SDK is still under development, so any contribution (including pull requests) is welcome.

## License
Dotbit.js (including **all** dependencies) is protected under the [MIT License](LICENSE). This means that you are free to use, modify, and distribute the software as long as you include the original copyright and license notice. Please refer to the license for the full terms.
