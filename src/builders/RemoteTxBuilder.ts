import { KeyInfo } from '../fetchers/BitIndexer.type'
import { RegisterAPI } from '../fetchers/RegisterAPI'
import {
  CreateSubAccountsParams,
  EditSubAccountParams,
  SubAccountAPI,
} from '../fetchers/SubAccountAPI'
import {
  EditAccountManagerParam,
  EditAccountOwnerParam,
  EditAccountRecordsParam,
  PayWithDotbitBalanceParam,
  ReturnTrxHashToServiceParam,
  SignTxListParams,
  SignTxListRes,
  SubmitRegisterAccountOrderParam,
  SubmitRegisterAccountOrderRes,
  SubmitRenewAccountOrderParam,
  SubmitRenewAccountOrderRes
} from '../fetchers/RegisterAPI.type'
import {
  CrossChainAPI,
  CrossChainReturnTrxHashToServiceParam,
  LockAccountParam,
  CrossChainAccountStatusParam,
  CrossChainAccountStatusRes,
  MintNftSignInfoParam,
  MintNftSignInfoRes
} from '../fetchers/CrossChainAPI'

export interface RemoteTxBuilderConfig {
  subAccountUri: string,
  registerUri: string,
  crossChainUri: string,
}

export class RemoteTxBuilder {
  subAccountAPI: SubAccountAPI
  registerAPI: RegisterAPI
  crossChainAPI: CrossChainAPI

  constructor (config: RemoteTxBuilderConfig) {
    this.subAccountAPI = new SubAccountAPI(config.subAccountUri)
    this.registerAPI = new RegisterAPI(config.registerUri)
    this.crossChainAPI = new CrossChainAPI(config.crossChainUri)
  }

  enableSubAccount (account: string, keyInfo: KeyInfo): Promise<SignTxListParams> {
    return this.subAccountAPI.initSubAccount(account, keyInfo)
  }

  mintSubAccounts (params: CreateSubAccountsParams): Promise<SignTxListParams> {
    return this.subAccountAPI.createSubAccounts(params)
  }

  changeManager (params: EditAccountManagerParam) {
    return this.registerAPI.editAccountManager(params)
  }

  changeOwner (params: EditAccountOwnerParam) {
    return this.registerAPI.editAccountOwner(params)
  }

  editRecords (params: EditAccountRecordsParam) {
    return this.registerAPI.editAccountRecords(params)
  }

  editSubAccount (params: EditSubAccountParams) {
    return this.subAccountAPI.editSubAccount(params)
  }

  submitRegisterAccountOrder (params: SubmitRegisterAccountOrderParam): Promise<SubmitRegisterAccountOrderRes> {
    return this.registerAPI.submitRegisterAccountOrder(params)
  }

  submitRenewAccountOrder (params: SubmitRenewAccountOrderParam): Promise<SubmitRenewAccountOrderRes> {
    return this.registerAPI.submitRenewAccountOrder(params)
  }

  payWithDotbitBalance (params: PayWithDotbitBalanceParam): Promise<SignTxListParams> {
    return this.registerAPI.payWithDotbitBalance(params)
  }

  returnTrxHashToService (params: ReturnTrxHashToServiceParam): Promise<void> {
    return this.registerAPI.returnTrxHashToService(params)
  }

  crossChainMintNftSignInfo (params: MintNftSignInfoParam): Promise<MintNftSignInfoRes> {
    return this.crossChainAPI.mintNftSignInfo(params)
  }

  crossChainLockAccount (params: LockAccountParam): Promise<SignTxListParams> {
    return this.crossChainAPI.lockAccount(params)
  }

  crossChainAccountStatus (params: CrossChainAccountStatusParam): Promise<CrossChainAccountStatusRes> {
    return this.crossChainAPI.crossChainAccountStatus(params)
  }

  crossChainReturnTrxHashToService (params: CrossChainReturnTrxHashToServiceParam): Promise<void> {
    return this.crossChainAPI.returnTrxHashToService(params)
  }

  crossChainSendTransaction (params: SignTxListRes): Promise<{ hash: string }> {
    return this.crossChainAPI.sendTransaction(params)
  }
}
