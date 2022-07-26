import blake2b from 'blake2b'
import { BitAccountRecord, BitAccountRecordExtended } from '../fetchers/BitIndexer.type'
import { pad0x } from './common'

export function isSupportedAccount (account: string): boolean {
  return /.+\.bit/.test(account) && account.split(/.#/).every(v => Boolean(v.length))
}

/**
 * Transform hash-style account to dot-style account
 * @param inputAccount
 */
export function toDottedStyle (inputAccount: string) {
  if (!isSupportedAccount(inputAccount)) {
    return inputAccount
  }

  if (!inputAccount.includes('#')) {
    return inputAccount
  }

  const [account, suffix] = inputAccount.split('.')
  const [main, sub] = account.split('#')

  return `${sub}.${main}.${suffix}`
}

/**
 * Transform dot-style account to hash-style account imac#001.bit
 * @Deprecated We currently not support this style
 * @param inputAccount
 */
export function toHashedStyle (inputAccount: string) {
  if (!isSupportedAccount(inputAccount)) {
    return inputAccount
  }

  if (inputAccount.includes('#')) {
    return inputAccount
  }

  const parts = inputAccount.split('.')

  if (parts.length === 3) {
    const [sub, main, suffix] = parts

    return `${main}#${sub}.${suffix}`
  }

  return inputAccount
}

/**
 * generate dotbit accountId
 * @param account
 */
export function accountIdHex (account: string): string {
  const personal = Buffer.from('ckb-default-hash')
  const accountBuf = Buffer.from(account)
  const hasher = blake2b(32, null, null, personal)
  hasher.update(accountBuf)
  const hashBuffer = hasher.digest('binary') as Uint8Array
  const first20Bytes = Buffer.from(hashBuffer.slice(0, 20))
  return pad0x(first20Bytes.toString('hex'))
}

export function toRecordExtended (record: BitAccountRecord): BitAccountRecordExtended {
  return {
    ...record,
    type: record.key.split('.')[0],
    subtype: record.key.split('.')[1],
  }
}
