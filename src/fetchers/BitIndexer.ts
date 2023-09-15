import { JSONRPC } from '../tools/JSON-RPC'
import {
  BatchAccountInfo,
  BitAccountInfo,
  BitAccountList,
  BitAccountRecord,
  BitKeyInfo,
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

  /**
   * Verify whether the provided address has associated SubDIDs within the given main account, serving as a gateway for community member participation.
   * @param address
   * @param account
   * @param subAccount
   * @param verifyType default 0 === "owner", 1 === "manager"
   */
  subAccountVerify (address: string, account: string, subAccount?: string, verifyType?: number): Promise<boolean> {
    return this.request('das_subAccountVerify', [{
      address,
      account,
      sub_account: subAccount,
      verify_type: verifyType ? 1 : 0,
    }])
      .then(result => result.is_subdid)
  }

  /**
   * Query the valid alias address using the .bit alias.
   * @param account
   */
  validDotbitAliasAddresses (account: string): Promise<BitKeyInfo[]> {
    return this.request('das_accountReverseAddress', [{ account }])
      .then(result => result.list)
  }

  /**
   * Batch query of account information. Currently, only information about whether the account can be registered is returned. A maximum of 50 accounts can be queried at a time.
   * @param accounts
   */
  batchAccountInfo (accounts: string[]): Promise<BatchAccountInfo[]> {
    return this.request('das_batchRegisterInfo', [{ batch_account: accounts }])
      .then(result => result.list)
  }
}
