const { createInstance, EvmSigner, CoinType, sleep } = require('../../../lib/index')
const { Wallet, QuickNodeProvider } = require('ethers')
const fs = require('fs')
const path = require('path')

const account = `${process.env.NAME}.bit` // your account
const address = process.env.ADDRESS
const privateKey = process.env.PRIVATE_KEY
const provider = new QuickNodeProvider()
const wallet = new Wallet(privateKey, provider)
const signer = new EvmSigner(wallet)

const dotbit = createInstance({
  signer,
})

async function main () {
  const bitAccount = dotbit.account(account)
  const content = fs.readFileSync(path.resolve(__dirname, './name-key-year.csv'), 'utf-8')
  const accountList = content
    .trim() // remove possible trailing space
    .split('\n') // split the file by \n
    .slice(1) // skip the title
    .map(accountData => accountData.split(',')) // split to fields
  let i = 0
  const batchCount = 50

  while (i < accountList.length) {
    const accountPartial = accountList.slice(i, i + batchCount)
    const accountsToMint = []
    for (let [name, key, years] of accountPartial) {
      if (key.endsWith('.eth')) {
        key = await provider.resolveName(key)
      }
      else if (key.endsWith('.bit')) {
        const bitAccount = await dotbit.account(key)
        key = (await bitAccount.owner()).key
      }
      accountsToMint.push({
        account: `${name}.${account}`.toLowerCase().replaceAll(' ', '-'), // we don't support upppercase name, and replace possible space with dash
        keyInfo: {
          key,
          coin_type: CoinType.ETH,
        },
        registerYears: Number(years)
      })
    }

    try {
      console.log(`wanted ${i} ${accountsToMint[0].account} to ${accountsToMint[accountsToMint.length - 1].account}`)

      await bitAccount.mintSubAccounts(accountsToMint)

      console.log(`minted ${accountsToMint[0].account} to ${accountsToMint[accountsToMint.length - 1].account}`)

      i += batchCount
      await sleep(60 * 3 * 1000) // wait for 3 minutes for completion
    }
    catch (e) {
      console.log(e.code, e.message)
      await sleep(60 * 1000) // wait for 1 minute to retry
    }
  }

  console.log('mint all successfully')
}

void main()
