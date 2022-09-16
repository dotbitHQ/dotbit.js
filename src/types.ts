import { BitAccount } from './BitAccount'
import { DotBit } from './DotBit'

export interface BitPluginBase {
  version?: string,
  name?: string,
  /**
   * This function will be invoked when plugin installed
   * @param dotbit {DotBit}
   */
  onInstall: (dotbit: DotBit) => void,
  /**
   * This function will be invoked when plugin uninstalled
   * @param dotbit {DotBit}
   */
  onUninstall?: (dotbit: DotBit) => void,
  /**
   * This function will be invoked when .bit account initialized
   * @param bitAccount {BitAccount}
   */
  onInitAccount?: (bitAccount: BitAccount) => void,
}
