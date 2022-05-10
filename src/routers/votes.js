const express = require('express')
const isAuthenticated = require('../middleware/isAuthenticated')

const router = express.Router()
const db = require('../db/index')
const Vote = db.vote
const commentVote = db.commentvote

const checkVoteType = (voteType) => {
  const types = ['post', 'comment']
  let error
  if (!types.includes(voteType)) {
    error = 'Invalid vote type'
  }
  return { voteType, error }
}

const checkVoteValid = async (item_id, vote_value, vote_type) => {
  let status
  let error
  if (!/^\d+$/.test(item_id)) {
    status = 400
    error = `Invalid ${vote_type} id`
  } else if (![-1, 0, 1].includes(parseInt(vote_value))) {
    status = 400
    error = 'Invalid vote value'
  } else {
    if (vote_type == 'post') {
      const selectPostVotes = await Vote.findByPk(item_id)
      if (!selectPostVotes) {
        status = 404
        error = `Could not find ${vote_type} with that id`
      }
    }
    if (vote_type == 'comment') {
      const selectCommentVotes = await commentVote.findByPk(item_id)

      if (!selectCommentVotes) {
        status = 404
        error = `Could not find ${vote_type} with that id`
      }
    }
  }

  return { status, error }
}

router.get('/:voteType', async (req, res) => {
  try {
    const { voteType, error } = checkVoteType(req.params.voteType)
    if (error) {
      return res.status(400).send({ error })
    }
    if (voteType == 'post') {
      const selectPostVotes = await Vote.findAll()
      if (selectPostVotes.length == 0) {
        return res.status(500).send({ message: 'No votes available' })
      } else {
        return res.send(selectPostVotes)
      }
    }
    if (voteType == 'comment') {
      const selectCommentVotes = await commentVote.findAll()

      if (selectCommentVotes.length == 0) {
        return res.status(500).send({ message: 'No votes available' })
      } else {
        return res.send(selectCommentVotes)
      }
    }
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.post('/:voteType', isAuthenticated, async (req, res) => {
  try {
    const { voteType, error: voteTypeError } = checkVoteType(
      req.params.voteType
    )
    if (voteTypeError) {
      return res.status(400).send({ error: voteTypeError })
    }
    const { item_id, vote_value, user_id } = req.body

    const { status, error } = await checkVoteValid(
      item_id,
      vote_value,
      voteType
    )
    if (error) {
      return res.status(status).send({ error })
    }
    if (voteType == 'post') {
      const findPost = await Vote.findOne({
        where: [{ postId: item_id }, { userId: user_id }],
      })
      if (!findPost || findPost.length == 0) {
        const selectPostVotes = await Vote.create({
          vote_value: vote_value,
          postId: item_id,
          userId: user_id,
        })
        if (selectPostVotes.length == 0) {
          return res.status(500).send({ message: 'No votes available' })
        } else {
          return res.send(selectPostVotes)
        }
      } else {
        const updatePostVote = await Vote.update(
          { vote_value: vote_value },
          { where: { id: findPost.id } }
        )
        if (updatePostVote) {
          return res.send({ message: 'vote updated' })
        }
      }
    }

    if (voteType == 'comment') {
      const findComment = await commentVote.findOne({
        where: [{ commentId: item_id }, { userId: user_id }],
      })
      console.log(findComment.id)
      if (!findComment || findComment.length == 0) {
        const selectCommentVotes = await commentVote.create({
          vote_value: vote_value,
          commentId: item_id,
          userId: user_id,
        })

        if (selectCommentVotes.length == 0) {
          return res.status(500).send({ message: 'No votes available' })
        } else {
          return res.send(selectCommentVotes)
        }
      } else {
        const updateCommentVote = await commentVote.update(
          { vote_value: vote_value },
          { where: { id: findComment.id } }
        )
        return res.send({ message: 'vote updated' })
      }
    }
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})



module.exports = router
