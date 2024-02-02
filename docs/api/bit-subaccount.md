# BitSubAccount
## Table of Contents
- [constructor(options)](#constructoroptions)
- [mainAccount](#mainaccount)
- [changeOwner(keyInfo)](#changeownerkeyinfo)
- [changeManager(keyInfo)](#changemanagerkeyinfo)
- [updateRecords(records)](#updaterecordsrecords)

## constructor(options)
To create a BitSubAccount instance.
### Parameters
- options: `BitAccountOptions`
  - account: `string`,
  - (Optional) bitIndexer: `BitIndexer`,
  - (Optional) bitBuilder: `RemoteTxBuilder`,
  - (Optional) signer: `BitSigner`,
### Return Value
`BitSubAccount`
### Example
```javascript
const { BitSubAccount } = require('dotbit')

// To create a BitSubAccount instance.
const subAccount = new BitSubAccount({account: 'jeff.makeafriend.bit'});
console.log(subAccount);

// ...
// The printed result would be like:
BitSubAccount {
  account: 'jeff.makeafriend.bit',
  bitIndexer: undefined,
  bitBuilder: undefined,
  signer: undefined,
  isSubAccount: true,
  mainAccount: 'makeafriend.bit'
}
```

## mainAccount
To get the main account of a SubDID.
### Parameters
N/A
### Return Value
`string`
### Example
```javascript
const subAccount = new BitSubAccount({account: 'jeff.makeafriend.bit'});
// To get the main account of 'jeff.makeafriend.bit'.
console.log(subAccount.mainAccount);

// ...
// The printed result would be like:
makeafriend.bit
```

## changeOwner(keyInfo)
To change the owner of a SubDID.
> Note: This is a write API, which means you need to set up a signer before calling it. See example below for how to set up a signer.
### Parameters
- keyInfo: `KeyInfo`
  - key: `string`. The address on a certain blockchain
  - (Optional) coin_type: `string`. (60: ETH, 195: TRX, 9006: BNB, 966: Matic, 3: Doge, 309: CKB). See [What is coin_type?](../../README.md#what-is-coin_type) in FAQ for more details.
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

const subAccount = new BitSubAccount({account: 'jeff.makeafriend.bit', signer});
const result = await subAccount.changeOwner({
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
To change the manager of a SubDID.
> Note: This is a write API, which means you need to set up a signer before calling it. See example below for how to set up a signer.
### Parameters
- keyInfo: `KeyInfo`
  - key: `string`. The address on a certain blockchain
  - (Optional) coin_type: `string`. (60: ETH, 195: TRX, 9006: BNB, 966: Matic, 3: Doge, 309: CKB). See [What is coin_type?](../../README.md#what-is-coin_type) in FAQ for more details.
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

const subAccount = new BitSubAccount({account: 'jeff.makeafriend.bit', signer});
const result = await subAccount.changeManager({
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
To update all records of a SubDID.
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

const subAccount = new BitSubAccount({account: 'jeff.makeafriend.bit', signer});
const result = await subAccount.updateRecords([{
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
