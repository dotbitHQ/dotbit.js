import { signTypedData, SignTypedDataVersion, TypedDataUtils } from '@metamask/eth-sig-util'
import { Wallet } from 'ethers'
import { TxsWithMMJsonSignedOrUnSigned } from '../../src/fetchers/RegisterAPI.type'
import { EthersSigner, TxsSignedOrUnSigned } from '../../src/index'

const address = '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38'
const privateKey1 = '87d8a2bccdfc9984295748fa2058136c8131335f59930933e9d4b3e74d4fca42'
const wallet = new Wallet(privateKey1)
const signer = new EthersSigner(wallet)

const typedDataFromMetamask = {
  domain: {
    chainId: 1,
    name: 'Ether Mail',
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    version: '1'
  },
  message: {
    contents: 'Hello, Bob!',
    attachedMoneyInEth: 4.2,
    from: {
      name: 'Cow',
      wallets: [
        '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF'
      ]
    },
    to: [
      {
        name: 'Bob',
        wallets: [
          '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
          '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
          '0xB0B0b0b0b0b0B000000000000000000000000000'
        ]
      }
    ]
  },
  primaryType: 'Mail',
  types: {
    EIP712Domain: [
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'version',
        type: 'string'
      },
      {
        name: 'chainId',
        type: 'uint256'
      },
      {
        name: 'verifyingContract',
        type: 'address'
      }
    ],
    Group: [
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'members',
        type: 'Person[]'
      }
    ],
    Mail: [
      {
        name: 'from',
        type: 'Person'
      },
      {
        name: 'to',
        type: 'Person[]'
      },
      {
        name: 'contents',
        type: 'string'
      }
    ],
    Person: [
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'wallets',
        type: 'address[]'
      }
    ]
  }
}

const typedDataFromBit = {
  types: {
    Action: [
      {
        name: 'action',
        type: 'string'
      },
      {
        name: 'params',
        type: 'string'
      }
    ],
    Cell: [
      {
        name: 'capacity',
        type: 'string'
      },
      {
        name: 'lock',
        type: 'string'
      },
      {
        name: 'type',
        type: 'string'
      },
      {
        name: 'data',
        type: 'string'
      },
      {
        name: 'extraData',
        type: 'string'
      }
    ],
    Transaction: [
      {
        name: 'DAS_MESSAGE',
        type: 'string'
      },
      {
        name: 'inputsCapacity',
        type: 'string'
      },
      {
        name: 'outputsCapacity',
        type: 'string'
      },
      {
        name: 'fee',
        type: 'string'
      },
      {
        name: 'action',
        type: 'Action'
      },
      {
        name: 'inputs',
        type: 'Cell[]'
      },
      {
        name: 'outputs',
        type: 'Cell[]'
      },
      {
        name: 'digest',
        type: 'bytes32'
      }
    ]
  },
  primaryType: 'Transaction',
  domain: {
    chainId: 1,
    name: 'da.systems',
    verifyingContract: '0x0000000000000000000000000000000020210722',
    version: '1'
  },
  message: {
    DAS_MESSAGE: 'TRANSFER FROM 0x54366bcd1e73baf55449377bd23123274803236e(906.74221046 CKB) TO ckt1qyqvsej8jggu4hmr45g4h8d9pfkpd0fayfksz44t9q(764.13228446 CKB), 0x54366bcd1e73baf55449377bd23123274803236e(142.609826 CKB)',
    inputsCapacity: '906.74221046 CKB',
    outputsCapacity: '906.74211046 CKB',
    fee: '0.0001 CKB',
    digest: '0x29cd28dbeb470adb17548563ceb4988953fec7b499e716c16381e5ae4b04021f',
    action: {
      action: 'transfer',
      params: '0x00'
    },
    inputs: [],
    outputs: []
  }
}

const typedDataFromBitFull = {
  types: {
    EIP712Domain: [
      {
        name: 'chainId',
        type: 'uint256'
      },
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'verifyingContract',
        type: 'address'
      },
      {
        name: 'version',
        type: 'string'
      }
    ],
    Action: [
      {
        name: 'action',
        type: 'string'
      },
      {
        name: 'params',
        type: 'string'
      }
    ],
    Cell: [
      {
        name: 'capacity',
        type: 'string'
      },
      {
        name: 'lock',
        type: 'string'
      },
      {
        name: 'type',
        type: 'string'
      },
      {
        name: 'data',
        type: 'string'
      },
      {
        name: 'extraData',
        type: 'string'
      }
    ],
    Transaction: [
      {
        name: 'DAS_MESSAGE',
        type: 'string'
      },
      {
        name: 'inputsCapacity',
        type: 'string'
      },
      {
        name: 'outputsCapacity',
        type: 'string'
      },
      {
        name: 'fee',
        type: 'string'
      },
      {
        name: 'action',
        type: 'Action'
      },
      {
        name: 'inputs',
        type: 'Cell[]'
      },
      {
        name: 'outputs',
        type: 'Cell[]'
      },
      {
        name: 'digest',
        type: 'bytes32'
      }
    ]
  },
  primaryType: 'Transaction',
  domain: {
    chainId: 1,
    name: 'da.systems',
    verifyingContract: '0x0000000000000000000000000000000020210722',
    version: '1'
  },
  message: {
    DAS_MESSAGE: 'TRANSFER FROM 0x54366bcd1e73baf55449377bd23123274803236e(906.74221046 CKB) TO ckt1qyqvsej8jggu4hmr45g4h8d9pfkpd0fayfksz44t9q(764.13228446 CKB), 0x54366bcd1e73baf55449377bd23123274803236e(142.609826 CKB)',
    inputsCapacity: '906.74221046 CKB',
    outputsCapacity: '906.74211046 CKB',
    fee: '0.0001 CKB',
    digest: '0x29cd28dbeb470adb17548563ceb4988953fec7b499e716c16381e5ae4b04021f',
    action: {
      action: 'transfer',
      params: '0x00'
    },
    inputs: [],
    outputs: []
  }
}

const mmJsonChangeManager: TxsWithMMJsonSignedOrUnSigned = {
  sign_key: '15020ef9cb836761b1b0b58943e8b971',
  sign_list: [
    {
      sign_type: 5,
      sign_msg: '0xf570c48b11c45bd8bd84bbc53ed512037680bac2912c642638bc331080b26a97'
    }
  ],
  mm_json: {
    types: {
      EIP712Domain: [
        {
          name: 'chainId',
          type: 'uint256'
        },
        {
          name: 'name',
          type: 'string'
        },
        {
          name: 'verifyingContract',
          type: 'address'
        },
        {
          name: 'version',
          type: 'string'
        }
      ],
      Action: [
        {
          name: 'action',
          type: 'string'
        },
        {
          name: 'params',
          type: 'string'
        }
      ],
      Cell: [
        {
          name: 'capacity',
          type: 'string'
        },
        {
          name: 'lock',
          type: 'string'
        },
        {
          name: 'type',
          type: 'string'
        },
        {
          name: 'data',
          type: 'string'
        },
        {
          name: 'extraData',
          type: 'string'
        }
      ],
      Transaction: [
        {
          name: 'DAS_MESSAGE',
          type: 'string'
        },
        {
          name: 'inputsCapacity',
          type: 'string'
        },
        {
          name: 'outputsCapacity',
          type: 'string'
        },
        {
          name: 'fee',
          type: 'string'
        },
        {
          name: 'action',
          type: 'Action'
        },
        {
          name: 'inputs',
          type: 'Cell[]'
        },
        {
          name: 'outputs',
          type: 'Cell[]'
        },
        {
          name: 'digest',
          type: 'bytes32'
        }
      ]
    },
    primaryType: 'Transaction',
    domain: {
      chainId: 5,
      name: 'da.systems',
      verifyingContract: '0x0000000000000000000000000000000020210722',
      version: '1'
    },
    message: {
      DAS_MESSAGE: 'EDIT MANAGER OF ACCOUNT imac.bit',
      inputsCapacity: '214.9997 CKB',
      outputsCapacity: '214.9996 CKB',
      fee: '0.0001 CKB',
      digest: '',
      action: {
        action: 'edit_manager',
        params: '0x00'
      },
      inputs: [
        {
          capacity: '214.9997 CKB',
          lock: 'das-lock,0x01,0x057df93d9f500fd5a9537fee086322a988d4fdcc...',
          type: 'account-cell-type,0x01,0x',
          data: '{ account: imac.bit, expired_at: 1688208987 }',
          extraData: '{ status: 0, records_hash: 0x55478d76900611eb079b22088081124ed6c8bae21a05dd1a0d197efcc7c114ce }'
        }
      ],
      outputs: [
        {
          capacity: '214.9996 CKB',
          lock: 'das-lock,0x01,0x057df93d9f500fd5a9537fee086322a988d4fdcc...',
          type: 'account-cell-type,0x01,0x',
          data: '{ account: imac.bit, expired_at: 1688208987 }',
          extraData: '{ status: 0, records_hash: 0x55478d76900611eb079b22088081124ed6c8bae21a05dd1a0d197efcc7c114ce }'
        }
      ]
    }
  }
}

const updateSubAccount: TxsSignedOrUnSigned = {
  action: 'update_sub_account',
  sign_key: 'ecd9bd0c4c9b9ac7b205ca778f12c85b',
  list: [
    {
      sign_list: [
        {
          sign_type: 3,
          sign_msg: 'From .bit: 4a77fe629bf14b9324f6db2feafc1adeed37c3e0746879723e76a2ff6b00b866'
        }
      ]
    }
  ]
}

describe('signData', function () {
  it('signPersonal', async function () {
    const sig = await signer.signData('0xtest')
    expect(sig).toBe('0x07d19751f27e47464247f75bd8fc274b2bfe65b534e59daa081dc8a4928e08102f8a6b84131835623f745ab8f2412966c7da6f05924b9239072fa95bdf02c1941c')
  })

  it('signPersonal with hex', async function () {
    const sig = await signer.signData(Buffer.from('b6f4af8809a529008110a468f2890875a2a9db3ac1e430e12f4a2dee0f89d33c', 'hex'))

    expect(sig).toBe('0x35594648433fec30670dbb952dfee533d6875c871cf0193fa5bd204ba1248df21e3bfaa08aea1bea0d79ec6097b4eb741721b90be4850b5242fa64c09edc242c1c')// wu 0x
  })

  // same with app.did.id
  it('signTypedData from MetaMask', async function () {
    const sig = await signer.signData(typedDataFromMetamask, true)
    expect(sig).toBe('0x3e6af6088752b89149fdbce440877476f1abb2f1c94ddb284829c9ae5f14339117c155af8005583a13b043e85d8a6cfb29787b9e91d6fd1c3b0a3d45906e31a51b')
  })

  // same with app.did.id
  it('signTypedData from .bit full', async function () {
    const sig = await signer.signData(typedDataFromBitFull, true)
    expect(sig).toBe('0x48f3a06a0b3e4763c91a4a5e087b42812814d41ca819ed4dc0e512869b19c02d6924eca590cef5dcf79721a5a7f9cfb647ce2843d684721d5d6b9dbb7de41e331c')
  })

  // todo: why? with or without EIP712Domain(typedDataFromBit or typedDataFromBitFull), the sig is different
  // same with app.did.id
  it('signTypedData from .bit', async function () {
    const sig = await signer.signData(typedDataFromBit, true)
    expect(sig).toBe('0x38304e2ee76f4faeb6c3ff0b83d7f29a213c4bf03a410a3ccd62450e23777a624629449267d225f9263c656fb2e471c1decb0854f88d2c69c84879a6ff27bdc71b')
  })
})

describe('eth-sig-util', function () {
  it('signTypedData from MetaMask', async function () {
    const sig = signTypedData({
      privateKey: Buffer.from(privateKey1, 'hex'),
      // @ts-expect-error
      data: typedDataFromMetamask,
      version: SignTypedDataVersion.V4,
    })
    expect(sig).toBe('0x3e6af6088752b89149fdbce440877476f1abb2f1c94ddb284829c9ae5f14339117c155af8005583a13b043e85d8a6cfb29787b9e91d6fd1c3b0a3d45906e31a51b')
  })

  it('signTypedData from .bit full', async function () {
    const sig = signTypedData({
      privateKey: Buffer.from(privateKey1, 'hex'),
      // @ts-expect-error
      data: typedDataFromBitFull,
      version: SignTypedDataVersion.V4,
    })

    expect(sig).toBe('0x48f3a06a0b3e4763c91a4a5e087b42812814d41ca819ed4dc0e512869b19c02d6924eca590cef5dcf79721a5a7f9cfb647ce2843d684721d5d6b9dbb7de41e331c')
  })

  // todo: why? with or without EIP712Domain(typedDataFromBit or typedDataFromBitFull), the sig is different
  it('signTypedData from .bit', async function () {
    const sig = signTypedData({
      privateKey: Buffer.from(privateKey1, 'hex'),
      // @ts-expect-error
      data: typedDataFromBit,
      version: SignTypedDataVersion.V4,
    })

    expect(sig).toBe('0x38304e2ee76f4faeb6c3ff0b83d7f29a213c4bf03a410a3ccd62450e23777a624629449267d225f9263c656fb2e471c1decb0854f88d2c69c84879a6ff27bdc71b')
  })
})

describe('signer._signTypedData', function () {
  it('signTypedData from MetaMask, with multiple primaryTypes, error', async function () {
    await expect(signer.signer._signTypedData(typedDataFromMetamask.domain, typedDataFromMetamask.types, typedDataFromMetamask.message)).rejects.toThrow('ambiguous primary types or unused types: "EIP712Domain", "Group", "Mail"')
  })

  it('signTypedData from .bit full, with multiple primaryTypes, error', async function () {
    await expect(signer.signer._signTypedData(typedDataFromBitFull.domain, typedDataFromBitFull.types, typedDataFromBitFull.message)).rejects.toThrow('ambiguous primary types or unused types: "EIP712Domain", "Transaction"')
  })

  // same with app.did.id
  it('signTypedData from MetaMask, without multiple types', async function () {
    const types = Object.assign({}, typedDataFromMetamask.types)
    delete types.EIP712Domain
    delete types.Group
    const sig = await signer.signer._signTypedData(typedDataFromMetamask.domain, types, typedDataFromMetamask.message)
    expect(sig).toBe('0x3e6af6088752b89149fdbce440877476f1abb2f1c94ddb284829c9ae5f14339117c155af8005583a13b043e85d8a6cfb29787b9e91d6fd1c3b0a3d45906e31a51b')
  })

  // todo: the ethers' result is different from metamask
  // different with app.did.id
  it('signTypedData from .bit', async function () {
    const sig = await signer.signer._signTypedData(typedDataFromBit.domain, typedDataFromBit.types, typedDataFromBit.message)

    expect(sig).toBe('0xdf6f5835ccf3abd2c98a3a1991211754411a685e3818f61950672d5b36278d0a3269b9258d38c7af95544ba77503abf53c003eaa110a82574588c5660939db8d1c')
  })
})

describe('signTxList', function () {
  it('work for mmJson', async function () {
    const res = await signer.signTxList(mmJsonChangeManager)
    expect(res.sign_list[0].sign_msg).toBe('0x99e335b373fa2bf1f025e4df89bfad75cc5608f9336441ae6e910c5a20fbde2f30f03ed49cee4eb7ea6bd03708206adfa60f2df7a5df83c3bc54a7e5d043fe491c3c08cabb37989ee799f37990f09f951dd8ed5a4b1afade04f0ff1a41ecd44b840000000000000005')
  })

  it('work for string', async function () {
    const res = await signer.signTxList(updateSubAccount)
    expect(res.list[0].sign_list[0].sign_msg).toBe('0x54a74d77ef7f315dd888e49656b2629d4a4ad287ec806ee70b047fd171f0d76e2e58c927f56d5f077847210397c18b00bf01c1c8145c59bfb88ebdd4a7f1f5d31c')
  })
})
