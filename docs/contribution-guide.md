## Plugin Guide
### How to add a plugin
1. Please copy the template plugin under [packages/plugin-template](../packages/plugin-template) folder.
2. Rename the folder to your preferred name, and change the package name to `@dotbit/plugin-xxx`.
3. Finish the plugin code according to dotbit [plugin API](#plugin-api) below.
4. Add tests under [./tests](../packages/plugin-template/tests).
5. Wrap them up and commit the code, and finally create a pull request.
6. Once the codes are merged, your plugin will be published to npm. You can then use your plugin in production.

> **NOTE**: The distributed codes will use ES Module or CommonJS and not compressed. You don't need to include webpack, rollup or other bundle tools.
> In most cases, you will only need to run the build command: `npm run build`.

### Plugin API
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

### Publish a plugin
> As we rely on pnpm to override `types` field in package.json with `publishConfig`, so stick to use pnpm to publish a new version.
> Otherwise, the `types` field in package.json in npm will not be correct.

> Please use this command below, otherwise, you are publishing a private package.

```shell
pnpm publish --access public
```


## How to use pnpm to manage packages & monorepo

### FAQ
#### How to reference workspace packages
If you have a package in the workspace named `foo`, please reference it as `"foo": "workspace:^"`.
When publishing the package, it will be automatically converted to regular versions: `"foo": "0.4.7"`.


### Commands
- Add a dependency to specific packages: `pnpm i axios --filter avatar`
- Publish a specific package:`pnpm publish --access publish --filter avatar`

### Help
For more usage, please refer to the official docs: [pnpm Workspace](https://pnpm.io/workspaces)
For a complete example: [pnpm-workspace example](https://github.com/liuweiGL/pnpm-workspace/blob/main/packages/path/tsconfig.json)