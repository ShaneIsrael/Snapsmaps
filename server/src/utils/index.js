const validator = require('email-validator')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')

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
  signUserJwt: (id, email, displayName, mention, bio, image, followersCount, followingCount) =>
    jwt.sign({ id, email, displayName, mention, bio, image, followersCount, followingCount }, process.env.SECRET_KEY),
}
