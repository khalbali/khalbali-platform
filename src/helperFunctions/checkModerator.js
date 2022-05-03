const db = require('../db/index')
const Moderator = db.moderator
const Subreddit = db.subreddit
const checkModerator = async (userId, subredditName) => {
  const moderatorData = await Moderator.findOne({
    where: { userId },
    include: [{ model: Subreddit }],
  })
  return moderatorData.subreddit.name === subredditName
}

module.exports = checkModerator
