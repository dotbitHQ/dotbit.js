import { BitPluginDWeb } from '../src/index'
import { ethers, Wallet } from 'ethers'
import { BitNetwork, createInstance, DWebProtocol, EthersSigner } from 'dotbit'

const address = '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38'
const privateKey1 = '87d8a2bccdfc9984295748fa2058136c8131335f59930933e9d4b3e74d4fca42'
const provider = new ethers.providers.InfuraProvider()
const wallet = new Wallet(privateKey1, provider)
const signer = new EthersSigner(wallet)

const dotbit = createInstance({
  network: BitNetwork.mainnet,
  signer
})

const pluginDWeb = new BitPluginDWeb()
dotbit.installPlugin(pluginDWeb)

describe('BitPluginDWeb', function () {
  jest.setTimeout(60 * 1000)
  it('bitAccount.dwebs()', async function () {
    const account = dotbit.account('web3max.bit')
    const res = await account.dwebs()
    expect(res.length > 0).toBeTruthy()
  })

  it('bitAccount.dwebs(DWebProtocol.ipns)', async function () {
    const account = dotbit.account('web3max.bit')
    const res = await account.dwebs(DWebProtocol.ipns)
    expect(res[0].subtype).toBe(DWebProtocol.ipns)
  })

  it('bitAccount.dweb()', async function () {
    const account = dotbit.account('web3max.bit')
    const res = await account.dweb()
    expect(res.subtype).toBe(DWebProtocol.ipns)
  })
})
