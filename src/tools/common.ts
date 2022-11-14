import { KeyInfo } from 'dotbit/fetchers/BitIndexer.type'
import { ChainType, CoinType } from 'dotbit/const'
import { formatsByName } from '@ensdomains/address-encoder'
import GraphemeSplitter from 'grapheme-splitter'

export function pad0x (str: string): string {
  return str.startsWith('0x') ? str : `0x${str}`
}

export function remove0x (str: string): string {
  return str.startsWith('0x') ? str.substring(2) : str
}

/**
 * Check if a given address is empty
 * @param address
 */
export function isEmptyAddress (address: string): boolean {
  return !address || address === '0x' || address === '0x0' || address === '0x0000000000000000000000000000000000000000'
}

export function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Returns true if Tron address is valid
 * @param address
 */
export function isTronAddress (address: string): boolean {
  try {
    formatsByName.TRX.decoder(address)
    return true
  }
  catch (err) {
    console.warn(`invalid Tron address: ${address}`)
    return false
  }
}

/**
 * Returns true if ETH address is valid
 * @param address
 */
export function isEthAddress (address: string): boolean {
  try {
    formatsByName.ETH.decoder(address)
    return /^(0x|0X)[0-9a-f]{40}$/i.test(address)
  }
  catch (err) {
    console.warn(`invalid ETH address: ${address}`)
    return false
  }
}

/**
 * Returns true if keyInfo is valid
 * @param keyInfo
 */
export function checkKeyInfo (keyInfo: KeyInfo): boolean {
  let ret
  if (typeof keyInfo.chain_id !== 'undefined') {
    console.warn('chain_id is deprecated, please use coin_type.')
  }
  if ([ChainType.eth, ChainType.bsc, ChainType.polygon].includes(keyInfo.chain_id) || [CoinType.ETH, CoinType.MATIC, CoinType.BSC].includes(keyInfo.coin_type)) {
    if (isEthAddress(keyInfo.key)) {
      ret = true
    }
    else {
      console.warn(`invalid ETH address: ${keyInfo.key}`)
      return false
    }
  }
  else if (keyInfo.chain_id === ChainType.tron || keyInfo.coin_type === CoinType.TRX) {
    if (isTronAddress(keyInfo.key)) {
      return true
    }
    else {
      console.warn(`invalid Tron address: ${keyInfo.key}`)
      return false
    }
  }
  return true
}

/**
 * The visual length of the string
 * @param str
 */
export function stringVisualLength (str: string): number {
  const splitter = new GraphemeSplitter()
  const split = splitter.splitGraphemes(str)
  return split.length
}
