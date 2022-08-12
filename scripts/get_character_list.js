const fetch = require('cross-fetch')
const fs = require('fs')
const path = require('path')

fetch('https://register-api.did.id/v1/character/set/list', {
  method: 'POST',
  body: JSON.stringify({}),
  headers: {
    'Content-Type': 'application/json',
  }
})
  .then(async (res) => {
    if (res.status === 200) {
      const { data, err_no, err_msg } = await res.json()
      if (err_no !== 0) {
        throw new Error(err_msg)
      }
      for (const key in data) {
        try {
          const filePath = path.resolve(__dirname, `../src/tools/char_set/${ key }.json`)
          const charList = JSON.stringify(data[key].sort(), null, 4)
          fs.writeFileSync(filePath, charList)
        }
        catch (error) {
          console.error(error)
        }
      }
    }
  })
  .catch(error => {
    console.error(error)
  })
