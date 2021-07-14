export type AccountRecordType = 'address' | 'profile' | 'custome'

export interface AccountRecord {
  key: string,
  type:AccountRecordType,
  label: string,
  value: string, // 'abc_xyz123'
  ttl: string, // '300'
}

export interface AccountData {
  out_point: {
    tx_hash: string,
    index: number
  },
  account_data: {
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
}
