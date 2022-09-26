import { DotBit } from 'dotbit/Dotbit'

declare module 'dotbit/DotBit' {
  interface DotBit {
    flyAccount: (account: string) => Promise<string>,
  }
}

declare module 'dotbit/BitAccount' {
  interface BitAccount {
    fly: () => Promise<string>,
  }
}
