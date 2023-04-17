import { DotBit, BitAccount, BitPluginBase, sleep } from 'dotbit'
import './types'
import { version } from './version'

export class BitPluginTemplate implements BitPluginBase {
  version = version
  name = 'BitPluginTemplate'

  onInstall (dotbit: DotBit) {
    console.log('This function will be invoked when plugin installed, you can add some methods to DotBit like the code below:')

    dotbit.flyAccount = function (this: DotBit, account: string) {
      const bitAccount = this.account(account)
      return bitAccount.fly().then(word => word + ' to sky')
    }
  }

  onUninstall (dotbit: DotBit) {
    console.log('This function will be invoked when plugin uninstalled')
  }

  onInitAccount (bitAccount: BitAccount) {
    console.log('This function will be invoked when .bit account initialized')

    bitAccount.fly = async function (this: BitAccount): Promise<string> {
      await sleep(100)
      return `${this.account} is flying`
    }
  }
}
