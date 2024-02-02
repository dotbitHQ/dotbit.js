import { CoinType } from '../../src/const'
import { BitIndexer } from '../../src/fetchers/BitIndexer'

const indexer = new BitIndexer({
  uri: 'https://indexer-v1.did.id'
})

describe('serverInfo', () => {
  it('work', async () => {
    const info = await indexer.serverInfo()

    expect(info.current_block_number).toBeGreaterThan(10000)
  }, 10000)
})

describe('accountInfo', () => {
  it('work', async () => {
    const info = await indexer.accountInfo('imac.bit')

    expect(info.account_info.account).toBe('imac.bit')
    expect(info.account_info.account_id_hex).toBe('0x5728088435fb8788472a9ca601fbc0b9cbea8be3')
  })

  it('error: account not exist', () => {
    const request = indexer.accountInfo('this-account-does-not-exist.bit')
    return expect(request).rejects.toThrow('account not exist')
  })

  it('error: account invalid', () => {
    const request = indexer.accountInfo('this_is_invalid_account.bit')
    return expect(request).rejects.toThrow('account invalid')
  })
})

describe('accountInfoById', () => {
  it('work', async () => {
    const info = await indexer.accountInfoById('0x5728088435fb8788472a9ca601fbc0b9cbea8be3')

    expect(info.account_info.account).toBe('imac.bit')
    expect(info.account_info.account_id_hex).toBe('0x5728088435fb8788472a9ca601fbc0b9cbea8be3')
  })

  it('error: account not exist', () => {
    const request = indexer.accountInfoById('0x0000000000000000000000000000000000000001')
    return expect(request).rejects.toThrow('account not exist')
  })
})

describe('accountRecords', () => {
  it('work', async () => {
    const records = await indexer.accountRecords('imac.bit')

    expect(records.length).toBeGreaterThan(0)
    expect(records.find(record => record.key === 'address.eth')).toBeDefined()
  })

  it('error: account not exist', () => {
    const request = indexer.accountRecords('this-account-does-not-exist.bit')
    return expect(request).rejects.toThrow('account not exist')
  })
})

describe('reverseRecord', () => {
  it('work', async () => {
    const { account } = await indexer.reverseRecord({
      coin_type: CoinType.ETH, // 60: ETH, 195: TRX, 9006: BNB, 966: Matic, 3: Doge, 309: CKB
      key: '0x1D643FAc9a463c9d544506006a6348c234dA485f' // address
    })

    expect(account).toBe('jeffx.bit')
  })

  it('should be empty', async () => {
    const { account } = await indexer.reverseRecord({
      coin_type: CoinType.ETH,
      key: '0x0000000000000000000000000000000000000001' // address
    })
    expect(account).toBe('')
  })
})

describe('accountList', () => {
  it('work', async () => {
    const accounts = await indexer.accountList({
      coin_type: CoinType.ETH, // 60: ETH, 195: TRX, 9006: BNB, 966: Matic, 3: Doge, 309: CKB
      key: '0x1D643FAc9a463c9d544506006a6348c234dA485f' // address
    })
    expect(accounts.length).toBeGreaterThanOrEqual(27)
  })

  it('work for TRON', async () => {
    const accounts = await indexer.accountList({
      coin_type: CoinType.TRX, // 60: ETH, 195: TRX, 9006: BNB, 966: Matic, 3: Doge, 309: CKB
      key: 'TPzZyfAgkqASrKkkxiMWBRoJ6jgt718SCX' // address
    })
    expect(accounts.length).toBeGreaterThanOrEqual(5)
  })

  it('should be empty', async () => {
    const accounts = await indexer.accountList({
      coin_type: CoinType.ETH,
      key: '0x0000000000000000000000000000000000000001' // address
    })
    expect(accounts.length).toBe(0)
  })

  it('work when the role is "manager"', async () => {
    const accounts = await indexer.accountList({
      coin_type: CoinType.ETH, // 60: ETH, 195: TRX, 9006: BNB, 966: Matic, 3: Doge, 309: CKB
      key: '0x1D643FAc9a463c9d544506006a6348c234dA485f' // address
    }, 'manager')
    expect(accounts.length).toBeGreaterThanOrEqual(10)
  })
})
