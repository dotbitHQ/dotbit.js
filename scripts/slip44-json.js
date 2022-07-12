const constants = require('bip44-constants')
const fs = require('fs')
const path = require('path')

const coinTypeSymbolList = constants.map(function (raw) {
  const [constant, symbol, name] = raw
  return [constant - 0x80000000, symbol]
})

const coinTypeSymbolMap = coinTypeSymbolList.reduce(function (acc, [coinType, symbol]) {
  acc[coinType] = symbol
  return acc
}, {})

console.log(coinTypeSymbolMap)

fs.writeFileSync(path.resolve(__dirname, '../src/slip44/coinType2Symbol.json'), JSON.stringify(coinTypeSymbolMap, null, 2))