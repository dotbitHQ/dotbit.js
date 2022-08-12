import blake2b from 'blake2b'
import { BitAccountRecord, BitAccountRecordExtended } from '../fetchers/BitIndexer.type'
import { pad0x } from './common'
import GraphemeSplitter from 'grapheme-splitter'
import emojiList from './char_set/emoji_list.json'
import numberList from './char_set/digit_list.json'
import englishList from './char_set/en_list.json'
import turkishList from './char_set/tr_list.json'
import thaiList from './char_set/th_list.json'
import koreanList from './char_set/ko_list.json'
import vietnameseList from './char_set/vi_list.json'
import { ACCOUNT_SUFFIX, CHAR_TYPE } from '../const'

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

/**
 * Check if a given account is sub-account.
 * 001.imac.bit vs imac.bit
 * @param account
 */
export function isSubAccount (account: string): boolean {
  return account.split('.').length >= 3
}

export interface ICharInfo {
  char_set_name: number,
  char: string,
}

/**
 * split the account by character set.
 * @param account
 * @param addSuffix
 * @param language e.g. window.navigator.language
 */
export function splitAccount (account: string, addSuffix = false, language = 'en'): ICharInfo[] {
  const splitter = new GraphemeSplitter()
  const split = splitter.splitGraphemes(account)

  const englishSplitArr: ICharInfo[] = split.map((char: string) => {
    let _charType: number = CHAR_TYPE.unknown
    if (emojiList.includes(char)) {
      _charType = CHAR_TYPE.emoji
    }
    else if (numberList.includes(char)) {
      _charType = CHAR_TYPE.number
    }
    else if (englishList.includes(char)) {
      _charType = CHAR_TYPE.english
    }

    return {
      char_set_name: _charType,
      char
    }
  })

  const turkishSplitArr: ICharInfo[] = split.map((char: string) => {
    let _charType: number = CHAR_TYPE.unknown
    if (emojiList.includes(char)) {
      _charType = CHAR_TYPE.emoji
    }
    else if (numberList.includes(char)) {
      _charType = CHAR_TYPE.number
    }
    else if (turkishList.includes(char)) {
      _charType = CHAR_TYPE.turkish
    }

    return {
      char_set_name: _charType,
      char
    }
  })

  const vietnameseSplitArr: ICharInfo[] = split.map((char: string) => {
    let _charType: number = CHAR_TYPE.unknown
    if (emojiList.includes(char)) {
      _charType = CHAR_TYPE.emoji
    }
    else if (numberList.includes(char)) {
      _charType = CHAR_TYPE.number
    }
    else if (vietnameseList.includes(char)) {
      _charType = CHAR_TYPE.vietnamese
    }

    return {
      char_set_name: _charType,
      char
    }
  })

  const thaiSplitArr: ICharInfo[] = split.map((char: string) => {
    let _charType: number = CHAR_TYPE.unknown
    if (emojiList.includes(char)) {
      _charType = CHAR_TYPE.emoji
    }
    else if (numberList.includes(char)) {
      _charType = CHAR_TYPE.number
    }
    else if (thaiList.includes(char)) {
      _charType = CHAR_TYPE.thai
    }

    return {
      char_set_name: _charType,
      char
    }
  })

  const koreanSplitArr: ICharInfo[] = split.map((char: string) => {
    let _charType: number = CHAR_TYPE.unknown
    if (emojiList.includes(char)) {
      _charType = CHAR_TYPE.emoji
    }
    else if (numberList.includes(char)) {
      _charType = CHAR_TYPE.number
    }
    else if (koreanList.includes(char)) {
      _charType = CHAR_TYPE.korean
    }

    return {
      char_set_name: _charType,
      char
    }
  })

  const englishUnknownChar = englishSplitArr.find((item: ICharInfo) => {
    return item.char_set_name === CHAR_TYPE.unknown
  })
  const turkishUnknownChar = turkishSplitArr.find((item: ICharInfo) => {
    return item.char_set_name === CHAR_TYPE.unknown
  })
  const vietnameseUnknownChar = vietnameseSplitArr.find((item: ICharInfo) => {
    return item.char_set_name === CHAR_TYPE.unknown
  })
  const thaiUnknownChar = thaiSplitArr.find((item: ICharInfo) => {
    return item.char_set_name === CHAR_TYPE.unknown
  })
  const koreanUnknownChar = koreanSplitArr.find((item: ICharInfo) => {
    return item.char_set_name === CHAR_TYPE.unknown
  })

  let splitArr = null

  if (!englishUnknownChar) {
    splitArr = englishSplitArr
  }
  else if (!turkishUnknownChar) {
    splitArr = turkishSplitArr
  }
  else if (!vietnameseUnknownChar) {
    splitArr = vietnameseSplitArr
  }
  else if (!thaiUnknownChar) {
    splitArr = thaiSplitArr
  }
  else if (!koreanUnknownChar) {
    splitArr = koreanSplitArr
  }
  else {
    splitArr = split.map((char: string) => {
      return {
        char_set_name: CHAR_TYPE.unknown,
        char
      }
    })
  }

  const unknownChar = splitArr.find((item: ICharInfo) => {
    return item.char_set_name === CHAR_TYPE.unknown
  })

  if (!unknownChar) {
    const charList: { [key: string]: any } = {}
    if (!englishUnknownChar) {
      charList.en = englishSplitArr
    }

    if (!turkishUnknownChar) {
      charList.tr = turkishSplitArr
    }

    if (!vietnameseUnknownChar) {
      charList.vi = vietnameseSplitArr
    }

    if (!thaiUnknownChar) {
      charList.th = thaiSplitArr
    }

    if (!koreanUnknownChar) {
      charList.ko = koreanSplitArr
    }

    if (/^en/i.test(language)) {
      language = 'en'
    }
    else if (/^ja/i.test(language)) {
      language = 'ja'
    }
    else if (/^ru/i.test(language)) {
      language = 'ru'
    }
    else if (/^tr/i.test(language)) {
      language = 'tr'
    }
    else if (/^vi/i.test(language)) {
      language = 'vi'
    }
    else if (/^th/i.test(language)) {
      language = 'th'
    }
    else if (/^ko/i.test(language)) {
      language = 'ko'
    }

    if (charList[language]) {
      splitArr = charList[language]
    }
    else if (charList.en) {
      splitArr = charList.en
    }
  }

  if (addSuffix) {
    ACCOUNT_SUFFIX.split('')
      .forEach((char: string) => {
        splitArr.push({
          char_set_name: CHAR_TYPE.english,
          char
        })
      })
  }

  return splitArr
}
