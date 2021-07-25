# das-sdk

A library to resolve DAS accounts

## Install
```shell
npm install das-sdk
```

## Setup
```javascript
import Das from 'das-sdk'

const das = new Das({
  url: 'https://{{endpoint.to.das.account.indexer}}',
  network: 'mainnet',
})

das.recordsByKey ('dasloveckb.bit', 'address.ckb')
/* ==>
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
```

## Configuration
To set up das-sdk, you need to provide `url` and `network`.  

- `url` is the JSON-RPC endpoint of [das_account_indexer](https://github.com/DeAccountSystems/das_account_indexer).
- `network` indicate which CKB network the `url` belongs to. Currently, we have deployed [DAS contracts](https://github.com/DA-Services/das-contracts) on CKB mainnet and aggron testnet. You can also deploy the contracts on your own testnet.

We suggest that developers run their own [das_account_indexer](https://github.com/DeAccountSystems/das_account_indexer).

However, if you are new to DAS and want to test das-sdk, you can use the indexer below as a start:

- mainnet: `https://indexer.da.systems`
- aggron: [not available for now]


## Interfaces

```typescript
interface DasSource {
  url?: string, // The Das indexer url
  network?: 'mainnet' | 'aggron' | 'testnet' // Currently support 'mainnet' and 'aggron' testnet
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

export interface ConstructedAccount {
  account: string,
  avatar: string,

  // as there may be multiple records with the same key, so we will return all the records for a type.
  profiles: AccountRecord[],
  addresses: AccountRecord[],
  dwebs: AccountRecord[],
  customs: AccountRecord[],
  
  // Unlike fields with plural, sdk will choose a record randomly if there are multiple records with the same `key`, 
  // and fill into corresponding fields withour plural, like `profile` versus `profiles`.
  // you can see a example below.
  profile: Record<string, AccountRecord>,
  address: Record<string, AccountRecord>,
  dweb: Record<string, AccountRecord>,
  custom: Record<string, AccountRecord>,

  records: AccountRecord[],
}

// Main API
abstract class Das {
  constructor (source?: DasSource);

  // Returns the owner address of the DAS account
  owner (account: string): Promise<string>;

  // Returns contructed account data, 
  account(account: string): Promise<ConstructedAccount>
  
  // returns the record list for the given keys of the DAS account
  // see [Examples](#Examples) below for defail
  recordsByKey (account: string, key: string): Promise<AccountRecord[]>;
  
  // returns the address for the give chain of the DAS account.
  // only one will be returned if there is multiple address for a chain
  addr(account: string, chain: string): Promise<string>;

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

das.addr('dasloveckb.bit', 'eth').then(console.log) // '0x1234...6780'

das.account('dasloveckb.bit').then(console.log)
/** ==>
 {
  account: 'jeffjing.bit',
  avatar: 'https://identicons.da.systems/identicon/jeffjing.bit',

  profile: {
    email: {
      key: 'profile.email',
      label: 'personal email',
      value: 'das@google.com',
      ttl: 300,
      type: 'profile',
    }
  },
  address: {
    eth: {
      key: 'address.eth',
      label: '',
      value: '0x1234...5678',
      ttl: 300,
      type: 'address',
    }
  },
  dweb: {},
  custom: {},

  profiles: [
    {
      key: 'profile.email',
      label: 'personal email',
      value: 'das@google.com',
      ttl: 300,
      type: 'profile',
    },
    {
      key: 'profile.email',
      label: 'business email',
      value: 'das@da.systems',
      ttl: 300,
      type: 'profile',
    }
  ],
  addresses: [
    {
      key: 'address.eth',
      label: '',
      value: '0x1234...5678',
      ttl: 300,
      type: 'address',
    }
  ],
  dwebs: [],
  customs: [],

  records: [
    {
      key: 'address.eth',
      label: '',
      value: '0x1234...5678',
      ttl: 300,
      type: 'address',
    },
    {
      key: 'profile.email',
      label: 'personal email',
      value: 'das@google.com',
      ttl: 300,
      type: 'profile',
    },
    {
      key: 'profile.email',
      label: 'business email',
      value: 'das@da.systems',
      ttl: 300,
      type: 'profile',
    }
  ]
}
 */
```
