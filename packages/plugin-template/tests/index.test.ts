import { DotBit } from 'dotbit'
import { BitPluginTemplate } from '../src/index'

const dotbit = new DotBit()
const pluginTemplate = new BitPluginTemplate()

dotbit.installPlugin(pluginTemplate)

describe('flyAccount', function () {
  it('should work', async function () {
    expect(await dotbit.flyAccount('imac.bit')).toBe('imac.bit is flying to sky')
  })
})

describe('fly', function () {
  it('should work', async function () {
    const account = dotbit.account('imac.bit')
    expect(await account.fly()).toBe('imac.bit is flying')
  })
})

afterAll(() => {
  dotbit.uninstallPlugin(pluginTemplate)
})
