const router = require('express').Router()
const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const readFilter = req.query.read
  const includeOptions = {
    model: Blog,
    as: 'readings',
    attributes: { exclude: ['userId'] },
    through: { attributes: ['id', 'read'] }
  }
  if (readFilter !== undefined) {
    includeOptions.through = {
      attributes: ['id', 'read'],
      where: { read: readFilter === 'true' }
    }
  }

  const user = await User.findByPk(req.params.id, {
    include: [includeOptions]
  })
  if (user) {
    const readings = (user.readings || []).map((r) => {
      const obj = typeof r.toJSON === 'function' ? r.toJSON() : { ...r }
      if (obj.list) {
        obj.readingList = obj.list
        delete obj.list
      }
      return obj
    })
    res.json({
      id: user.id,
      name: user.name,
      username: user.username,
      readings
    })
  } else {
    res.status(404).end()
  }
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

module.exports = router