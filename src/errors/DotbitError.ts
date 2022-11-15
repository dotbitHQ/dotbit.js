// https://github.com/dotbitHQ/das-account-indexer/blob/main/http_server/code/code.go
export enum BitIndexerErrorCode {
  Error500 = 500,
  ParamsInvalid = 10000,
  MethodNotExist = 10001,
  DbError = 10002,
  AccountFormatInvalid = 20006,
  AccountNotExist = 20007,
}

export enum BitSubAccountErrorCode {
  AccountIsRegistered = 1001,
  TooManySubAccountsCount = 10000,
  PermissionDenied = 30011,
  TaskInProgress = 40008,
}

export enum BitErrorCode {
  UnsupportedEVMChainId = 1000,
  SubAccountStatusInvalid,
  SubAccountDoNotSupportSubAccount,
  SignerRequired,
  BitBuilderRequired,
  InvalidAccountId,
}

export class DotbitError extends Error {
  constructor (message: string, public code: number) {
    super(code ? `${code}: ${message}` : message)
  }
}

/**
 * @deprecated Please use @DotbitError instead of CodedError
 */
export const CodedError = DotbitError
