const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { updateTableRow } = require('../db/utils')
//cons = require('../middlewar')()
const db = require('../db/index')
const { json } = require('express')
const router = express.Router()
const User = db.user
const getPublicUser = (user) => {
  delete user.password
  delete user.tokens
  return user
}

const addToken = async (userid) => {
  const token = await jwt.sign({ id: userid }, process.env.JWT_SECRET)

  const updateUserTokensStatement = `
    update users
    set tokens = tokens || $1
    where id = $2
    returning *
  `
  const {
    rows: [user],
  } = await query(updateUserTokensStatement, [[token], userid])
  return { user, token }
}

router.get('/', async (req, res) => {
  try {
    const rows = await User.findAll()

    const data = rows.map((user) => {
      const values = {
        id: user.id,
        username: user.username,
        updatedAT: user.updatedAt,
        createdAt: user.createdAt,
      }
      return values
    })

    res.send(data)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).send({ error: 'Could not find user with that id' })
    } else {
      const values = {
        id: user.id,
        username: user.username,
        updatedAT: user.updatedAt,
        createdAt: user.createdAt,
      }
      res.send(values)
    }
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.post('/', async (req, res) => {
  try {
    console.log(req.body)
    const { username, password } = req.body
    if (!username) {
      throw new Error('Username is required')
    }
    if (!password) {
      throw new Error('Password is required')
    }
    const rows = await User.findOne({ where: { username: username } })
    console.log(rows)
    if (rows != null) {
      return res.status(409).send({ error: 'Username is already taken' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword)

    const newUser = await User.create({
      username: username,
      password: hashedPassword,
    })

    newUser.save()

    return res.status(201).send({
      id: user.id,
      username: newUser.username,
    })
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      throw new Error('Username and password are required')
    }

    const selectUserStatement = await User.findOne({
      where: { username: username },
    })

    if (!selectUserStatement) {
      return res
        .status(401)
        .send({ error: 'Username or password was incorrect' })
    }

    const isMatch = await bcrypt.compare(password, selectUserStatement.password)
    if (!isMatch) {
      return res
        .status(401)
        .send({ error: 'Username or password was incorrect' })
    }

    //const { user, token } = await addToken(rows[0].id)

    res.send({
      id: selectUserStatement.id,
      user: selectUserStatement.username,
      updatedAT: selectUserStatement.updatedAT,
      createdAt: selectUserStatement.createdAt,
    })
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

router.post('/logout', async (req, res) => {
  const tokens = req.user.tokens.filter((token) => token !== req.token)
  const setUserTokensStatement = `
    update users
    set tokens = $1
    where id = $2
  `
  const {
    rows: [user],
  } = await query(setUserTokensStatement, [tokens, req.user.id])
  delete req.user
  delete req.token
  res.send(user)
})

router.post('/logoutAll', async (req, res) => {
  const clearUserTokensStatement = `
    update users
    set tokens = '{}'
    where id = $1
  `
  const {
    rows: [user],
  } = await query(clearUserTokensStatement, [req.user.id])
  delete req.user
  delete req.token
  res.send(user)
})

router.put('/:id', async (req, res) => {
  try {
    console.log(req.params.id)
    const { username, password } = req.body
    if (!username) {
      throw new Error('Username is required')
    }
    if (!password) {
      throw new Error('Password is required')
    }

    const rows = await User.findOne({ where: { username: username } })

    if (rows != null) {
      return res.status(409).send({ error: 'Username is already taken' })
    }

    const hashedpassword = await bcrypt.hash(req.body.password, 10)

    const updateUser = await User.update(
      { username: username, password: hashedpassword },
      { where: { id: req.params.id } }
    )
    if (updateUser) {
      res.send({ message: 'username and password updated', username })
    } else {
      throw Error
    }
  } catch (e) {
    res.status(404).send({ error: e.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deleteUserStatement = await User.destroy({
      where: { id: req.params.id },
    })

    if (!deleteUserStatement) {
      return res.status(404).send({ error: 'Could not find user with that id' })
    }
    return res.send({
      message: 'deleted',
    })
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

module.exports = router
