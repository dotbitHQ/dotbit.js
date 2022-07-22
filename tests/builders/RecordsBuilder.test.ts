import { RecordsEditor } from '../../src/index'
import { accountWithSigner } from '../common/index'

let records
beforeEach(() => {
  records = [{
    key: 'address.60',
    value: '0x1d643fac9a463c9d544506006a6348c234da485f',
    label: 'Personal',
    ttl: '300',
  }, {
    key: 'address.60',
    value: '0x1d643fac9a463c9d544506006a6348c234da485f1',
    label: 'Business',
    ttl: '300',
  }, {
    key: 'address.9006',
    value: '0x1d643fac9a463c9d544506006a6348c234da485f',
    label: '',
    ttl: '300',
  }, {
    key: 'address.9006',
    value: '0x1d643fac9a463c9d544506006a6348c234da485f',
    label: 'Personal',
    ttl: '300',
  }]
})

describe('add', function () {
  it('full record', function () {
    const editor = new RecordsEditor([], accountWithSigner)
    editor.add({
      key: 'profile.email',
      value: 'hr@apple.com',
      label: 'HR',
      ttl: '3000',
    })

    expect(editor.records).toEqual([{
      key: 'profile.email',
      value: 'hr@apple.com',
      label: 'HR',
      ttl: '3000',
    }])
  })

  it('simple record', function () {
    const editor = new RecordsEditor([], accountWithSigner)
    editor.add({
      key: 'profile.email',
      value: 'apple@apple.com',
    })

    expect(editor.records).toEqual([{
      key: 'profile.email',
      value: 'apple@apple.com',
      label: '',
      ttl: '300',
    }])
  })

  it('multiple records', function () {
    const editor = new RecordsEditor([], accountWithSigner)

    editor.add([{
      key: 'profile.email',
      value: 'apple@apple.com',
    }, {
      key: 'profile.email',
      value: 'hr@apple.com',
      label: 'HR',
      ttl: '3000',
    }])

    expect(editor.records).toEqual([{
      key: 'profile.email',
      value: 'apple@apple.com',
      label: '',
      ttl: '300',
    }, {
      key: 'profile.email',
      value: 'hr@apple.com',
      label: 'HR',
      ttl: '3000',
    }])
  })
})

describe('delete', function () {
  it('only key', function () {
    const editor = new RecordsEditor(records, accountWithSigner)
    editor.delete({
      key: 'address.60',
    })

    expect(editor.records).toEqual([{
      key: 'address.9006',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
      label: '',
      ttl: '300',
    }, {
      key: 'address.9006',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
      label: 'Personal',
      ttl: '300',
    }])
  })

  it('only label', function () {
    const editor = new RecordsEditor(records, accountWithSigner)
    editor.delete({
      label: 'Personal',
    })

    expect(editor.records).toEqual([{
      key: 'address.60',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f1',
      label: 'Business',
      ttl: '300',
    }, {
      key: 'address.9006',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
      label: '',
      ttl: '300',
    }]
    )
  })

  it('only value', function () {
    const editor = new RecordsEditor(records, accountWithSigner)
    editor.delete({
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
    })

    expect(editor.records).toEqual([{
      key: 'address.60',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f1',
      label: 'Business',
      ttl: '300',
    }])
  })

  it('key & value', function () {
    const editor = new RecordsEditor(records, accountWithSigner)

    editor.delete({
      key: 'address.9006',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
    })

    expect(editor.records).toEqual([{
      key: 'address.60',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
      label: 'Personal',
      ttl: '300',
    }, {
      key: 'address.60',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f1',
      label: 'Business',
      ttl: '300',
    }])
  })

  it('key & value & label', function () {
    const editor = new RecordsEditor(records, accountWithSigner)
    editor.delete({
      key: 'address.60',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
      label: 'Personal',
    })

    expect(editor.records).toEqual([{
      key: 'address.60',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f1',
      label: 'Business',
      ttl: '300',
    }, {
      key: 'address.9006',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
      label: '',
      ttl: '300',
    }, {
      key: 'address.9006',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
      label: 'Personal',
      ttl: '300',
    }])
  })
})

describe('empty', function () {
  it('work', function () {
    const editor = new RecordsEditor([], accountWithSigner)
    editor.empty()
    expect(editor.records).toStrictEqual([])
  })
})

describe('change', function () {
  it('single', function () {
    const editor = new RecordsEditor(records, accountWithSigner)
    editor.change({
      key: 'address.60',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
      label: 'Personal',
    }, {
      key: 'address.60',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
      label: 'Personal Binance',
    })

    expect(editor.records).toStrictEqual([{
      key: 'address.60',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f1',
      label: 'Business',
      ttl: '300',
    }, {
      key: 'address.9006',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
      label: '',
      ttl: '300',
    }, {
      key: 'address.9006',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
      label: 'Personal',
      ttl: '300',
    }, {
      key: 'address.60',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
      label: 'Personal Binance',
      ttl: '300',
    }])
  })

  it('multiple', function () {
    const editor = new RecordsEditor(records, accountWithSigner)
    editor.change({
      key: 'address.60',
    }, {
      key: 'address.60',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
    })

    expect(editor.records).toStrictEqual([{
      key: 'address.9006',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
      label: '',
      ttl: '300',
    }, {
      key: 'address.9006',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
      label: 'Personal',
      ttl: '300',
    }, {
      key: 'address.60',
      value: '0x1d643fac9a463c9d544506006a6348c234da485f',
      label: '',
      ttl: '300',
    }])
  })
})
