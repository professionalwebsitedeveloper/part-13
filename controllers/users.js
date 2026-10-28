const router = require('express').Router()
const { User } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.post('/', async (req, res) => {
  const { password, ...userData } = req.body
  const user = await User.create(userData)
  res.json(user)
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    }
  })
  if (!user) {
    return res.status(400).json({ error: ['User not found!'] })
  }
  const updated = await user.update({
    name: req.body.name
  })
  res.json(updated)
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
