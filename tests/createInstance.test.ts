import { ethers, Wallet } from 'ethers'
import { BitNetwork } from '../src/const'
import { createInstance, DotBit, EthersSigner, ProviderSigner } from '../src/index'

describe('createInstance', function () {
  it('no config', async function () {
    const dotbit = createInstance()

    expect(dotbit).toBeInstanceOf(DotBit)
    expect(dotbit.network).toBe(BitNetwork.mainnet)
    expect(dotbit.bitIndexer).toBeTruthy()
    expect(dotbit.bitIndexer.rpc.url).toBe('https://indexer-v1.did.id')
    expect(dotbit.bitBuilder).toBeTruthy()
  })

  it('testnet', async function () {
    const dotbit = createInstance({
      network: BitNetwork.testnet,
    })

    expect(dotbit.network).toBe(BitNetwork.testnet)
    expect(dotbit.bitIndexer.rpc.url).toBe('https://test-indexer.did.id')
  })

  it('with builder', async function () {
    const privateKey1 = '87d8a2bccdfc9984295748fa2058136c8131335f59930933e9d4b3e74d4fca42'
    const provider = new ethers.providers.InfuraProvider('goerli')
    const wallet = new Wallet(privateKey1, provider)
    const signer = new EthersSigner(wallet)

    const dotbit = createInstance({
      network: BitNetwork.mainnet,
      signer,
    })

    expect(dotbit.signer).toBeTruthy()
    const sig = await dotbit.signer.signData('0xtest')
    expect(sig).toBe('0x07d19751f27e47464247f75bd8fc274b2bfe65b534e59daa081dc8a4928e08102f8a6b84131835623f745ab8f2412966c7da6f05924b9239072fa95bdf02c1941c')
  })

  it('with ProviderSigner', async function () {
    // @ts-expect-error
    const signer = new ProviderSigner(window.ethereum)
    const dotbit = createInstance({
      network: BitNetwork.testnet,
      signer,
    })

    expect(dotbit).toBeInstanceOf(DotBit)
  })
})
