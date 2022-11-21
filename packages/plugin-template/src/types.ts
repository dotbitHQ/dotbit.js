import 'dotbit'

declare module 'dotbit/DotBit' {
  interface DotBit {
    flyAccount: (account: string) => Promise<string>,
  }
}

declare module 'dotbit' {
  interface BitAccount {
    fly: () => Promise<string>,
  }
}
