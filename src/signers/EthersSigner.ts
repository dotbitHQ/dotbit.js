export class EthersSigner {
  constructor (public provider) {
    this.provider = provider
  }

  getSigner () {
    return this.provider.getSigner()
  }

  getProvider () {
    return this.provider
  }

  getBalance (address) {
    return this.provider.getBalance(address)
  }

  signData () {
    return this.provider.signData()
  }
}
