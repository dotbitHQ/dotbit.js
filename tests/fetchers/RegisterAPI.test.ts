import { ChainType, EditRecordAction, EvmChainId } from '../../src/const'
import { RegisterAPI } from '../../src/fetchers/RegisterAPI'

const registerAPI = new RegisterAPI('https://test-register-api.did.id/v1')

describe('editAccountManager', function () {
  // it('work', async function () {
  //   const res = await registerAPI.editAccountManager({
  //     chain_type: ChainType.eth,
  //     evm_chain_id: EvmChainId.ETH_GOERILI,
  //     address: '0x7df93d9f500fd5a9537fee086322a988d4fdcc38',
  //     account: 'imac.bit',
  //     raw_param: {
  //       manager_address: 'TPzZyfAgkqASrKkkxiMWBRoJ6jgt718SCX',
  //       manager_chain_type: ChainType.tron,
  //     }
  //   })
  //
  //   expect(res.sign_list.length).toBe(1)
  // })

  it('should throw error: edit manager permission denied', async function () {
    await expect(registerAPI.editAccountManager({
      chain_type: ChainType.eth,
      evm_chain_id: EvmChainId.ETH_GOERILI,
      address: '0x7df93d9f500fd5a9537fee086322a988d4fdcc38',
      account: 'imac.bit',
      raw_param: {
        manager_address: 'TPzZyfAgkqASrKkkxiMWBRoJ6jgt718SCX',
        manager_chain_type: ChainType.tron,
      }
    })).rejects.toThrow('30011: edit manager permission denied')
  })
})

describe('editAccountOwner', function () {
  // it('work', async function () {
  //   const res = await registerAPI.editAccountOwner({
  //     chain_type: ChainType.eth,
  //     evm_chain_id: EvmChainId.ETH_GOERILI,
  //     address: '0x7df93d9f500fd5a9537fee086322a988d4fdcc38',
  //     account: 'imac.bit',
  //     raw_param: {
  //       receiver_address: 'TPzZyfAgkqASrKkkxiMWBRoJ6jgt718SCX',
  //       receiver_chain_type: ChainType.tron,
  //     }
  //   })
  //
  //   expect(res.sign_list.length).toBe(1)
  // })

  it('should throw: transfer owner permission denied', async function () {
    const promise = registerAPI.editAccountOwner({
      chain_type: ChainType.eth,
      evm_chain_id: EvmChainId.ETH_GOERILI,
      address: '0x7df93d9f500fd5a9537fee086322a988d4fdcc38',
      account: 'imac.bit',
      raw_param: {
        receiver_address: 'TPzZyfAgkqASrKkkxiMWBRoJ6jgt718SCX',
        receiver_chain_type: ChainType.tron,
      }
    })

    await expect(promise).rejects.toThrow('30011: transfer owner permission denied')
  })

  it('should throw error: transfer owner permission denied', async function () {
    await expect(registerAPI.editAccountOwner({
      chain_type: ChainType.eth,
      evm_chain_id: EvmChainId.ETH_GOERILI,
      address: '0x7df93d9f500fd5a9537fee086322a988d4fdcc38',
      account: 'imac.bit',
      raw_param: {
        receiver_address: '0x7df93d9f500fd5a9537fee086322a988d4fdcc38',
        receiver_chain_type: ChainType.eth,
      }
    })).rejects.toThrow('30011: transfer owner permission denied')
  })
})

describe('editAccountRecords', function () {
  it('work', async function () {
    const res = await registerAPI.editAccountRecords({
      chain_type: ChainType.eth,
      evm_chain_id: EvmChainId.ETH_GOERILI,
      address: '0x7df93d9f500fd5a9537fee086322a988d4fdcc38',
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
