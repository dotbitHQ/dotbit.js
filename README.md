# das-sdk

A library to resolve DAS accounts

## Install
```shell
npm install das-sdk
```

## Setup
```javascript
import Das from 'das-sdk'

const das = new Das()

das.record('dasloveckb.bit', 'address.ckb').then(console.log) // 'ckb1q...sfl9k'
```

## Interfaces

```typescript
interface DasSource {
  url?: string, // The Das indexer url
  network?: 'mainnet' | 'aggron' // Currently support 'mainnet' and 'aggron' testnet
}

abstract class Das {
  constructor (source?: DasSource);

  // Returns the owner address of DAS account
  owner (account: string): Promise<string>; 

  // Returns the record for a given key for the DAS account
  record (account: string, key: string): Promise<string>; // erturn 

  // returns the for the given keys for the DAS account
  records (account: string, keys: string[]): Promise<Record<string, string>>;

  // check if the account is registered
  isRegistered (account: string): Promise<boolean>;
}
```

## Examples
```javascript
import Das from 'das-sdk'

const das = new Das({
  network: 'aggron' // Use aggron testnet instead of default mainnet
})

das.records('dasloveckb.bit').then(console.log)
/*
  ==>
 {
  'address.eth': '0x1234...7890',
  'profile.email': 'abc@da.systems',
  'custom.location': 'mars',
 }
 */

das.owner('dasloveckb.bit').then(console.log) // => '0x1234...6789'
```
