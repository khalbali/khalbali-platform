const express = require('express')
const checkModerator = require('../helperFunctions/checkModerator')
const db = require('../db/index')
const User = db.user
const Subreddit = db.subreddit
const Moderator = db.moderator

const isAuthenticated = require('../middleware/isAuthenticated')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { username, subreddit } = req.query

    let whereClauseUser = {}
    let whereClauseSubreddit = {}

    if (username && subreddit) {
      whereClauseUser = { where: { userName: username } }
      whereClauseSubreddit = { where: { name: subreddit } }
    }

    if (username && !subreddit) {
      whereClauseUser = { where: { userName: username } }
    }

    if (!username && subreddit) {
      whereClauseSubreddit = { where: { name: subreddit } }
    }
    const ModeratorData = await Moderator.findAll({
      include: [
        {
          model: User,
          attributes: ['userName'],
          whereClauseUser,
        },
        {
          model: Subreddit,
          attributes: ['name'],
          whereClauseSubreddit,
        },
      ],
    })
    return res.send(ModeratorData)
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { userId, username, subreddit } = req.body

    const userData = await User.findOne({ where: { userName: username } })
    const subredditData = await Subreddit.findOne({
      where: { name: subreddit },
    })

    const moderatorData = await Moderator.findOne({
      where: { userId: userData.id, subredditId: subredditData.id },
    })

    if (moderatorData) {
      return res.status(500).send({ message: 'already moderator' })
    }

    console.log(req.body)
    if (!username) {
      throw new Error('Must specify user')
    }
    if (!subreddit) {
      throw new Error('Must specify subreddit')
    }

    if ((await checkModerator(userId, subreddit)) === false) {
      return res.status(403).send({
        error: `You do not have permissions to add a moderator in the subreddit`,
      })
    }

    const newModerator = await Moderator.create({
      userId: userData.id,
      subredditId: subredditData.id,
    })

    return res.status(201).send(newModerator)
  } catch (e) {
    return res.status(400).send({ error: e.message })
  }
})

router.delete('/', isAuthenticated, async (req, res) => {
  try {
    const { userId, username, subreddit } = req.body
    if (!username) {
      throw new Error('Must specify user')
    }
    if (!subreddit) {
      throw new Error('Must specify subreddit')
    }

    if ((await checkModerator(userId, subreddit)) === false) {
      return res.status(403).send({
        error: `You do not have permissions to delete a moderator in the subreddit '${subreddit}'`,
      })
    }

    const userData = await User.findOne({ where: { userName: username } })

    await Moderator.destroy({
      where: { userId: userData.id },
    })
    res.send({ message: 'deleted successfully' })
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

module.exports = router
