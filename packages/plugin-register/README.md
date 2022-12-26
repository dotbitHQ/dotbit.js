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

## License
MIT License (including **all** dependencies).
