import './polyfill'
import { createInstance, EthersSigner } from '../../lib.esm/index.js'
import { ethers } from 'ethers'

const $ = document.querySelector.bind(document)
const $inputAccount = $('#input-account')
const $inputSubAccount = $('#input-sub-account')
const $buttonRecords = $('#btn-records')
const $buttonMint = $('#btn-mint')
const $buttonInfo = $('#btn-into')
const $codeOutput = $('#code-output')

async function main () {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const ethersSigner = provider.getSigner()
  const signer = new EthersSigner(ethersSigner)
  const dotbit = createInstance({ network: 'testnet', signer })

  const addresses = await provider.send('eth_requestAccounts')

  const address = addresses[0]

  dotbit.accountInfo($inputAccount.value).then(info => {
    $codeOutput.innerHTML = JSON.stringify(info, null, 2)
  })

  $buttonInfo.addEventListener('click', () => {
    const account = $inputAccount.value

    dotbit.accountInfo(account).then(info => {
      $codeOutput.innerHTML = JSON.stringify(info, null, 2)
    })
  })

  $buttonRecords.addEventListener('click', () => {
    const account = $inputAccount.value

    dotbit.records(account).then(records => {
      $codeOutput.innerHTML = JSON.stringify(records, null, 2)
    })
  })

  $buttonMint.addEventListener('click', async (a) => {
    try {
      const account = $inputAccount.value
      const subAccount = $inputSubAccount.value

      const bitAccount = dotbit.account(account)

      const res = await bitAccount.mintSubAccount({
        account: subAccount,
        keyInfo: {
          coin_type: '60',
          key: address,
        },
        registerYears: 1,
      })

      $codeOutput.innerHTML = JSON.stringify(res, null, 2)
    }
    catch (e) {
      window.alert(e.message)
    }
  })
}

void main()
