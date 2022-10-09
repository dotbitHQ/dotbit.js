@dotbit/plugin-avatar
==================
## QuickStart

```typescript
import { createInstance } from 'dotbit'
import { BitPluginAvatar } from '@dotbit/plugin-avatar'

const dotbit = createInstance()

dotbit.installPlugin(new BitPluginAvatar())

dotbit.avatar('imac.bit').then(console.log) // { url: 'https://thiscatdoesnotexist.com' }
```

## License
MIT License (including **all** dependencies).