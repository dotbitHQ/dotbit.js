import { BitPluginRegister } from '../src/index'
import { QuickNodeProvider, Wallet } from 'ethers'
import { BitNetwork, CoinType, createInstance, DotBit, EvmSigner, PaymentMethodIDs } from 'dotbit'

const address = '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38'
const privateKey1 = '87d8a2bccdfc9984295748fa2058136c8131335f59930933e9d4b3e74d4fca42'
const provider = new QuickNodeProvider('holesky')
const wallet = new Wallet(privateKey1, provider)
const signer = new EvmSigner(wallet)

const dotbit = createInstance({
  network: BitNetwork.testnet,
  signer
})
const pluginRegister = new BitPluginRegister()
dotbit.installPlugin(pluginRegister)

describe('bitAccount.register()', function () {
  jest.setTimeout(60 * 1000)
  it('pay with ETH', async function () {
    const account = dotbit.account('registeraccounttest010.bit')
    const res = await account.register({
      keyInfo: {
        key: address,
        coin_type: CoinType.ETH
      },
      registerYears: 1,
      paymentMethodID: PaymentMethodIDs.eth
    })
    expect(res.txHash).toMatch(/^0x([A-Fa-f0-9]+)$/)
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
    const account = dotbit.account('registeraccounttest011.bit')
    const res = await account.register({
      keyInfo: {
        key: address,
        coin_type: CoinType.ETH
      },
      registerYears: 1,
      paymentMethodID: PaymentMethodIDs.dotbitBalance
    })
    expect(res.txHash).toMatch(/^0x([A-Fa-f0-9]+)$/)
  })
})

describe('renew', () => {
  jest.setTimeout(60 * 1000)
  it('use ETH to renew.', async () => {
    const account = dotbit.account('imac.bit')
    const res = await account.renew({
      renewYears: 1,
      paymentMethodID: PaymentMethodIDs.eth
    })
    expect(res.txHash).toMatch(/^0x([A-Fa-f0-9]+)$/)
  })

  it('use .bitBalance to renew.', async () => {
    const account = dotbit.account('imac.bit')
    const res = await account.renew({
      renewYears: 1,
      paymentMethodID: PaymentMethodIDs.dotbitBalance
    })
    expect(res.txHash).toMatch(/^0x([A-Fa-f0-9]+)$/)
  })

  it('renew other people\'s accounts.', async () => {
    const account = dotbit.account('web3max.bit')
    const res = await account.renew({
      renewYears: 1,
      paymentMethodID: PaymentMethodIDs.dotbitBalance
    })
    expect(res.txHash).toMatch(/^0x([A-Fa-f0-9]+)$/)
  })

  it('should throw', async () => {
    const account = dotbit.account('001.imac.bit')
    try {
      const res = await account.renew({
        renewYears: 1,
        paymentMethodID: PaymentMethodIDs.eth
      })
    }
    catch (err) {
      expect(err.message).toMatch('Second-level DID renewal is not supported for now.')
    }
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
