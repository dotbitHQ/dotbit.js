# @dotbit/plugin-dweb

A plugin to handle DWeb records for .bit accounts.

This plugin adds a method `dWeb` and `dWebs` to `BitAccount`.

Removed protocol headers from DWeb records, including `ipns://`, `ipfs://`, `sia://`, `arweave://`, `ar://`, `resilio://`.

## Usage

```typescript
import { createInstance } from 'dotbit'
import { BitPluginDWeb } from '@dotbit/plugin-dweb'

const dotbit = createInstance()
const plugin = new BitPluginDWeb()
dotbit.installPlugin(plugin)

const account = dotbit.account('web3max.bit')

// get the .bit account DWeb records.
const records = await account.dwebs()

// get the specified .bit account DWeb record.
const ipnsRecords = await account.dwebs(DWebProtocol.ipns)

// resolve a dweb in a specific sequence.
const dweb = await account.dweb()
```

## License
MIT License (including **all** dependencies).

