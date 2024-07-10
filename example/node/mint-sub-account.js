const { createInstance, EvmSigner, CoinType } = require('../../lib/index')
const { Wallet, QuickNodeProvider } = require('ethers')

const address = '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38'
const privateKey1 = '87d8a2bccdfc9984295748fa2058136c8131335f59930933e9d4b3e74d4fca42'
const provider = new QuickNodeProvider('holesky')
const wallet = new Wallet(privateKey1, provider)
const signer = new EvmSigner(wallet)

const dotbit = createInstance({
  network: 'testnet',
  signer,
})

async function main () {
  await dotbit.records('imac.bit').then(console.log)
  await dotbit.accountInfo('imac.bit').then(console.log)

  const account = dotbit.account('imac.bit')

  const res = await account.mintSubAccount({
    account: '001.imac.bit',
    keyInfo: {
      coin_type: CoinType.ETH,
      key: await wallet.getAddress(), // sub account's owner address
    },
    registerYears: 1,
  })

  console.log(res)
}

void main()
