// https://github.com/dotbitHQ/das-account-indexer/blob/main/http_server/code/code.go
export enum BitIndexerErrorCode {
  Error500 = 500,
  ParamsInvalid = 10000,
  MethodNotExist = 10001,
  DbError = 10002,
  AccountFormatInvalid = 20006,
  AccountNotExist = 20007,
}

export enum BitErrorCode {
  UnsupportedEVMChainId = 1000,
  SubAccountStatusInvalid,
  SignerRequired,
  BitBuilderRequired,
}

export class CodedError extends Error {
  constructor (message: string, public code: number) {
    super(code ? `${code}: ${message}` : message)
  }
}
