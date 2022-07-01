import ENS, { getEnsAddress } from '@ensdomains/ensjs'
import { ethers } from 'ethers'

const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/691c3fa43caf416b91ed2724cd87465d`)
let wallet = new ethers.Wallet(`0xa441b975fabb47c733cae64e745615dedc9fee6c7b168ac7c4df66f90b0ac851`, provider)
wallet = wallet.connect(provider)

// wallet.provider

const ens = new ENS({
  provider: provider,
  ensAddress: getEnsAddress('1')
})

const name = ens.name('abc.dfdfdjeffjing12222.eth')

name.getOwner().then(console.log)
// name.getResolver().then(console.log)
// name.getTTL().then(console.log)
// name.getAddress(`60`).then(console.log)
// name.getText(`60`).then(console.log)
