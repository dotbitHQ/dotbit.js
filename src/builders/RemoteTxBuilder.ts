import { KeyInfo } from '../fetchers/BitIndexer.type'
import { RegisterAPI } from '../fetchers/RegisterAPI'
import {
  CreateSubAccountsParams, EditSubAccountParams,
  SubAccountAPI,
  TxsSignedOrUnSigned,
} from '../fetchers/SubAccountAPI'
import {
  EditAccountManagerParam,
  EditAccountOwnerParam,
  EditAccountRecordsParam,
  PayWithDotbitBalanceParam,
  ReturnTrxHashToServiceParam,
  SubmitRegisterAccountOrderParam,
  SubmitRegisterAccountOrderRes, TxsWithMMJsonSignedOrUnSigned
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

  enableSubAccount (account: string, keyInfo: KeyInfo): Promise<TxsSignedOrUnSigned> {
    return this.subAccountAPI.initSubAccount(account, keyInfo)
  }

  mintSubAccounts (params: CreateSubAccountsParams): Promise<TxsSignedOrUnSigned> {
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

  payWithDotbitBalance (params: PayWithDotbitBalanceParam): Promise<TxsWithMMJsonSignedOrUnSigned> {
    return this.registerAPI.payWithDotbitBalance(params)
  }

  returnTrxHashToService (params: ReturnTrxHashToServiceParam): Promise<void> {
    return this.registerAPI.returnTrxHashToService(params)
  }
}
