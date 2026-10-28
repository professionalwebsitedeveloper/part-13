const router = require('express').Router()
const { List, Blog, User } = require('../models')
const userFinder = require('../util/findUser')

router.post('/', async (req, res, next) => {
    try {
        const { blogId, userId } = req.body
        if (blogId === undefined || blogId === null || userId === undefined || userId === null) {
            return res.status(400).json({ error: 'blogId and userId are required' })
        }
        const blog = await Blog.findByPk(blogId)
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found!' })
        }
        const user = await User.findByPk(userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found!' })
        }
        const existing = await List.findOne({ where: { blogId, userId } })
        if (existing) {
            return res.status(400).json({ error: 'Blog already in reading list' })
        }
        const list = await List.create({ blogId, userId, read: false })
        res.status(201).json(list)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', userFinder, async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'No user found!' })
        }
        const { read } = req.body
        const id = req.params.id
        const list = await List.findByPk(id)
        if (!list) {
            return res.status(404).json({ error: 'Reading list entry not found!' })
        }
        const currentId = req.user.id
        const listUserId = list.userId
        if (!(currentId === listUserId)) {
            return res.status(401).json({ error: 'You can only update your own reading list!' })
        }
        await list.update({ read: read })
        const updatedList = await List.findByPk(id)
        res.json(updatedList)
    } catch (error) {
        next(error)
    }
})

router.use((error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'token invalid' })
    }
    if (error.message === 'Session not valid!') {
        return res.status(401).json({ error: error.message })
    }
    if (error.message === 'You can only update your own reading list!') {
        return res.status(401).json({
            error: error.message
        });
    }
    if (error.message === 'No user found!') {
        return res.status(401).json({
            error: `${error.message} Please log in to update list!`
        });
    } else {
        console.log(error.message)
        return res.status(500).json({
            error: 'Something went wrong. Please try again!'
        });
    }
})

module.exports = router