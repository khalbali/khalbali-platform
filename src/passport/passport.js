const passport = require('passport')
var GoogleStrategy = require('passport-google-oauth2').Strategy
const GOOGLE_CLIENT_ID =
  '785764627184-knat79mi98lk6qqhtqlkuojg32occgds.apps.googleusercontent.com/'
const GOOGLE_CLIENT_SECRET = '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'

const db = require('../db/index')
User = db.user

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/google/callback',
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      User.findOrCreate({ id: profile.id }, function (err, user) {
        return done(err, user)
      })
    }
  )
)
passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (user, done) {
  done(null, user)
})
