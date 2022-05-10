const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')


const db = require('./index')
const User = db.user
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  BACKEND_URL,
} = require('./config')

//Google Strategy
passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:5000` + '/api/auth/google/redirect',
    },
    async (accessToken, refreshToken, profile, done) => {
      //Trigger once user login. We should just save the google id and pass user object to routes (req.user)
      try {
        console.log(accessToken)
        console.log(refreshToken)
        console.log(profile)
        const user = await User.findOrCreate(profile)
        return done(null, user)
      } catch (err) {
        done(err)
      }
    }
  )
)

passport.serializeUser((user, cb) => {
  cb(null, user)
})

passport.deserializeUser((user, cb) => {
  cb(null, user)
})

module.exports = passport
