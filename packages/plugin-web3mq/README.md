# Getting Started

1. run `yarn` or `yarn install` install node_modules
2. run `yarn build`
3. run `sudo npm link`


# Plugin

## Properties

| name   | type                                                                       | Parameters Description |
| ------ | -------------------------------------------------------------------------- | ---------------------- |
| web3Mq | [Client](https://docs.web3messaging.online/docs/Web3MQ-SDK/JS-SDK/client/) | Web3-MQ Client         |

## Methods

| name              | type     | Parameters Description                                       | response           |
| ----------------- | -------- | ------------------------------------------------------------ | ------------------ |
| searchWeb3mqUser  | function | 1. did: string 2.didType: DID_TYPE_ENUM                      | [{userid: string}] |
| sendMessageToUser | function | 1. msg: string 2. userId: string                             | void               |
| onMessage         | function | callback                                                     | void               |
| getMessageList    | function | 1. pageOption:{page: number, size: number} 2. userid: string | void               |

## Useage

### onMessage()

```ts
import { createInstance, sleep } from "dotbit";
import { BitPluginWeb3MQ, DID_TYPE_ENUM } from "plugin-web3mq";
const plugin = new BitPluginWeb3MQ();
await dotbit.installPlugin(plugin);

dotbit.onMessage(function (event: any) {
    console.log(event);
    if (!dotbit.web3Mq) {
        return false;
    }
    const { messageList, msg_text } = dotbit.web3Mq.message;
    if (event.type === "message.getList") {
        // final message list
        console.log(messageList, "messageList");
    }

    if (event.type === "message.delivered") {
        const list = messageList || [];
        // new sent message
        let newSentMessage = {
            content: msg_text,
            id: list.length + 1,
            senderId: dotbit.web3Mq.keys.userid || "Unnamed",
        };
        // final messag list
        console.log([...list, newSentMessage], "final message list");
    }
});
```

### searchWeb3mqUser()

```ts
import { createInstance, sleep } from "dotbit";
import { BitPluginWeb3MQ, DID_TYPE_ENUM } from "plugin-web3mq";
const plugin = new BitPluginWeb3MQ();
await dotbit.installPlugin(plugin);
const res = await dotbit.searchWeb3mqUser(
  "0xbe29848b6ED4A78A02A06bA490Cf3B561Ab329e3",
  DID_TYPE_ENUM.ETH
);
console.log(res, "res");
```

### sendMessageToUser()

```typescript
import { Client } from "web3-mq";

// 1. You must initialize the SDK, the init function is asynchronous
await Client.init({
  connectUrl: "example url", // The fastURL you saved to local
  app_key: "app_key", // Appkey applied from our team
});
// 2. sign MetaMask get keys
const { PrivateKey, PublicKey } = await Client.register.signMetaMask({
  signContentURI: "https://www.web3mq.com", // your signContent URI
  EthAddress: "your eth address", // *Not required*  your eth address, if not use your MetaMask eth address
});
const keys = { PrivateKey, PublicKey };
// 3. You must ensure that the Client.init initialization is complete and that you have a key pair
const client = Client.getInstance(keys);

console.log(client);
```

### getMessageList()

```typescript
import { createInstance, sleep } from "dotbit";
import { BitPluginWeb3MQ, DID_TYPE_ENUM } from "plugin-web3mq";
const plugin = new BitPluginWeb3MQ();
await dotbit.installPlugin(plugin);

const userId =
  "user:df327dc8c07ab20dba69e504881e82112736529c9751358b15fb5004a70f0c6b";
await dotbit.getMessageList({ page: 1, size: 999 }, userId);
console.log(dotbit.web3Mq?.message.messageList);
```
