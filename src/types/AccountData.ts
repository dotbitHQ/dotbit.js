export type AccountRecordType = 'address' | 'profile' | 'dweb' | 'custom'
export enum AccountRecordTypes {
  address = 'address',
  profile = 'profile',
  dweb = 'dweb',
  custom = 'custom',
}

export interface AccountRecord {
  key: string,
  strippedKey: string,
  type: AccountRecordType,
  label: string,
  value: string, // 'abc_xyz123'
  ttl: number, // seconds
}

export interface AccountData {
  account: string, // abc.bit
  account_id_hex: string, // 0x1234...
  next_account_id_hex: string, // 0x1234...
  create_at_unix: number, // seconds
  expired_at_unix: number, // seconds
  status: number, // 0
  owner_lock_args_hex: string, // '0x1234...'
  manager_lock_args_hex: string, // '0x1234...'
  records: AccountRecord[]
}

export interface AccountDataCell {
  out_point: {
    tx_hash: string,
    index: number
  },
  account_data: AccountData
}
