import { DotBit } from 'dotbit'
import { BitPluginAvatar } from '../src/index'
import { dotbitProd } from '../../../tests/common'

const pluginAvatar = new BitPluginAvatar()

dotbitProd.installPlugin(pluginAvatar)

describe('avatar', function () {
  it('should work', async function () {
    const account = dotbitProd.account('imac.bit')
    expect(await account.avatar()).toStrictEqual({
      linkage: [
        {
          content: 'imac.bit',
          type: 'account'
        },
        {
          content: 'https://thiscatdoesnotexist.com',
          type: 'url'
        }
      ],
      url: 'https://thiscatdoesnotexist.com'
    })
  })
})

afterAll(() => {
  dotbitProd.uninstallPlugin(pluginAvatar)
})
