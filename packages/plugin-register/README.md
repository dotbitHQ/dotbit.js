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
you need to wait for a successful account registration and call `mintEthNft`

```typescript
await account.mintEthNft()
```

## License
MIT License (including **all** dependencies).