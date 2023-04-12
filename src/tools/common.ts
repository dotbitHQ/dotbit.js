import { KeyInfo } from '../fetchers/BitIndexer.type'
import { ChainType, CoinType, EvmChainId, EvmCoinTypes } from '../const'
import { utils } from 'ethers'
import GraphemeSplitter from 'grapheme-splitter'
import TronWeb from 'tronweb'

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
    return address.length !== 42 && TronWeb.isAddress(address)
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
    return /^(0x|0X)[0-9a-f]{40}$/i.test(address) && utils.isAddress(address)
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
  if ([EvmChainId.ETH, EvmChainId.BSC, EvmChainId.MATIC].includes(Number(keyInfo.chain_id)) || [CoinType.ETH, CoinType.MATIC, CoinType.BSC].includes(keyInfo.coin_type)) {
    if (isEthAddress(keyInfo.key)) {
      ret = true
    }
    else {
      console.warn(`invalid ETH address: ${keyInfo.key}`)
      ret = false
    }
  }
  else if (keyInfo.coin_type === CoinType.TRX) {
    if (isTronAddress(keyInfo.key)) {
      ret = true
    }
    else {
      console.warn(`invalid Tron address: ${keyInfo.key}`)
      ret = false
    }
  }
  return ret
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

/**
 * compute the chainType of the evm chain by coinType.
 * categorize all evm chains as ETH chainType.
 * @param coinType
 */
export function computeChainTypeByCoinType (coinType: CoinType): ChainType {
  let _chainType
  if (EvmCoinTypes.includes(coinType)) {
    _chainType = ChainType.eth
  }
  else if (CoinType.TRX === coinType) {
    _chainType = ChainType.tron
  }
  return _chainType
}

/**
 * matches the protocol header of the DWeb.
 * @param str
 */
export function matchDWebProtocol (str: string) {
  return str.match(/^(ipns|ipfs|sia|arweave|ar|resilio):\/\/(.*)/)
}
