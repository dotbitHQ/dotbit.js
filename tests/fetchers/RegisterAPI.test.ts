import { CoinType, EvmChainId } from '../../src/const'
import { RegisterAPI } from '../../src/fetchers/RegisterAPI'

const registerAPI = new RegisterAPI('https://test-register-api.d.id/v1')

describe('editAccountManager', function () {
  it('work', async function () {
    const res = await registerAPI.editAccountManager({
      keyInfo: {
        coin_type: CoinType.ETH,
        key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38'
      },
      evm_chain_id: EvmChainId.ETH_HOLESKY,
      account: 'imac.bit',
      raw_param: {
        manager_address: 'TPzZyfAgkqASrKkkxiMWBRoJ6jgt718SCX',
        manager_coin_type: CoinType.TRX,
      }
    })

    expect(res.sign_list.length).toBe(1)
  })

  it('should throw error: edit manager permission denied', async function () {
    await expect(registerAPI.editAccountManager({
      keyInfo: {
        coin_type: CoinType.ETH,
        key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38'
      },
      evm_chain_id: EvmChainId.ETH_HOLESKY,
      account: 'imac.bit',
      raw_param: {
        manager_address: 'TPzZyfAgkqASrKkkxiMWBRoJ6jgt718SCX',
        manager_coin_type: CoinType.TRX,
      }
    })).rejects.toThrow('30011: edit manager permission denied')
  })
})

describe('editAccountOwner', function () {
  it('work', async function () {
    const res = await registerAPI.editAccountOwner({
      keyInfo: {
        coin_type: CoinType.ETH,
        key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38'
      },
      evm_chain_id: EvmChainId.ETH_HOLESKY,
      account: 'imac.bit',
      raw_param: {
        receiver_address: 'TPzZyfAgkqASrKkkxiMWBRoJ6jgt718SCX',
        receiver_coin_type: CoinType.TRX,
      }
    })

    expect(res.sign_list.length).toBe(1)
  })

  it('should throw: transfer owner permission denied', async function () {
    const promise = registerAPI.editAccountOwner({
      keyInfo: {
        coin_type: CoinType.ETH,
        key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38'
      },
      evm_chain_id: EvmChainId.ETH_HOLESKY,
      account: 'imac.bit',
      raw_param: {
        receiver_address: 'TPzZyfAgkqASrKkkxiMWBRoJ6jgt718SCX',
        receiver_coin_type: CoinType.TRX,
      }
    })

    await expect(promise).rejects.toThrow('30011: transfer owner permission denied')
  })

  it('should throw error: transfer owner permission denied', async function () {
    await expect(registerAPI.editAccountOwner({
      keyInfo: {
        coin_type: CoinType.ETH,
        key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38'
      },
      evm_chain_id: EvmChainId.ETH_HOLESKY,
      account: 'imac.bit',
      raw_param: {
        receiver_address: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38',
        receiver_coin_type: CoinType.ETH,
      }
    })).rejects.toThrow('30011: transfer owner permission denied')
  })
})

describe('editAccountRecords', function () {
  it('work', async function () {
    const res = await registerAPI.editAccountRecords({
      keyInfo: {
        coin_type: CoinType.ETH,
        key: '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38'
      },
      evm_chain_id: EvmChainId.ETH_HOLESKY,
      account: 'imac.bit',
      raw_param: {
        records: [
          {
            type: 'profile',
            key: 'twitter',
            label: '',
            value: 'apple',
            ttl: '300',
          },
        ]
      }
    })

    expect(res.sign_list.length).toBe(1)
  }, 10000)
})
