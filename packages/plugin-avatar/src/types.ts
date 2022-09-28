import { DotBit } from 'dotbit/Dotbit'

declare module 'dotbit/BitAccount' {
  interface BitAccount {
    avatar: () => Promise<{ linkage: Array<{ type: string, content: string }>, url: string } | null>,
  }
}
