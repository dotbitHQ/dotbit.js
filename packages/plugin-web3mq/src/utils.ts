import {Client} from 'web3-mq';
import {DID_TYPE_ENUM} from './types';
import Web3 from 'web3';
import {createInstance} from 'dotbit';


//@ts-ignore
const web3 = new Web3(window.ethereum);

export const init = async () => {
  const fastUrl = await Client.init({
    connectUrl: localStorage.getItem('FAST_URL'),
    app_key: 'vAUJTFXbBZRkEDRE',
    env: 'dev',
  });
  localStorage.setItem('FAST_URL', fastUrl);
};
export const signMetaMask = async () => {
  const { PrivateKey, PublicKey, userid } = await Client.register.signMetaMask({
    signContentURI: 'https://www.web3mq.com',
  });
  localStorage.setItem('PRIVATE_KEY', PrivateKey);
  localStorage.setItem('PUBLICKEY', PublicKey);
  localStorage.setItem('USERID', userid);
  return { PrivateKey, PublicKey, userid };
};

export const hasKeys = () => {
  const PrivateKey = localStorage.getItem('PRIVATE_KEY') || '';
  const PublicKey = localStorage.getItem('PUBLICKEY') || '';
  const userid = localStorage.getItem('USERID') || '';
  if (PrivateKey && PublicKey && userid) {
    return { PrivateKey, PublicKey, userid };
  }
  return null;
};

export const getAddressByDid = async (did: string, didType: DID_TYPE_ENUM) => {
  if (didType === DID_TYPE_ENUM.DOTBIT) {
    const dotbit = createInstance();
    const data = await dotbit.records(did);
    let ethAddress = data && data.find((item) => item.key === 'address.eth');
    return ethAddress?.value || '';
  }
  
  if (didType === DID_TYPE_ENUM.ENS) {
    const address = await web3.eth.ens.getAddress(did);
    console.log(address, 'address');
    return address;
  }
  return '';
};

export  const getUserIdByAddress = async (client: Client, address: string) => {
  const searchUsersResponse  = await client.user.searchUsers(address);
  console.log(searchUsersResponse, 'searchUsersResponse');
  //@ts-ignore
  if (searchUsersResponse && searchUsersResponse.result) {
    //@ts-ignore
    return searchUsersResponse.result;
  }
  return '';

};
  