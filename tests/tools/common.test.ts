import { pad0x } from '../../src/tools/common'

describe('pad0x', function () {
  it('starts with 0x', function () {
    const str = '0x123'

    const padded = pad0x(str)

    expect(padded).toBe(str)
  })

  it('does not start with 0x', function () {
    const str = '123'

    const padded = pad0x(str)

    expect(padded).toBe(`0x${str}`)
  })
})
