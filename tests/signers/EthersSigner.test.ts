import { signTypedData, SignTypedDataVersion, TypedDataUtils } from '@metamask/eth-sig-util'
import { Wallet } from 'ethers'
import { EthersSigner } from '../../src/index'

const address = '0x7df93d9F500fD5A9537FEE086322a988D4fDCC38'
const privateKey1 = '87d8a2bccdfc9984295748fa2058136c8131335f59930933e9d4b3e74d4fca42'
const signer = new Wallet(privateKey1)
const ethersSigner = new EthersSigner(signer)

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

describe('signData', function () {
  it('signPersonal', async function () {
    const sig = await ethersSigner.signData('0xtest')
    expect(sig).toBe('0x07d19751f27e47464247f75bd8fc274b2bfe65b534e59daa081dc8a4928e08102f8a6b84131835623f745ab8f2412966c7da6f05924b9239072fa95bdf02c1941c')
  })

  it('signPersonal with hex', async function () {
    const sig = await ethersSigner.signData(Buffer.from('b6f4af8809a529008110a468f2890875a2a9db3ac1e430e12f4a2dee0f89d33c', 'hex'))

    expect(sig).toBe('0x9e300546be6eec960f46eebf5a9a1aeb088f16cb232bdeaa1e0eaa27b75e96f26e1ad42e1aa454af24e6d0dead3b94fc03dd5c65ec0c284d83a828482fa48d721b')// wu 0x
  })

  // same with app.did.id
  it('signTypedData from MetaMask', async function () {
    const sig = await ethersSigner.signData(typedDataFromMetamask, true)
    expect(sig).toBe('0x3e6af6088752b89149fdbce440877476f1abb2f1c94ddb284829c9ae5f14339117c155af8005583a13b043e85d8a6cfb29787b9e91d6fd1c3b0a3d45906e31a51b')
  })

  // same with app.did.id
  it('signTypedData from .bit full', async function () {
    const sig = await ethersSigner.signData(typedDataFromBitFull, true)
    expect(sig).toBe('0x48f3a06a0b3e4763c91a4a5e087b42812814d41ca819ed4dc0e512869b19c02d6924eca590cef5dcf79721a5a7f9cfb647ce2843d684721d5d6b9dbb7de41e331c')
  })

  // todo: why? with or without EIP712Domain(typedDataFromBit or typedDataFromBitFull), the sig is different
  // same with app.did.id
  it('signTypedData from .bit', async function () {
    const sig = await ethersSigner.signData(typedDataFromBit, true)
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
    await expect(ethersSigner.signer._signTypedData(typedDataFromMetamask.domain, typedDataFromMetamask.types, typedDataFromMetamask.message)).rejects.toThrow('ambiguous primary types or unused types: "EIP712Domain", "Group", "Mail"')
  })

  it('signTypedData from .bit full, with multiple primaryTypes, error', async function () {
    await expect(ethersSigner.signer._signTypedData(typedDataFromBitFull.domain, typedDataFromBitFull.types, typedDataFromBitFull.message)).rejects.toThrow('ambiguous primary types or unused types: "EIP712Domain", "Transaction"')
  })

  // same with app.did.id
  it('signTypedData from MetaMask, without multiple types', async function () {
    const types = Object.assign({}, typedDataFromMetamask.types)
    delete types.EIP712Domain
    delete types.Group
    const sig = await ethersSigner.signer._signTypedData(typedDataFromMetamask.domain, types, typedDataFromMetamask.message)
    expect(sig).toBe('0x3e6af6088752b89149fdbce440877476f1abb2f1c94ddb284829c9ae5f14339117c155af8005583a13b043e85d8a6cfb29787b9e91d6fd1c3b0a3d45906e31a51b')
  })

  // todo: the ethers' result is different from metamask
  // different with app.did.id
  it('signTypedData from .bit', async function () {
    const sig = await ethersSigner.signer._signTypedData(typedDataFromBit.domain, typedDataFromBit.types, typedDataFromBit.message)

    expect(sig).toBe('0xdf6f5835ccf3abd2c98a3a1991211754411a685e3818f61950672d5b36278d0a3269b9258d38c7af95544ba77503abf53c003eaa110a82574588c5660939db8d1c')
  })
})
