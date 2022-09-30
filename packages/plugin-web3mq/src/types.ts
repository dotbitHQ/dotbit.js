import { DotBit, BitAccount } from 'dotbit';
import { Client, PageParams } from 'web3-mq';

declare module 'dotbit/DotBit' {
  interface DotBit {
    web3Mq: Client | null;
    sendMessageToUser: (message: string, userId: string) => void;
    onMessage: (callback: any) => void;
    searchWeb3mqUser: (did: string, didType: DID_TYPE_ENUM) => Promise<any[]>;
    getMessageList: (page: PageParams, userId: string) => Promise<void>;
  }
}

export enum DID_TYPE_ENUM {
  ETH = 'ETH',
  WEB3_MQ = 'web3-mq',
  DOTBIT = 'dotbit',
  ENS = 'ens',
}
