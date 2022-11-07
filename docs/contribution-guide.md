## How to use pnpm to manage packages & monorepos

### FAQ
#### How to reference workspace packages
If you have a package in the workspace named `foo`, please reference it as `"foo": "workspace:^"`.
When publishing the package, it will be automatically converted to regular versions: `"foo": "0.4.7"`.


### Commands
- Add a dependency to specific packages: `pnpm i axios --filter avatar`

### Help
For more usage, please refer to the official docs: [pnpm Workspace](https://pnpm.io/workspaces)
For a complete example: [pnpm-workspace example](https://github.com/liuweiGL/pnpm-workspace/blob/main/packages/path/tsconfig.json)