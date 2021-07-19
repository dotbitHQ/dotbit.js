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

export type AccountRecordType = 'address' | 'profile' | 'dweb' | 'custom'

export interface AccountRecord {
  key: string,
  type: AccountRecordType,
  label: string,
  value: string, // 'abc_xyz123'
  ttl: string, // '300'
}

interface AccountData {
  account: string, // abc.bit
  records: AccountRecord[]
}

abstract class Das {
  constructor (source?: DasSource);

  // Returns the owner address of the DAS account
  owner (account: string): Promise<string>;

  // returns the record list for the given keys of the DAS account
  recordsByKey (account: string, key: string): Promise<AccountRecord[]>;
  
  // Returns a record value for the given key of the DAS account
  record (account: string, key: string): Promise<string>;

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

das.recordsByKey('dasloveckb.bit', 'address.eth').then(console.log)
/*
[{
  key: 'address.eth',
  type: 'address',
  label: 'coinbase',
  value: '0x1234...4567',
  ttl: 300
}, {
  key: 'address.eth',
  type: 'address',
  label: 'onchain',
  value: '0x2345...6789',
  ttl: 300,
}]
 */

das.owner('dasloveckb.bit').then(console.log) // => '0x1234...6789'
```
