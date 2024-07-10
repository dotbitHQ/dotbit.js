import { BitAccountRecord, BitAccountRecordExtended } from '../fetchers/BitIndexer.type'
import GraphemeSplitter from 'grapheme-splitter'
import emojiList from './char_set/emoji_list.json'
import numberList from './char_set/digit_list.json'
import englishList from './char_set/en_list.json'
import turkishList from './char_set/tr_list.json'
import thaiList from './char_set/th_list.json'
import koreanList from './char_set/ko_list.json'
import vietnameseList from './char_set/vi_list.json'
import { ACCOUNT_SUFFIX, CHAR_TYPE, languageToCharType, languages, DigitalEmojiUnifiedMap } from '../const'

/**
 * @description: check if the account is supported by .bit
 * @param account in the format of `[xxx.]xxx.bit`
 */
export function isSupportedAccount (account: string): boolean {
  return /^([^.\s]+\.){1,}bit$/.test(account) && account.split(/.#/).every(v => Boolean(v.length))
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

export function toRecordExtended (record: BitAccountRecord): BitAccountRecordExtended {
  return {
    ...record,
    type: record.key.split('.')[0],
    subtype: record.key.split('.')[1],
  }
}

/**
 * Check if a given account is Second-level DID.
 * Second-level DID is supported.
 * e.g. 111.imac.bit / 222.333.imac.bit
 * @param account
 */
export function isSubAccount (account: string): boolean {
  const subAccountPattern = /^([^.\s]+\.){2,}bit$/
  return subAccountPattern.test(account)
}

/**
 * trim the suffix of the account, e.g. imac.bit -> imac
 * @param account
 */
export function trimAccountSuffix (account: string): string {
  return account.replace(/\.bit$/, '')
}

export interface ICharInfo {
  char_set_name: CHAR_TYPE,
  char: string,
}

/**
 * get char info of the char array with specific language
 * if any char don't belong to the specific language or emoji or number, return null
 * @param charSplit
 * @param language
 */
function getLanguageGraphemes (charSplit: string[], language: string): ICharInfo[] | null {
  const languageToCharList = {
    en: englishList,
    tr: turkishList,
    vi: vietnameseList,
    th: thaiList,
    ko: koreanList
  }
  const charList = languageToCharList[language]
  const charInfos: ICharInfo[] = []
  const charTypes = [CHAR_TYPE.emoji, CHAR_TYPE.number, languageToCharType[language]]

  for (const char of charSplit) {
    let included = false
    for (const [index, list] of [emojiList, numberList, charList].entries()) {
      if (list.includes(char)) {
        charInfos.push({
          char_set_name: charTypes[index],
          char
        })
        included = true
        break
      }
    }
    if (!included) {
      return null
    }
  }
  return charInfos
}

/**
 * get language code(https://i18ns.com/languagecode.html)
 * one of 'en', 'ja', 'ru', 'tr', 'vi', 'th', 'ko', default return 'en'.
 * @param language
 */
function getLanguage (language: string): string {
  for (const languageStr of languages) {
    if (language.startsWith(languageStr)) {
      return language
    }
  }
  return 'en'
}

/**
 * handles the mapping of digital emoji
 * @param str
 */
export function digitalEmojiUnifiedHandle (str: string): string {
  const splitter = new GraphemeSplitter()
  const split = splitter.splitGraphemes(str)
  const list = split.map((item) => {
    return DigitalEmojiUnifiedMap[item] || item
  })
  return list.join('')
}

/**
 * split the account by character set.
 * @param account
 * @param addSuffix
 * @param language e.g. window.navigator.language
 */
export function graphemesAccount (account: string, addSuffix = false, language = 'en'): ICharInfo[] {
  const splitter = new GraphemeSplitter()
  let split = splitter.splitGraphemes(account)
  split = split.map((item) => {
    if (DigitalEmojiUnifiedMap[item]) {
      return DigitalEmojiUnifiedMap[item]
    }
    else {
      return item
    }
  })

  language = getLanguage(language)

  // rules: https://community.d.id/c/knowledge-base-bit/charsets
  let splitArr: ICharInfo[] | null = null
  const languageList = languages.filter(lang => lang !== language)
  languageList.unshift(language)
  for (const languageItem of languageList) {
    splitArr = getLanguageGraphemes(split, languageItem)
    if (splitArr !== null) {
      break
    }
  }

  if (!splitArr) {
    splitArr = split.map((char) => {
      return {
        char_set_name: CHAR_TYPE.unknown,
        char
      }
    })
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

/**
 * Get the account's all graphemes
 * @param account in the form of 'xxx.bit'
 * @returns {Partial<Record<CHAR_TYPE, boolean>>}
 */
export function getAccountCharsetTypes (account: string): Partial<Record<CHAR_TYPE, boolean>> {
  const name = trimAccountSuffix(account)
  const graphemes = graphemesAccount(name)

  const charTypes: Partial<Record<CHAR_TYPE, boolean>> = {}

  graphemes.forEach(grapheme => {
    charTypes[grapheme.char_set_name] = true
  })

  return charTypes
}
