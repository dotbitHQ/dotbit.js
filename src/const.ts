export enum BitNetwork {
  mainnet = 'mainnet',
  testnet = 'testnet',
}

export enum CoinType {
  ETH = '60',
  TRX = '195',
  CKB = '309',
  MATIC = '966',
  BNB = '9006',
}

export enum EvmChainId {
  ETH = 1,
  ETH_GOERILI = 5,
  BNB = 56,
  MATIC = 137,
}

export const EvmChainId2CoinType = {
  [EvmChainId.ETH]: CoinType.ETH,
  [EvmChainId.ETH_GOERILI]: CoinType.ETH,
  [EvmChainId.BNB]: CoinType.BNB,
  [EvmChainId.MATIC]: CoinType.MATIC,
}

export enum RecordType {
  address = 'address',
  profile = 'profile',
  dweb = 'dweb',
  custom = 'custom',
}

export enum AccountStatus {
  noneExist,
}

export enum AlgorithmId {
  ethPersonalSign = 3,
  tronSign = 4,
  EIP712 = 5,
  ed2519 = 6,
}

export enum SubAccountEnabledStatus {
  unknown = -1,
  off,
  on
}

export enum CheckSubAccountStatus {
  ok,
  fail,
  registered,
  registering
}
