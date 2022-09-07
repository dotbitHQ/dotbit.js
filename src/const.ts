export enum BitNetwork {
  mainnet = 'mainnet',
  testnet = 'testnet',
}

export enum CoinType {
  ETH = '60',
  TRX = '195',
  CKB = '309',
  MATIC = '966',
  BSC = '9006',
}

export enum EvmChainId {
  ETH = 1,
  ETH_GOERILI = 5,
  BSC = 56,
  MATIC = 137,
}

// legacy custom chain type, should be replaced by CoinType in the future
export enum ChainType {
  ckb,
  eth,
  btc,
  tron,
  fiat,
  bsc = 56,
  polygon = 137
}

export const EvmChainId2CoinType = {
  [EvmChainId.ETH]: CoinType.ETH,
  [EvmChainId.ETH_GOERILI]: CoinType.ETH,
  [EvmChainId.BSC]: CoinType.BSC,
  [EvmChainId.MATIC]: CoinType.MATIC,
}

export const CoinType2EvmChainId = {
  [CoinType.ETH]: EvmChainId.ETH,
  [CoinType.MATIC]: EvmChainId.MATIC,
  [CoinType.BSC]: EvmChainId.BSC,
}

export const CoinType2ChainType = {
  [CoinType.ETH]: ChainType.eth,
  [CoinType.TRX]: ChainType.tron,
  [CoinType.CKB]: ChainType.ckb,
  [CoinType.MATIC]: ChainType.polygon,
  [CoinType.BSC]: ChainType.bsc,
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
  eip712 = 5,
  ed2519 = 6,
}

export const AlgorithmId2CoinType = {
  [AlgorithmId.ethPersonalSign]: CoinType.ETH,
  [AlgorithmId.eip712]: CoinType.ETH,
  [AlgorithmId.tronSign]: CoinType.TRX,
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

export enum EditRecordAction {
  delete = 'delete',
  change = 'change',
  add = 'add',
}

export const ACCOUNT_SUFFIX = '.bit'

// source: https://github.com/dotbitHQ/das-types/blob/master/rust/src/constants.rs#L145
export enum CHAR_TYPE {
  emoji = 0,
  number = 1,
  english = 2,
  simplifiedChinese = 3,
  traditionalChinese,
  japanese,
  korean,
  russian,
  turkish,
  thai,
  vietnamese,
  unknown = 99
}

export const languageToCharType = {
  en: CHAR_TYPE.english,
  tr: CHAR_TYPE.turkish,
  vi: CHAR_TYPE.vietnamese,
  th: CHAR_TYPE.thai,
  ko: CHAR_TYPE.korean
}

export const languages = ['en', 'tr', 'vi', 'th', 'ko']
