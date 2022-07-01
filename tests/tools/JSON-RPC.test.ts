import { JSONRPC } from '../../src/tools/JSON-RPC'

const jsonrpc = new JSONRPC('https://indexer-v1.did.id')

describe('request', function () {
  it('works', async function () {
    const res = await jsonrpc.request('das_accountInfo', [{
      account: 'imac.bit',
    }])

    expect(res.data.account_info.account).toBe('imac.bit')
  })

  it('param error', function () {
    const request = jsonrpc.request('das_accountInfo', {
      account: 'imac.bit',
    })

    return expect(request).rejects.toThrow('params invalid')
  }, 10 * 1000)
})
