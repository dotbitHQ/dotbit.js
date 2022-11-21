import { DotBit, BitAccount } from 'dotbit';
import { Client, PageParams } from 'web3-mq';

declare module 'dotbit/DotBit' {
    export interface DotBit {
        web3Mq: Client | null;
        sendMessageToUser: (message: string, userId: string) => void;
        onMessage: (callback: any) => void;
        searchWeb3mqUser: (did: string, didType: DID_TYPE_ENUM) => Promise<any[]>;
        getMessageList: (page: PageParams, userId: string) => Promise<void>;
    }
}

//@ts-ignore
declare module 'dotbit/BitAccount' {
    export interface BitAccount {
        web3Mq: any;
        funcWeb3MQ: () => void;
    }
}

export enum DID_TYPE_ENUM {
    ETH = 'ETH',
    WEB3_MQ = 'web3-mq',
    DOTBIT = 'dotbit',
    ENS = 'ens',
}
