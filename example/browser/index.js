import './polyfill'
import { createInstance } from '../../lib.esm/index.js'
import { ProviderSigner } from '../../lib.esm/signers/ProviderSigner'
import { CoinType } from '../../lib.esm/const'
import { typedDataFromMetamask } from './typedData'

const $ = document.querySelector.bind(document)
const $inputAccount = $('#input-account')
const $inputSubAccount = $('#input-sub-account')
const $buttonRecords = $('#btn-records')
const $buttonMint = $('#btn-mint')
const $buttonInfo = $('#btn-into')
const $buttonPersonalSign = $('#btn-personal-sign')
const $buttonSignTypedData = $('#btn-sign-typed-data')
const $codeOutput = $('#code-output')

async function main () {
  const signer = new ProviderSigner(window.ethereum)
  const dotbit = window.dotbit = createInstance({ signer })

  const addresses = await window.ethereum.send('eth_requestAccounts')

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
          coin_type: CoinType.ETH,
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

  $buttonPersonalSign.addEventListener('click', async (a) => {
    signer.signData('0xtest').then(res => {
      $codeOutput.innerHTML = res
    })
  })

  $buttonSignTypedData.addEventListener('click', async (a) => {
    signer.signData(typedDataFromMetamask, true).then(res => {
      $codeOutput.innerHTML = res
    })
  })
}

void main()
