const { createInstance } = require('../../lib/index')

const dotbit = createInstance()

dotbit.records('imac.bit').then(console.log)
