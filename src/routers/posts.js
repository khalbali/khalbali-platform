const express = require('express')
const { query, comment, sequelize } = require('../db')
const { updateTableRow } = require('../db/utils')
const auth = require('../middleware/auth')()
const optionalAuth = require('../middleware/auth')(true)
const db = require('../db/index')
const commentVotes = require('../models/commentVotes')
const Subreddit = db.subreddit
const Post = db.post
const PostVote = db.vote
const comments = db.comment
const router = express.Router()
const User = db.user
const Sequelize = require('sequelize')
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { subreddit } = req.query
    const FoundData = await Subreddit.findOne({
      where: { name: subreddit },
    })
    if (!FoundData) {
      return res.status(404).send('no subreddit avaible with this name')
    } else {
      const FoundPost = await Post.findAll({
        where: { subredditId: FoundData.id },
        attributes: {
          include: [
            [Sequelize.fn('COUNT', Sequelize.col('comments')), 'PostVotes'],
          ],
        },
        include: [
          { model: User, attributes: ['username'] },
          { model: Subreddit, attributes: ['name'] },
          { model: comments, attributes: ['body', 'id'] },
        ],
        group: ['comments'],
      })

      if (FoundPost.length == 0) {
        return res.status(404).send('no post avaible with this name')
      } else {
        return res.status(404).send(FoundPost)
      }
    }
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body
    //console.log(user_id)
    const foundPost = await Post.findOne({
      where: [{ id: id }, { userId: userId }],
    })

    if (!foundPost) {
      return res.status(404).send({ error: 'Could not find post with that id' })
    } else {
      res.send(foundPost)
    }
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { type, title, body, subreddit, userId } = req.body
    if (!type) {
      throw new Error('Must specify post type')
    }
    if (!title) {
      throw new Error('Must specify post title')
    }
    if (type === 'link' && !body) {
      throw new Error('Must specify link post URL')
    }
    if (!subreddit) {
      throw new Error('Must specify subreddit')
    }

    const foundSubreddit = await Subreddit.findOne({
      where: { name: subreddit },
    })

    if (!foundSubreddit) {
      throw new Error('Subreddit does not exist')
    }

    const newpost = await Post.create({
      type,
      title,
      body,
      userId,
      subredditId: foundSubreddit.id,
    })

    const newPostVote = await PostVote.create({
      vote_value: 1,
      postId: newpost.id,
      userId,
    })

    res.status(201).send(newpost)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const selectPostStatement = `select * from posts where id = $1`
    const {
      rows: [post],
    } = await query(selectPostStatement, [id])

    if (!post) {
      return res.status(404).send({ error: 'Could not find post with that id' })
    }
    if (post.author_id !== req.user.id) {
      return res
        .status(403)
        .send({ error: 'You must be the post creator to edit it' })
    }

    let allowedUpdates
    switch (post.type) {
      case 'text':
        allowedUpdates = ['title', 'body']
        break
      case 'link':
        allowedUpdates = ['title']
        break
      default:
        allowedUpdates = []
    }

    const updatedPost = await updateTableRow(
      'posts',
      id,
      allowedUpdates,
      req.body
    )
    res.send(updatedPost)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const selectPostStatement = `select * from posts where id = $1`
    const {
      rows: [post],
    } = await query(selectPostStatement, [id])

    if (!post) {
      return res.status(404).send({ error: 'Could not find post with that id' })
    }
    if (post.author_id !== req.user.id) {
      return res
        .status(401)
        .send({ error: 'You must be the post creator to delete it' })
    }

    // const deletePostStatement = `delete from posts where id = $1 returning *`
    // const { rows: [deletedPost] } = await query(deletePostStatement, [id])
    // res.send(deletedPost)

    const setFieldsToNullStatement = `
      update posts
      set title = null,
          body = null,
          author_id = null
      where id = $1
      returning *
    `

    const {
      rows: [deletedPost],
    } = await query(setFieldsToNullStatement, [id])
    res.send(deletedPost)
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

module.exports = router
