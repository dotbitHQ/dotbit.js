import { Client } from 'web3-mq'
import { DotBit } from 'dotbit'
import { QuickNodeProvider } from 'ethers'
import { DID_TYPE_ENUM } from './types'

const provider = new QuickNodeProvider()

export const init = async (appKey: string) => {
  const fastUrl = await Client.init({
    connectUrl: localStorage.getItem('FAST_URL'),
    app_key: appKey,
  })
  localStorage.setItem('FAST_URL', fastUrl)
}

export const hasKeys = () => {
  const PrivateKey = localStorage.getItem('PRIVATE_KEY') ?? ''
  const PublicKey = localStorage.getItem('PUBLICKEY') ?? ''
  const userid = localStorage.getItem('USERID') ?? ''
  if (PrivateKey && PublicKey && userid) {
    return { PrivateKey, PublicKey, userid }
  }
  return null
}

export const signMetaMask = async () => {
  // @ts-expect-error
  const { PrivateKey, PublicKey, userid } = await Client.register.signMetaMask({
    signContentURI: 'https://www.web3mq.com',
  })
  localStorage.setItem('PRIVATE_KEY', PrivateKey)
  localStorage.setItem('PUBLICKEY', PublicKey)
  localStorage.setItem('USERID', userid)
  return { PrivateKey, PublicKey, userid }
}

export const getUserIdByAddress = async (client: Client, address: string) => {
  const searchUsersResponse = await client.user.searchUsers(address)
  console.log(searchUsersResponse, 'searchUsersResponse')
  return searchUsersResponse || ''
}

export const getAddressByDid = async (
  dotbit: DotBit,
  did: string,
  didType: DID_TYPE_ENUM
) => {
  if (didType === DID_TYPE_ENUM.DOTBIT) {
    const data = await dotbit.records(did)
    const ethAddress = data?.find((item) => item.key === 'address.eth')
    return ethAddress?.value ?? ''
  }

  if (didType === DID_TYPE_ENUM.ENS) {
    const address = await provider.resolveName(did)
    console.log(address, 'address')
    return address
  }
  return ''
}
