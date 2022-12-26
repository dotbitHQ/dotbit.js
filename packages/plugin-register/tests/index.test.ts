import { BitPluginRegister } from '../src/index'
import { ethers, Wallet } from 'ethers'
import { BitNetwork, CoinType, createInstance, DotBit, EthersSigner, PaymentMethodIDs } from 'dotbit'

const address = '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38'
const privateKey1 = '87d8a2bccdfc9984295748fa2058136c8131335f59930933e9d4b3e74d4fca42'
const provider = new ethers.providers.InfuraProvider('goerli')
const wallet = new Wallet(privateKey1, provider)
const signer = new EthersSigner(wallet)

const dotbit = createInstance({
  network: BitNetwork.testnet,
  signer
})
const pluginTemplate = new BitPluginRegister()
dotbit.installPlugin(pluginTemplate)

describe('bitAccount.register()', function () {
  jest.setTimeout(60 * 1000)
  it('pay with ETH', async function () {
    const account = dotbit.account('registeraccounttest009.bit')
    await account.register({
      keyInfo: {
        key: address,
        coin_type: CoinType.ETH
      },
      registerYears: 1,
      paymentMethodID: PaymentMethodIDs.eth
    })
  })

  it('account already register', async function () {
    try {
      const account = dotbit.account('registeraccounttest003.bit')
      await account.register({
        keyInfo: {
          key: address,
          coin_type: CoinType.ETH
        },
        registerYears: 1,
        paymentMethodID: PaymentMethodIDs.eth
      })
    }
    catch (err) {
      expect(err.message).toMatch('account already register')
    }
  })

  it('pay with .bit balance', async function () {
    const account = dotbit.account('registeraccounttest008.bit')
    await account.register({
      keyInfo: {
        key: address,
        coin_type: CoinType.ETH
      },
      registerYears: 1,
      paymentMethodID: PaymentMethodIDs.dotbitBalance
    })
  })
})

describe('not install plugin', () => {
  it('should throw', async () => {
    const dotbit = new DotBit()
    const account = dotbit.account('registeraccounttest003.bit')
    try {
      const res = await account.register({
        keyInfo: {
          key: address,
          coin_type: CoinType.ETH
        },
        registerYears: 1,
        paymentMethodID: PaymentMethodIDs.eth
      })
    }
    catch (err) {
      expect(err.message).toMatch('Please install plugin @dotbit/plugin-register')
    }
  })
})
