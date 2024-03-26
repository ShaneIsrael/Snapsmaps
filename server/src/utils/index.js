const validator = require('email-validator')
const fs = require('fs')
const path = require('path')

module.exports = {
  isValidEmail: (email) => validator.validate(email),
  getTodaysDate: () =>
    new Date().toLocaleString('fr-CA', { timeZone: 'America/Los_Angeles' }).match(/\d{4}-\d{2}-\d{2}/g)[0],
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
}
