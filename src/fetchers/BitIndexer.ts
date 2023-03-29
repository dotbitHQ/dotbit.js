import { JSONRPC } from '../tools/JSON-RPC'
import {
  BitAccountInfo,
  BitAccountList,
  BitAccountRecord,
  DasAccountRecords,
  DasServerInfo,
  KeyInfo,
} from './BitIndexer.type'

export interface AccountIndexerResult<T> {
  errno: number,
  errmsg: string,
  data: T,
}

export class BitIndexer {
  rpc: JSONRPC

  constructor ({ uri }: {uri: string}) {
    this.rpc = new JSONRPC(uri)
  }

  /**
   * Account Indexer wraps the data in result along with errno & errmsg, here we unwrap it.
   * @param method
   * @param params
   */
  request<T=any> (method: string, params?): Promise<T> {
    return this.rpc.request<AccountIndexerResult<T>>(method, params).then(result => result.data)
  }

  serverInfo (): Promise<DasServerInfo> {
    return this.request('das_serverInfo')
  }

  accountInfo (account: string): Promise<BitAccountInfo> {
    return this.request('das_accountInfo', [{
      account,
    }])
  }

  accountInfoById (accountId: string): Promise<BitAccountInfo> {
    return this.request('das_accountInfo', [{
      account_id: accountId,
    }])
  }

  accountRecords (account: string): Promise<BitAccountRecord[]> {
    return this.request<DasAccountRecords>('das_accountRecords', [{
      account,
    }]).then(result => result.records)
  }

  reverseRecord (keyInfo: KeyInfo): Promise<{ account: string }> {
    return this.request('das_reverseRecord', [{
      type: 'blockchain',
      key_info: keyInfo,
    }])
  }

  /**
   * Get all accounts whose owner is given key.
   * @param keyInfo
   * @param role
   */
  accountList (keyInfo: KeyInfo, role: 'manager' | 'owner' = 'owner'): Promise<string[]> {
    return this.request<BitAccountList>('das_accountList', [{
      type: 'blockchain',
      key_info: keyInfo,
      role,
    }])
      .then(result => result.account_list.map(item => item.account))
  }
}
