@dotbit/plugin-register
==================
## QuickStart

```typescript
import { createInstance } from 'dotbit'
import { BitPluginRegister } from '@dotbit/plugin-register'

const dotbit = createInstance()

dotbit.installPlugin(new BitPluginRegister())

const account = dotbit.account('example.bit')
await account.register({
  keyInfo: {
    key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
    coin_type: CoinType.ETH
  },
  registerYears: 1,
  paymentMethodID: PaymentMethodIDs.eth
})
```
Only ETH, BNB, and MATIC address are supported as registration address for .bit accounts.

Only ETH, BNB, MATIC and .bit Balance CKB are supported as payment methods for registration of .bit accounts, see `PaymentMethodIDs` for the corresponding parameters.

The registration period is up to 20 years.

### Register as an Ethereum NFT

Registered to Ethereum, so the registered address must be an Ethereum address and the payment method must be `PaymentMethodIDs.eth`, `crossTo` must be set to `CoinType.ETH`.

```typescript
import { createInstance } from 'dotbit'
import { BitPluginRegister } from '@dotbit/plugin-register'

const dotbit = createInstance()

dotbit.installPlugin(new BitPluginRegister())

const account = dotbit.account('example.bit')
await account.register({
  registerYears: 1,
  paymentMethodID: PaymentMethodIDs.eth,
  crossTo: CoinType.ETH
})
```

the `info` method is called to see if the registration is successful, when the `status` field is `IndexerAccountStatus.onCrossChain` it means the registration is successful.

```typescript
const info = await account.info()
console.log(info)
// {
//   account: 'example.bit',
//   account_alias: 'example.bit',
//   account_id_hex: '0x...',
//   next_account_id_hex: '0x...',
//   create_at_unix: 1672123931,
//   expired_at_unix: 1703659931,
//   status: 3,
//   das_lock_arg_hex: '0x...',
//   owner_algorithm_id: 5,
//   owner_key: '0x...',
//   manager_algorithm_id: 5,
//   manager_key: '0x...'
// }
```
> ⚠️note: Registration takes about 5 minutes and requires a recurring call to the `info` method to ensure successful registration.

you need to wait for a successful account registration and call `mintEthNft`

```typescript
await account.mintEthNft()
```

the `crossChainAccountStatus` method is called to determine if the casting was successful. Success is indicated when the `status` field is `CrossChainAccountStatus.mintConfirm`.

> ⚠️note: the casting may take up to 5 minutes to complete and may require repeated calls to the `crossChainAccountStatus` method to confirm the account status.

```typescript
const status = await account.crossChainAccountStatus()
console.log(status)
// {
//   account: 'example.bit',
//   lock_hash: '0x...',
//   mint_hash: '0x...',
//   status: 5
// }
```

### .bit account are converted to ethereum NFT

a registered .bit account needs to be converted to ethereum NFT in two steps, the first of which is to lock the account.

```typescript
import { createInstance } from 'dotbit'
import { BitPluginRegister } from '@dotbit/plugin-register'

const dotbit = createInstance()

dotbit.installPlugin(new BitPluginRegister())

const account = dotbit.account('example.bit')
await account.lockAccount()
```

the `crossChainAccountStatus` method needs to be called to confirm that the first step is complete. When the `status` field is `CrossChainAccountStatus.mintSign` the first step has completed successfully.

> ⚠️note: the first step may take up to 5 minutes to complete and may require a recurring call to the `crossChainAccountStatus` method to confirm the account status.

```typescript
const status = await account.crossChainAccountStatus()
console.log(status)
// {
//   account: 'example.bit',
//   lock_hash: '0x...',
//   mint_hash: '',
//   status: 3
// }
```

after waiting for the first step to succeed, the second step is to call `mintEthNft`

```typescript
await account.mintEthNft()
```

the second step takes about 5 minutes to complete, and the `crossChainAccountStatus` method can be called, when the `status` field is `CrossChainAccountStatus.mintConfirm` indicating that the second step has completed.

### convert a .bit ethereum NFT to a .bit account.

```typescript
import { createInstance } from 'dotbit'
import { BitPluginRegister } from '@dotbit/plugin-register'

const dotbit = createInstance()

dotbit.installPlugin(new BitPluginRegister())

const account = dotbit.account('example.bit')
await account.mintBitAccount()
```

call the `info` method to see if the casting was successful. When the `status` field is `IndexerAccountStatus.normal`, it means that the casting was successful.

```typescript
const info = await account.info()
console.log(info)
// {
//   account: 'example.bit',
//   account_alias: 'example.bit',
//   account_id_hex: '0x...',
//   next_account_id_hex: '0x...',
//   create_at_unix: 1672123931,
//   expired_at_unix: 1703659931,
//   status: 0,
//   das_lock_arg_hex: '0x...',
//   owner_algorithm_id: 5,
//   owner_key: '0x...',
//   manager_algorithm_id: 5,
//   manager_key: '0x...'
// }
```

> ⚠️note: the casting takes about 5 minutes and the `info` method needs to be called repeatedly to ensure that the casting is successful.

### renew .bit account

```typescript
import { createInstance } from 'dotbit'
import { BitPluginRegister } from '@dotbit/plugin-register'

const dotbit = createInstance()

dotbit.installPlugin(new BitPluginRegister())

const account = dotbit.account('example.bit')
await account.renew({
  renewYears: 1,
  paymentMethodID: PaymentMethodIDs.eth
})
```

> ⚠️note: SubDID renewal is not supported for now.

## License
MIT License (including **all** dependencies).
