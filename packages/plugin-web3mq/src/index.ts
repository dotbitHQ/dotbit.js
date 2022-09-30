import { BitAccount, BitPluginBase, DotBit } from 'dotbit';
import {Client, PageParams} from 'web3-mq';
import {
  getAddressByDid,
  getUserIdByAddress,
  hasKeys,
  init,
  signMetaMask,
} from './utils';
import { KeyPairsType } from 'web3-mq/dist/types';
import { DID_TYPE_ENUM } from './types';

export class BitPluginWeb3MQ implements BitPluginBase {
  version = '0.0.1';
  name = 'BitPluginWeb3MQ';

  async onInstall(dotbit: DotBit) {
    await init();
    let keys = hasKeys();
    if (!keys) {
      keys = await signMetaMask();
    }
    let client = Client.getInstance(keys as KeyPairsType);
    if (client) {
      dotbit.web3Mq = client;
      dotbit.searchWeb3mqUser = async (
        did: string,
        didType: DID_TYPE_ENUM = DID_TYPE_ENUM.DOTBIT
      )  => {
        switch (didType) {
          case DID_TYPE_ENUM.WEB3_MQ:
            return [{ userid: did }];
          case DID_TYPE_ENUM.ETH:
            return await getUserIdByAddress(client, did);
          case DID_TYPE_ENUM.ENS:
          case DID_TYPE_ENUM.DOTBIT:
            let address = await getAddressByDid(did, didType);
            return await getUserIdByAddress(client, address);
        }
      };
      dotbit.sendMessageToUser = (message: string, userId: string) => {
        return client.message.sendMessage(message, userId);
      };
      dotbit.onMessage = (callback: any) => {
        client.on('message.getList', callback);
        client.on('message.delivered', callback);
      };
      dotbit.getMessageList = async (page:PageParams, userId: string) => {
        return client.message.getMessageList(page, userId);
      };
    }
  }

  onUninstall(dotbit: DotBit) {
    dotbit.web3Mq = null;
  }

  onInitAccount(bitAccount: BitAccount) {
    // init account
  }
}
