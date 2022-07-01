import fetch from 'cross-fetch'
import { CodedError } from './CodedError'

export class JSONRPC {
  id = 0
  constructor (
    public url: string,
  ) {}

  request<T = any> (method: string, params: any = []): Promise<T> {
    return fetch(this.url, {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: this.id++,
        method,
        params,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw new CodedError(res.error.message, res.error.code)
        }
        if (res.result.errno) {
          throw new CodedError(res.result.errmsg, res.result.errno)
        }

        return res.result
      })
  }
}
