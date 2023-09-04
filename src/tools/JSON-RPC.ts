import fetch from 'cross-fetch'
import { DotbitError } from '../errors/DotbitError'

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
          throw new DotbitError(res.error.message, res.error.code)
        }
        if (res.result.errno) {
          throw new DotbitError(res.result.errmsg, res.result.errno)
        }
        if (res.result.err_msg) {
          throw new DotbitError(res.result.err_msg, res.result.err_no)
        }

        return res.result
      })
  }
}
