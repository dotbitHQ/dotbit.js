import { SetOptional } from 'type-fest'
import { BitAccount } from '../BitAccount'
import { BitAccountRecord } from '../fetchers/BitIndexer.type'

export type BitAccountRecordAddition = SetOptional<BitAccountRecord, 'label' | 'ttl'>
export type BitAccountRecordMatcher = SetOptional<Omit<BitAccountRecord, 'ttl'>, 'key' | 'label' | 'value'>

export class RecordsEditor {
  records: BitAccountRecord[]

  constructor (public initialRecords: BitAccountRecord[], public bitAccount: BitAccount) {
    this.records = initialRecords
  }

  /**
   * Add a record or a list of records to the current records
   * @param records
   */
  add (records: BitAccountRecordAddition | BitAccountRecordAddition[]) {
    if (!Array.isArray(records)) {
      records = [records]
    }

    records = records.map(record => Object.assign({
      ttl: '300',
      label: '',
    }, record))

    this.records = this.records.concat(records as BitAccountRecord[])
    return this
  }

  /**
   * Delete all the record with the key
   * @param recordMatcher
   */
  delete (recordMatcher: BitAccountRecordMatcher) {
    const fields: Array<keyof BitAccountRecordMatcher> = []
    recordMatcher.key && fields.push('key')
    recordMatcher.value && fields.push('value')
    recordMatcher.label && fields.push('label')

    this.records = this.records.filter(record => !fields.every(field => record[field] === recordMatcher[field]))

    return this
  }

  /**
   * Update the all the records with the new record
   * Internally, `change` is done by delete all and add new record
   * @param recordMatcher
   * @param record
   */
  change (recordMatcher: BitAccountRecordMatcher, record: BitAccountRecordAddition | BitAccountRecordAddition[]) {
    this.delete(recordMatcher)
    this.add(record)
    return this
  }

  /**
   * Clear all the records
   */
  empty () {
    this.records = []
  }

  execute () {
    return this.bitAccount.updateRecords(this.records)
  }
}
