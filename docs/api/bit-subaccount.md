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
### Parameters
- keyInfo: `KeyInfo`
  - key: `string`. The address on a certain blockchain
  - (Optional) coin_type: `string`. (60: ETH, 195: TRX, 714: BNB, 966: Matic)
### Return Value
Promise<{ hash?: `string`, hash_list: `string[]` }>
### Example
```javascript
// --------Need to add signer-------
const subAccount = new BitSubAccount({account: 'jeff.makeafriend.bit'});
const result = await subAccount.changeOwner({
  key: '0x1d643fac9a463c9d544506006a6348c234da485f',
  coin_type: "60" // The coin type of ETH
})
console.log(result);

// ...
// The printed result would be like:
```

## changeManager(keyInfo)
To change the manager of a SubDID.
### Parameters
- keyInfo: `KeyInfo`
  - key: `string`. The address on a certain blockchain
  - (Optional) coin_type: `string`. (60: ETH, 195: TRX, 714: BNB, 966: Matic)
### Return Value
Promise<{ hash?: `string`, hash_list: `string[]` }>
### Example
```javascript
// --------Need to add signer-------
const subAccount = new BitSubAccount({account: 'jeff.makeafriend.bit'});
const result = await subAccount.changeManager({
  key: '0x1d643fac9a463c9d544506006a6348c234da485f',
  coin_type: "60" // The coin type of ETH
})
console.log(result);

// ...
// The printed result would be like:
```

## updateRecords(records)
To update all records of a SubDID.
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
// --------Need to add signer-------
const subAccount = new BitSubAccount({account: 'jeff.makeafriend.bit'});
const result = await subAccount.updateRecords([{
  key: 'profile.email',
  value: 'hr@apple.com',
  label: 'HR',
  ttl: '3000',
}])
console.log(result);

// ...
// The printed result would be like:
```