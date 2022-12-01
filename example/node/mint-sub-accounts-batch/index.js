const { createInstance, EthersSigner, CoinType, sleep } = require('../../../lib/index')
const { ethers, Wallet } = require('ethers')
const fs = require('fs')
const path = require('path')

const account = `${process.env.NAME}.bit` // your account
const address = process.env.ADDRESS
const privateKey = process.env.PRIVATE_KEY
const provider = new ethers.providers.InfuraProvider()
const wallet = new Wallet(privateKey, provider)
const signer = new EthersSigner(wallet)

const dotbit = createInstance({
  signer,
})

async function main () {
  const bitAccount = dotbit.account(account)
  const content = fs.readFileSync(path.resolve(__dirname, './name-key-year.csv'), 'utf-8')
  const accountList = content.split('\n')
    .slice(1) // skip the title
    .map(accountData => accountData.split(',')) // split to fields
  let i = 0
  const batchCount = 50

  while (i < accountList.length) {
    const accountPartial = accountList.slice(i, i + batchCount)
    const accountsToMint = accountPartial.map(([name, key, years]) => {
      return {
        account: `${name}.${account}`,
        keyInfo: {
          key,
          coin_type: CoinType.ETH,
        },
        registerYears: Number(years)
      }
    })

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
