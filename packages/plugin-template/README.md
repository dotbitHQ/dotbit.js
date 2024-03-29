# @dotbit/plugin-template

This is a demo plugin demonstrating the basic structure of a .bit plugin.

This plugin adds a method `fly` to `BitAccount` and a method `flyAccount` to `DotBit`.

## Usage

```javascript
import { createInstance } from 'dotbit'
import { BitPluginTemplate } from '@dotbit/plugin-template'

const dotbit = createInstance()
const plugin = new BitPluginTemplate()

// Install plugin to this `DotBit` instance
dotbit.installPlugin(plugin)
// A method `flyAccount` is added to this `DotBit` instance by the plugin
dotbit.flyAccount('imac.bit').then(console.log) // => 'imac.bit is flying to sky'

const bitAccount = dotbit.account('imac.bit')
// A method `fly` is also added to this `BitAccount` instance by the plugin
bitAccount.fly().then(conosle.log) // => 'imac.bit is flying'

// This will reomve the plugin
dotbit.uninstallPlugin(plugin)
```

## Create a new plugin
1. Please copy this template plugin under [packages](../) folder.
2. Rename the folder to your preferred name, and change the package name to `@dotbit/plugin-xxx`.
3. Finish the plugin code according to dotbit [plugin API](#write-plugin) below.
4. Add tests under [./tests](./tests).
5. Wrap them up and commit the code, and finally create a pull request.
6. Once the codes are merged, your plugin will be published to npm. You can then use your plugin in production.

> **NOTE**: The distributed codes will use ES Module or CommonJS and not compressed. You don't need to include webpack, rollup or other bundle tools.
> In most cases, you will only need to run the build command: `npm run build`.

## Plugin API
Please check out the code here: [index.ts](./src/index.ts)

Basically, your plugin should provide 1 required method `onInstall` and 2 optional methods `onInitAccount` and `onUninstall`. Their signatures are below:
```typescript
export interface BitPluginBase {
  version?: string,
  name?: string,
  /**
   * This function will be invoked when plugin installed
   * @param dotbit {DotBit}
   */
  onInstall: (dotbit: DotBit) => void,
  /**
   * This function will be invoked when plugin uninstalled
   * @param dotbit {DotBit}
   */
  onUninstall?: (dotbit: DotBit) => void,
  /**
   * This function will be invoked when .bit account initialized
   * @param bitAccount {BitAccount}
   */
  onInitAccount?: (bitAccount: BitAccount) => void,
}
```
You can also check out here: [types.ts](../../src/types.ts#L5).

## Publish a plugin
> Please use this command below, otherwise, you are publishing a private package.

```shell
pnpm publish --access public
```

## Contribute
We are willing to integrate with more brilliant projects in this ecosystem.

Please feel free to raise an issue or PR if you have any idea.
Or you can chat directly with .bit developers in [.bit Discord channel](https://discord.gg/fVppR7z4ht).

