const express = require('express')
const cors = require('cors')
const session = require('express-session')
// After you declare "app"

const usersRouter = require('./routers/users')
const postsRouter = require('./routers/posts')
const subredditsRouter = require('./routers/subreddits')
const moderatorsRouter = require('./routers/moderators')
const commentsRouter = require('./routers/comments')
const votesRouter = require('./routers/votes')
const passport = require('passport')
const auth = require('./routers/auth')
const port = process.env.PORT || 5000

const app = express()
app.use(session({ secret: 'what' }))
app.use(cors())
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

app.use('/users', usersRouter)
app.use('/posts', postsRouter)
app.use('/subreddits', subredditsRouter)
app.use('/moderators', moderatorsRouter)
app.use('/comments', commentsRouter)
app.use('/votes', votesRouter)
app.use('/auth', auth)
app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})
