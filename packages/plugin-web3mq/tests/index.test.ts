/**
 * @jest-environment jsdom
 */
import 'fake-indexeddb/auto';

import { DotBit } from 'dotbit';
import { TextEncoder } from 'util';
import { dotbitProd } from '../../../tests/common';
import { BitPluginWeb3MQ, DID_TYPE_ENUM } from '../src/index';

global.TextEncoder = TextEncoder;

localStorage.setItem(
  'PRIVATE_KEY',
  '79537c20f1f5850c8c2589b6d03f28f54c42b9f386a4e00297b0f61863759114',
);
localStorage.setItem(
  'PUBLICKEY',
  '987daf2fc1c1b157234ee77d630500c46c5dcd5471dfdae323b56ea83bd20124',
);
localStorage.setItem(
  'USERID',
  'user:3060407ff4244e40d5674f963e47eee2cb26c868a02123f5186c2cec12b7bd1a',
);
localStorage.setItem('FAST_URL', 'https://testnet-ap-singapore-1.web3mq.com');

const PrivateKey: string = localStorage.getItem('PRIVATE_KEY') || '';
const PublicKey: string = localStorage.getItem('PUBLICKEY') || '';
const userid: string = localStorage.getItem('USERID') || '';
const ethAddress: string = '0xCE4Feb770AFa6A2C3b8440E098a2D0483eA16eFD';
const dotbitAddress = '';

const pluginWeb3MQ = new BitPluginWeb3MQ('vAUJTFXbBZRkEDRE');
const dotbit = new DotBit();

const installPlugin = async () => {
  await dotbitProd.installPlugin(pluginWeb3MQ);
};

let message = [];
const handleMessage = (event: any) => {
  const client = dotbit.web3Mq;
  if (!client) {
    console.log('connect client');
    return false;
  }
  const type = event.type;
  const { messageList, msg_text } = client.message;
  if (type === 'message.getList') {
    message = [...messageList];
  }
  if (type === 'message.delivered') {
    const list = messageList || [];
    message = [
      ...list,
      {
        content: msg_text,
        id: list.length + 1,
        senderId: client.keys.userid || 'Unnamed',
      },
    ];
  }
};

beforeAll(async () => {
  await installPlugin();
  dotbitProd.onMessage(handleMessage);
});

describe('not install plugin', () => {
  it('web3mq is not define', () => {
    expect(dotbit.web3Mq).toBeUndefined();
  });
});

describe('dotbit.searchWeb3mqUser', () => {
  test('should work in WEB3_MQ', async () => {
    expect(await dotbitProd.searchWeb3mqUser(userid, DID_TYPE_ENUM.WEB3_MQ)).toEqual([
      {
        userid: userid,
      },
    ]);
  });
  test('should work in ETH', async () => {
    expect(await dotbitProd.searchWeb3mqUser(ethAddress, DID_TYPE_ENUM.ETH)).toEqual({
      avatar_url: '',
      nickname: '',
      userid: userid,
      wallet_address: ethAddress,
      wallet_type: 'eth',
    });
  });
  // test('should work in DOTBIT', async () => {
  //   expect(await dotbitProd.searchWeb3mqUser(dotbitAddress, DID_TYPE_ENUM.DOTBIT)).toEqual({
  //     avatar_url: '',
  //     nickname: '',
  //     userid: userid,
  //     wallet_address: '',
  //     wallet_type: '',
  //   });
  // });
});

// describe('dotbit.getMessageList', () => {
//   test('should work', async () => {
//     await dotbitProd.getMessageList({ page: 1, size: 20 }, userid);
//     expect(message).toEqual([
//       {
//         content: 'hello',
//         id: 1,
//         senderId: userid,
//       },
//     ]);
//   });
// });

// describe('dotbit.sendMessageToUser', () => {
//   test('should work', async () => {
//     await dotbitProd.sendMessageToUser('hello', userid);
//     expect(message).toEqual([
//       {
//         content: 'hello',
//         id: 1,
//         senderId: userid,
//       },
//     ]);
//   });
// });

afterAll(() => {
  dotbitProd.uninstallPlugin(pluginWeb3MQ);
});
