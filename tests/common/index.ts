import { QuickNodeProvider, Wallet } from 'ethers'
import { BitAccount } from '../../src/BitAccount'
import { BitSubAccount } from '../../src/BitSubAccount'
import { BitIndexer, DotBit, EvmSigner, RemoteTxBuilder } from '../../src/index'

const bitIndexer = new BitIndexer({
  // uri: 'https://indexer-v1.d.id',
  uri: 'https://test-indexer.d.id',
  // uri: 'https://test-indexer-not-use-in-production-env.d.id',
})
const bitBuilder = new RemoteTxBuilder({
  subAccountUri: 'https://test-subaccount-api.d.id/v1',
  registerUri: 'https://test-register-api.d.id/v1'
})
const address = '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38'
const privateKey1 = '87d8a2bccdfc9984295748fa2058136c8131335f59930933e9d4b3e74d4fca42'
const provider = new QuickNodeProvider('holesky')
const wallet = new Wallet(privateKey1, provider)
const signer = new EvmSigner(wallet)

const bitIndexerProd = new BitIndexer({
  uri: 'https://indexer-v1.d.id',
})
const bitBuilderProd = new RemoteTxBuilder({
  subAccountUri: 'https://subaccount-api.d.id/v1',
  registerUri: 'https://register-api.d.id/v1'
})

export const dotbitProd = new DotBit({
  bitIndexer: bitIndexerProd
})

export const accountNotExist = new BitAccount({
  account: 'imac-1.bit',
  bitIndexer,
  bitBuilder,
  signer,
})

export const accountWithSigner = new BitAccount({
  account: 'imac.bit',
  bitIndexer,
  bitBuilder,
  signer,
})
export const accountWithSignerProd = new BitAccount({
  account: 'imac.bit',
  bitIndexer: bitIndexerProd,
  bitBuilder: bitBuilderProd,
  signer,
})
export const accountWithSignerProdRecords = [
  {
    key: 'address.eth',
    type: 'address',
    subtype: 'eth',
    label: '',
    value: '0x1d643fac9a463c9d544506006a6348c234da485f',
    ttl: '300'
  },
  {
    key: 'address.trx',
    type: 'address',
    subtype: 'trx',
    label: '',
    value: 'TPzZyfAgkqASrKkkxiMWBRoJ6jgt718SCX',
    ttl: '300'
  },
  {
    key: 'address.trx',
    type: 'address',
    subtype: 'trx',
    label: '',
    value: 'TWiV82cSnCffyqkAwCuyjuvqUwZJx2nr3a',
    ttl: '300'
  },
  {
    key: 'profile.website',
    type: 'profile',
    subtype: 'website',
    label: 'Apple',
    value: 'https://www.apple.com/imac',
    ttl: '300'
  },
  {
    key: 'profile.avatar',
    type: 'profile',
    subtype: 'avatar',
    label: '',
    value: 'https://thiscatdoesnotexist.com',
    ttl: '300'
  },
  {
    key: 'profile.twitter',
    label: '',
    subtype: 'twitter',
    ttl: '300',
    type: 'profile',
    value: 'Apple',
  }
]

export const subAccountWithSigner = new BitSubAccount({
  account: '001.imac.bit',
  bitIndexer,
  bitBuilder,
  signer,
})
