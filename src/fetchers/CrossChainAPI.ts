import { Networking } from '../tools/Networking'
import { BitKeyInfo, KeyInfo } from './BitIndexer.type'
import { CrossChainDirection, CrossChainAccountStatus } from '../const'
import { SignTxListParams, SignTxListRes } from './RegisterAPI.type'

export interface LockAccountParam {
  key_info: KeyInfo,
  account: string,
}

export interface CrossChainAccountStatusParam extends LockAccountParam {}

export interface CrossChainAccountStatusRes {
  account: string,
  lock_hash: string,
  mint_hash: string,
  status: CrossChainAccountStatus,
}

export interface MintNftSignInfoParam {
  key_info: KeyInfo,
  account: string,
}

export interface MintNftSignInfoRes {
  account: string,
  data: string,
  gnosis_signatures: any[],
}

export interface CrossChainReturnTrxHashToServiceParam extends LockAccountParam {
  txHash: string,
  direction: CrossChainDirection,
}

export interface AccountsInCrossChainingParam extends BitKeyInfo {
  page: number,
  size: number,
}

export interface AccountsInCrossChaining {
  account: string,
  cross_direction: CrossChainDirection,
  recycle_hash: string,
}

export interface AccountsInCrossChainingRes {
  total: number,
  list: AccountsInCrossChaining,
}

export interface EthNftsParam extends AccountsInCrossChainingParam {
  keyword?: string,
}

export interface EthNft {
  coin_type: string,
  account: string,
  uuid: string,
  expire_at: number,
}

export interface EthNftsRes {
  total: number,
  list: EthNft[],
}

export class CrossChainAPI {
  net: Networking

  constructor (public baseUri: string) {
    this.net = new Networking(baseUri)
  }

  lockAccount (params: LockAccountParam): Promise<SignTxListParams> {
    return this.net.post('lock/account', {
      type: 'blockchain',
      account: params.account,
      key_info: params.key_info,
    })
  }

  crossChainAccountStatus (params: CrossChainAccountStatusParam): Promise<CrossChainAccountStatusRes> {
    return this.net.post('lock/mint/status', {
      type: 'blockchain',
      account: params.account,
      key_info: params.key_info,
    })
  }

  mintNftSignInfo (params: MintNftSignInfoParam): Promise<MintNftSignInfoRes> {
    return this.net.post('mint/sign/info', {
      type: 'blockchain',
      account: params.account,
      key_info: params.key_info,
    })
  }

  /**
   * Return the transaction hash to the backend service.
   * @param params
   */
  returnTrxHashToService (params: CrossChainReturnTrxHashToServiceParam): Promise<void> {
    return this.net.post('pending/hash', {
      type: 'blockchain',
      account: params.account,
      key_info: params.key_info,
      hash: params.txHash,
      direction: params.direction
    })
  }

  accountsInCrossChaining (params: AccountsInCrossChainingParam): Promise<AccountsInCrossChainingRes> {
    return this.net.post('direction/list', {
      type: 'blockchain',
      key_info: params.key_info,
      page: params.page,
      size: params.size
    })
  }

  ethNfts (params: EthNftsParam): Promise<EthNftsRes> {
    return this.net.post('did/nft/list', {
      type: 'blockchain',
      key_info: params.key_info,
      keyword: params.keyword,
      page: params.page,
      size: params.size
    })
  }

  sendTransaction (params: SignTxListRes): Promise<{ hash: string }> {
    return this.net.post('transaction/send', params)
  }
}
