const express = require('express')
const { query, vote } = require('../db')
const { updateTableRow, userIsModerator } = require('../db/utils')
const auth = require('../middleware/auth')()
const optionalAuth = require('../middleware/auth')(true)
const db = require('../db/index')
const checkModerator = require('../helperFunctions/checkModerator')
const { Sequelize } = require('sequelize')
const Comment = db.comment
const CommentVote = db.commentvote
const Post = db.post
const User = db.user
const Subreddit = db.subreddit
const PostVote = db.vote
const Moderator = db.moderator

const router = express.Router()

const selectCommentStatement = `
  select c.id, c.author_id, c.post_id, c.parent_comment_id, sr.name subreddit_name
  from comments c
  inner join posts p on c.post_id = p.id
  inner join subreddits sr on p.subreddit_id = sr.id
  where c.id = $1
`

const selectAllCommentsStatement = `
  select
  c.id, c.body, c.post_id, c.parent_comment_id, c.created_at, c.updated_at,
  max(u.username) author_name,
  cast(coalesce(sum(cv.vote_value), 0) as int) votes,
  max(ucv.vote_value) has_voted
  from comments c
  left join users u on c.author_id = u.id
  left join comment_votes cv on c.id = cv.comment_id
  left join comment_votes ucv on ucv.comment_id = c.id and ucv.user_id = $1
  group by c.id
`

router.get('/', async (req, res) => {
  try {
    const selectCommentsStatement = `select * from comments`
    const { rows } = await query(selectCommentsStatement)
    res.send(rows)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.get('/:post_id', optionalAuth, async (req, res) => {
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

router.post('/', auth, async (req, res) => {
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

router.put('/:id', auth, async (req, res) => {
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
      comment.userId !== 1 &&
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

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const {
      rows: [comment],
    } = await query(selectCommentStatement, [id])
    if (!comment) {
      return res
        .status(404)
        .send({ error: 'Could not find comment with that id' })
    }
    if (
      comment.author_id !== req.user.id &&
      (await userIsModerator(req.user.username, comment.subreddit_name)) ===
        false
    ) {
      return res
        .status(403)
        .send({ error: 'You must be the comment author to delete it' })
    }

    // const deleteCommentStatement = `delete from comments where id = $1 returning *`
    // const { rows: [deletedComment] } = await query(deleteCommentStatement, [id])

    const setFieldsToNullStatement = `
      update comments
      set body = null,
          author_id = null
      where id = $1
      returning *
    `

    const {
      rows: [deletedComment],
    } = await query(setFieldsToNullStatement, [id])

    res.send(deletedComment)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

module.exports = router
