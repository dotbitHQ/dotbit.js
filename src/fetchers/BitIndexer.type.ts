import { CoinType, IndexerAccountStatus } from '../const'

export interface DasServerInfo {
  is_latest_block_number: boolean,
  current_block_number: number,
}

export interface OutPoint {
  tx_hash: string,
  index: number,
}

export interface AccountInfo {
  account: string,
  account_alias: string,
  account_id_hex: string,
  next_account_id_hex: string,
  create_at_unix: number,
  expired_at_unix: number,
  status: IndexerAccountStatus,
  das_lock_arg_hex: string,
  owner_algorithm_id: number,
  owner_key: string,
  manager_algorithm_id: number,
  manager_key: string,
  enable_sub_account: 0,
}

export interface BitAccountInfo {
  out_point: OutPoint,
  account_info: AccountInfo,
}

export interface BitAccountRecord {
  key: string,
  value: string,
  label: string,
  ttl: string,
}

export interface BitAccountRecordExtended extends BitAccountRecord{
  type: string,
  subtype: string,
}

export interface BitAccountRecordAddress extends BitAccountRecordExtended {
  coin_type: string,
}

export interface DasAccountRecords {
  account: string,
  records: BitAccountRecord[],
}

export interface KeyInfo {
  'key': string, // address
  'coin_type': CoinType, // 60: ETH, 195: TRX, 9006: BNB, 966: Matic, 3: Doge, 309: CKB
}

export interface BitKeyInfo {
  type: string,
  key_info: KeyInfo,
}

export interface BitAccountListItem {
  account: string,
  display_name: string,
  registered_at: number,
  expired_at: number,
}

export interface BitAccountList {
  account_list: BitAccountListItem[],
}

export interface BatchAccountInfo {
  account: string,
  can_register: boolean,
}
