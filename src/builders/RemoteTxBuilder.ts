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
  SubmitRegisterAccountOrderParam,
  SubmitRegisterAccountOrderRes,
  SubmitRenewAccountOrderParam,
  SubmitRenewAccountOrderRes
} from '../fetchers/RegisterAPI.type'

export interface RemoteTxBuilderConfig {
  subAccountUri: string,
  registerUri: string,
}

export class RemoteTxBuilder {
  subAccountAPI: SubAccountAPI
  registerAPI: RegisterAPI

  constructor (config: RemoteTxBuilderConfig) {
    this.subAccountAPI = new SubAccountAPI(config.subAccountUri)
    this.registerAPI = new RegisterAPI(config.registerUri)
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
}
