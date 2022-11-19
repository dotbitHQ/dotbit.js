import { BitAccount, BitPluginBase, DotBit } from 'dotbit';
import { Client, KeyPairsType, PageParams } from 'web3-mq';

import { init, hasKeys, signMetaMask, getUserIdByAddress, getAddressByDid } from './utils';

import { DID_TYPE_ENUM } from './types';

export class BitPluginWeb3MQ implements BitPluginBase {
  version = '0.0.1';
  name = 'BitPluginWeb3MQ';
  appKey = '';

  constructor(appkey: string) {
    this.appKey = appkey;
  }

  async onInstall(dotbit: DotBit) {
    await init(this.appKey);
    let keys = hasKeys();
    if (!keys) {
      keys = await signMetaMask();
    }
    let client = Client.getInstance(keys as KeyPairsType);
    if (client) {
      dotbit.web3Mq = client;
      dotbit.searchWeb3mqUser = async (
        did: string,
        didType: DID_TYPE_ENUM = DID_TYPE_ENUM.DOTBIT,
      ) => {
        switch (didType) {
          case DID_TYPE_ENUM.WEB3_MQ:
            return [{ userid: did }];
          case DID_TYPE_ENUM.ETH:
            return await getUserIdByAddress(client, did);
          case DID_TYPE_ENUM.ENS:
          case DID_TYPE_ENUM.DOTBIT:
            let address = await getAddressByDid(dotbit, did, didType);
            return await getUserIdByAddress(client, address);
        }
      };
      dotbit.sendMessageToUser = async (message: string, userId: string) => {
        return client.message.sendMessage(message, userId);
      };
      dotbit.onMessage = (callback: any) => {
        client.on('message.getList', callback);
        client.on('message.delivered', callback);
      };
      dotbit.getMessageList = async (page: PageParams, userId: string) => {
        return client.message.getMessageList(page, userId);
      };
    }
  }

  onUninstall(dotbit: DotBit) {
    dotbit.web3Mq = null;
  }

  onInitAccount(bitAccount: BitAccount) {
    console.log('This function will be invoked when .bit account initialized');
    //@ts-ignore
    bitAccount.funcWeb3MQ = () => {
      console.log('funcWeb3MQ');
    };
  }
}

export * from './types';
