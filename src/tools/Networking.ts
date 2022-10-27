import { fetch } from 'cross-fetch'
import { CodedError } from './CodedError'

export class Networking {
  constructor (public baseUri: string) {
  }

  throwOnError (res: any) {
    // SubDID api style
    if (res.err_no) {
      throw new CodedError(res.err_msg, res.err_no)
    }
    else {
      return res.data
    }
  }

  get (path: string) {
    return fetch(this.baseUri + '/' + path, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json()).then(this.throwOnError)
  }

  post (path: string, body?: any) {
    return fetch(this.baseUri + '/' + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    }).then(res => res.json()).then(this.throwOnError)
  }
}
