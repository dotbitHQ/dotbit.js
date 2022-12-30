import { version } from '../package.json'
import { BitAccount, BitPluginBase, DotBit, DWebProtocol, RecordType } from 'dotbit'
import { BitAccountRecordExtended } from 'dotbit/fetchers/BitIndexer.type'

function matchProtocol (str: string) {
  return str.match(/^(ipns|ipfs|sia|arweave|ar|resilio):\/\/(.*)/)
}

export class BitPluginDWeb implements BitPluginBase {
  version = version
  name = 'BitPluginDWeb'

  onInstall (dotbit: DotBit) {
  }

  onUninstall (dotbit: DotBit) {
  }

  onInitAccount (bitAccount: BitAccount) {
    bitAccount.dwebs = async function (this: BitAccount, protocol?: DWebProtocol): Promise<BitAccountRecordExtended[]> {
      const records = await this.records()

      let dwebs = records.filter(record => record.type === RecordType.dweb)
      dwebs = dwebs.map((record) => {
        const matched = matchProtocol(record.value)
        if (matched) {
          record.value = matched[2]
        }
        return record
      })
      return protocol ? dwebs.filter(record => record.subtype === protocol.toLowerCase()) : dwebs
    }

    bitAccount.dweb = async function (this: BitAccount): Promise<BitAccountRecordExtended> {
      const dwebs = await this.dwebs()

      if (!dwebs.length) {
        return null
      }
      else if (dwebs.length === 1) {
        return dwebs[0]
      }
      else {
        const protocol = [DWebProtocol.ipns, DWebProtocol.ipfs, DWebProtocol.arweave, DWebProtocol.skynet, DWebProtocol.resilio].find(protocol => dwebs.find(dweb => dweb.subtype === protocol))
        return dwebs.find(dweb => dweb.subtype === protocol)
      }
    }
  }
}
