import { CoinType } from '../../src/const'
import { SubAccountAPI } from '../../src/fetchers/SubAccountAPI'

const subAccountApi = new SubAccountAPI('https://test-subaccount-api.did.id/v1')

describe('initSubAccount', function () {
  // it('work', async function () {
  //   const tx = await subAccountApi.initSubAccount('imac.bit', {
  //     coin_type: CoinType.ETH,
  //     key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
  //   })
  //
  //   expect(tx.action).toBe('enable_sub_account')
  //   expect(tx.list.length).toBe(1)
  //   expect(tx.list[0].sign_list.length).toBe(1)
  //   expect(tx.list[0].sign_list[0].sign_type).toBe(3)
  // })

  it('should throw error', async function () {
    return await expect(subAccountApi.initSubAccount('imac.bit', {
      coin_type: CoinType.ETH,
      key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
    })
    ).rejects.toThrow('40000: sub account already initialized')
  })
})

describe('subAccountList', function () {
  it('work', async function () {
    const res = await subAccountApi.subAccountList({
      account: 'imac.bit',
      page: 1,
      size: 10,
      keyword: '',
    })

    expect(res.list.length).toBeGreaterThan(1)
  })

  it('with keyword', async function () {
    const res = await subAccountApi.subAccountList({
      account: 'imac.bit',
      page: 1,
      size: 10,
      keyword: '001'
    })

    expect(res.list.length).toBeGreaterThanOrEqual(10)
  })
})

describe('editSubAccount', function () {
  // it('should work', async function () {
  //   const res = await subAccountApi.editSubAccount({
  //     account: '001.imac.bit',
  //     type: 'blockchain',
  //     key_info: {
  //       key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
  //       coin_type: CoinType.ETH,
  //     },
  //     edit_key: 'manager',
  //     edit_value: {
  //       manager: {
  //         type: 'blockchain',
  //         key_info: {
  //           key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
  //           coin_type: CoinType.ETH,
  //         }
  //       }
  //     }
  //   })
  //
  //   expect(res.list[0].sign_list.length).toBe(1)
  // })

  it('should throw: 30023: same address', function () {
    const promise = subAccountApi.editSubAccount({
      account: '001.imac.bit',
      type: 'blockchain',
      key_info: {
        key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
        coin_type: CoinType.ETH,
      },
      edit_key: 'manager',
      edit_value: {
        manager: {
          type: 'blockchain',
          key_info: {
            key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
            coin_type: CoinType.ETH,
          }
        }
      }
    })
    return expect(promise).rejects.toThrow('30023: same address')
  })
})
