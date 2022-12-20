// We put it here for development convenience. It should be put in packages in the future.

import { BitAccount, BitAccountOptions, BitPluginBase } from 'dotbit'

export class PluginRegister implements BitPluginBase {
  onInitAccount (bitAccount: BitAccount) {
    bitAccount.register = async function (this: BitAccount): Promise<void> {
      this.requireSigner()
      this.requireBitBuilder()
      // TBD
    }
  }
}
