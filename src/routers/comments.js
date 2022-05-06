const express = require('express')
const isAuthenticated = require('../middleware/isAuthenticated')
const db = require('../db/index')
const checkModerator = require('../helperFunctions/checkModerator')
const { Sequelize } = require('sequelize')
const Comment = db.comment
const CommentVote = db.commentvote
const Post = db.post
const User = db.user
const Subreddit = db.subreddit


const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const commentData = await Comment.findAll()
    res.send(commentData)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.get('/:post_id', async (req, res) => {
  try {
    const { post_id } = req.params
    const postData = await Post.findOne({
      where: { id: post_id },
      include: [
        { model: User, attributes: ['username'] },
        { model: Subreddit, attributes: ['name'] },
      ],
    })

    const commentData = await Comment.findAll({
      where: { postId: post_id },
      attributes: {
        include: [
          [
            Sequelize.fn('SUM', Sequelize.col('commentvotes.vote_value')),
            'commentVotes',
          ],
        ],
      },
      include: [
        { model: CommentVote, attributes: [] },
        { model: User, attributes: ['username'] },
      ],
      group: ['commentvotes.commentId'],
    })

    if (!postData) {
      return res.status(404).send({ error: 'Could not find post with that id' })
    }

    res.send({ postData, commentData })
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { body, post_id, parent_comment_id, userId } = req.body
    if (!body) {
      throw new Error('Must specify comment body')
    }
    if (!post_id) {
      throw new Error('Must specify post to comment on')
    }

    const newComment = await Comment.create({
      body: body,
      userId,
      postId: post_id,
      commentId: parent_comment_id,
    })
    console.log(newComment)
    newComment.save()

    // Automatically upvote own comment

    const newCommentVote = await CommentVote.create({
      userId,
      commentId: newComment.id,
      vote_value: 1,
    })
    console.log(newCommentVote)
    newCommentVote.save()

    res.status(201).send(newComment)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params

    const comment = await Comment.findOne({
      where: { id },
      include: [{ model: Post, include: [Subreddit] }],
    })

    const subredditName = comment.post.subreddit.name

    if (!comment) {
      return res
        .status(404)
        .send({ error: 'Could not find comment with that id' })
    }

    if (
      comment.userId !== req.body.userId &&
      (await checkModerator(comment.userId, subredditName)) === false
    ) {
      return res
        .status(403)
        .send({ error: 'You must the comment author to edit it' })
    }

    const updatedComment = await comment.update(req.body)
    return res.send(updatedComment)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body

    const commentData = await Comment.findByPk(id, {
      include: [{ model: Post, include: [Subreddit] }],
    })
    console.log(commentData)
    if (!commentData) {
      return res
        .status(404)
        .send({ error: 'Could not find comment with that id' })
    }

    const subredditName = commentData.post.subreddit.name
    if (
      commentData.userId !== userId &&
      (await checkModerator(commentData.userId, subredditName)) === false
    ) {
      return res
        .status(403)
        .send({ error: 'You must be the comment author to delete it' })
    }
    await Comment.destroy({ where: { id } })
    return res.status(200).send({ message: 'deleted' })
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

module.exports = router
