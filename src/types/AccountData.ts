export type AccountRecordType = 'address' | 'profile' | 'dweb' | 'custom'
export enum AccountRecordTypes {
  address = 'address',
  profile = 'profile',
  dweb = 'dweb',
  custom = 'custom',
}

export interface AccountRecordOnChain {
  key: string,
  label: string,
  value: string, // 'abc_xyz123'
  ttl: string, // seconds
}

// add some useful fields
export interface AccountRecord extends Omit<AccountRecordOnChain, 'ttl'> {
  ttl: number
  type: AccountRecordType,
  strippedKey: string,
  avatar: string,
}

export interface AccountData {
  account: string, // abc.bit
  account_id_hex: string, // 0x1234...
  next_account_id_hex: string, // 0x1234...
  create_at_unix: number, // seconds
  expired_at_unix: number, // seconds
  status: number, // 0
  owner_lock_args_hex: string, // '0x1234...'
  owner_address: string,
  owner_address_chain: string,
  manager_lock_args_hex: string, // '0x1234...'
  manager_address: string,
  manager_address_chain: string,
  records: AccountRecord[]
}

export interface AccountDataCell {
  out_point: {
    tx_hash: string,
    index: number
  },
  account_data: AccountData
}
