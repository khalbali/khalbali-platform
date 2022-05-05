const jwt = require('jsonwebtoken')
const config = require('./config')

const generateToken = ({ id, errorMessage, secret }) => {
  try {
    const token = jwt.sign({ id }, secret, {
      expiresIn: `${config.SESSION_DURATION * 60 * 1000}`,
      // expiresIn:`3600000`,
    })
    console.log(token)
    return token
  } catch (err) {
    throw errorMessage || err
  }
}

const verifyToken = ({ token, errorMessage, secret }) => {
  try {
    const jwToken = jwt.verify(token, secret)
    return jwToken.id
  } catch (err) {
    throw errorMessage || err
  }
}

const token = generateToken({
  id: 1,
  secret: process.env.JWT_SECRET,
  errorMessage: null,
})
verifyToken({ token, secret: process.env.JWT_SECRET, errorMessage: null })
module.exports = {
  generateToken,
  verifyToken,
}
