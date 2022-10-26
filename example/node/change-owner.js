const { createInstance, EthersSigner, CoinType } = require('../../lib/index')
const { ethers, Wallet } = require('ethers')

const account = 'imac.bit' // your account
const address = '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38' // your account's current owner
const privateKey1 = '87d8a2bccdfc9984295748fa2058136c8131335f59930933e9d4b3e74d4fca42' // Your account's private key
const provider = new ethers.providers.InfuraProvider()
const wallet = new Wallet(privateKey1, provider)
const signer = new EthersSigner(wallet)

const dotbit = createInstance({
  signer,
})

async function main () {
  const bitAccount = dotbit.account(account)
  await bitAccount.changeOwner({
    key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38', // target address
    coin_type: CoinType.ETH,
  })
  console.log('success')
}

void main()
