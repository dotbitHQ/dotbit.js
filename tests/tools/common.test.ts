import { isEmptyAddress, pad0x } from '../../src/tools/common'

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

describe('isEmptyAddress', function () {
  it('empty', function () {
    const isEmpty = isEmptyAddress('')

    expect(isEmpty).toBe(true)
  })

  it('0x', function () {
    const isEmpty = isEmptyAddress('0x')

    expect(isEmpty).toBe(true)
  })

  it('0x0', function () {
    const isEmpty = isEmptyAddress('0x0')

    expect(isEmpty).toBe(true)
  })

  it('0x0000000000000000000000000000000000000000', function () {
    const isEmpty = isEmptyAddress('0x0000000000000000000000000000000000000000')

    expect(isEmpty).toBe(true)
  })

  it('0x123', function () {
    const isEmpty = isEmptyAddress('0x123')

    expect(isEmpty).toBe(false)
  })
})
