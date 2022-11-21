import { DotBit } from 'dotbit'
import { BitPluginAvatar, getIpfsLink } from '../src/index'
import { dotbitProd } from '../../../tests/common'

const pluginAvatar = new BitPluginAvatar()

dotbitProd.installPlugin(pluginAvatar)

describe('getGateway', () => {
  it('should work', function () {
    expect(getIpfsLink('ipfs://bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m')).toBe('https://gateway.ipfs.io/ipfs/bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m')
  })

  it('work for other gateway', function () {
    expect(getIpfsLink('ipfs://bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m', 'https://cloudflare-ipfs.com')).toBe('https://cloudflare-ipfs.com/ipfs/bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m')
  })
})

describe('not install plugin', () => {
  it('should throw', () => {
    const dotbit = new DotBit()
    return expect(dotbit.avatar('imac.bit')).rejects.toThrow('Please install @dotbit/plugin-avatar to get users avatar')
  })
})

describe('bitAccount.avatar()', function () {
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

describe('dotbit.avatar()', () => {
  it('should work', async () => {
    const avatar = await dotbitProd.avatar('imac.bit')
    expect(avatar.url).toBe('https://thiscatdoesnotexist.com')
  })
})

afterAll(() => {
  dotbitProd.uninstallPlugin(pluginAvatar)
})
