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
Query different records:

```javascript
// import { createInstance } from 'dotbit' // For ES Module
const { createInstance } = require('dotbit')
const dotbit = createInstance()

// Get all .bit account records
dotbit.records('imac.bit').then(console.log)

// Get all `eth` addresses of a .bit account
dotbit.addrs('imac.bit', 'eth').then(console.log)

// Get `twitter` account of a .bit account
dotbit.profiles('imac.bit', 'twitter').then(console.log)
```

Mint a sub-account in `testnet`:

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
    coin_type: '60',
  },
  registerYears: 1,
}).then(console.log)
```
`coin_type` is the Coin Types defined in [slip44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) to distinguish different Coins/Chains. 
For all `coin_type` .bit supported, please check [const.ts](./src/const.ts) 

For more complete usages, please check out the examples: [For browser](./example/browser/index.js), [For Node.js](./example/node/index.js).

## Get help
Please join our [Discord channel](https://discord.gg/fVppR7z4ht), or raise an issue: [Issues](https://github.com/dotbitHQ/dotbit.js/issues)

## License
MIT License (including **all** dependencies).