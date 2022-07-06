import { CoinType } from '../../src/const'
import { SubAccountAPI } from '../../src/fetchers/SubAccountAPI'

const subAccountApi = new SubAccountAPI('https://test-subaccount-api.did.id/v1')

describe('initSubAccount', function () {
  it('work', async function () {
    const tx = await subAccountApi.initSubAccount('imac.bit', {
      coin_type: String(CoinType.ETH),
      key: '0x1d643fac9a463c9d544506006a6348c234da485f',
    })

    expect(tx.action).toBe('enable_sub_account')
    expect(tx.list.length).toBe(1)
    expect(tx.list[0].sign_list.length).toBe(1)
    expect(tx.list[0].sign_list[0].sign_type).toBe(3)
  })
})
