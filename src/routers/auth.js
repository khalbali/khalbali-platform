const express = require('express')
const passport = require('passport')

const router = express.Router()
require('../passport/passport')

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['username', 'id'],
  })
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/users',
    failureRedirect: '/auth/failure',
  })
)

router.get('/failure', function (req, res) {
  res.send('unauthirized')
})
module.exports = router
