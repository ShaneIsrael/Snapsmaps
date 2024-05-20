const fs = require('fs')
const validator = require('email-validator')

module.exports = {
  isValidEmail: (email) => validator.validate(email),
  capitalizeFirstLetter: (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  },
  convertDMSToDD: (degrees, minutes, seconds, direction) => {
    let dd = degrees + minutes / 60 + seconds / (60 * 60)
    if (direction == 'S' || direction == 'W') {
      dd = dd * -1
    }
    return dd
  },
  readHTMLFile: (path, callback) => {
    fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
      if (err) {
        callback(err)
      } else {
        callback(null, html)
      }
    })
  },
}
