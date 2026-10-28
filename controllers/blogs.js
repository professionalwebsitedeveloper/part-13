const router = require('express').Router()
const { Blog, User } = require('../models')
const { Op } = require("sequelize");
const userFinder = require('../util/findUser');
const blogFinder = require('../util/findBlog');

const currentYear = new Date().getFullYear();

router.get('/', async (req, res) => {
    const where = {}
    if (req.query.search) {
        where[Op.or] = [
            { title: { [Op.iLike]: `%${req.query.search}%` } },
            { author: { [Op.iLike]: `%${req.query.search}%` } }
        ]
    }
    const blogs = await Blog.findAll({
        attributes: {
            exclude: ['userId']
        },
        include: {
            model: User,
            attributes: ['name']
        },
        where,
        order: [
            ['likes', 'DESC'],
        ]
    })
    res.json(blogs)
})

router.post('/', userFinder, async (req, res) => {
    if (!req.user) {
        throw Error('No user found!')
    }
    if (!req.body.uri || !req.body.title) {
        throw Error('Posting a blog failed!')
    }
    const year = req.body.year || currentYear
    if (year < 1991 || year > currentYear ) {
        throw Error('The year should be at least 1991 and no greater than current year!')
    }
    const blog = await Blog.create({
        ...req.body,
        year,
        userId: req.user.id
    })
    return res.json(blog)
})

router.put('/:id', blogFinder, async (req, res) => {
    if (req.body.likes === undefined || req.body.likes === null) {
        throw Error('Amount of likes missing!')
    }
    console.log(`Liking blog ${req.params.id}`)
    const updated = await req.blog.update({
        likes: req.body.likes
    })
    return res.json(updated);
})

router.delete('/:id', userFinder, blogFinder, async (req, res) => {
    if (!req.user) {
        throw Error('No user found!')
    }
    if (!(req.blog.userId == req.user.id)) {
        throw Error('Only author can delete!')
    }
    await req.blog.destroy()
    const blogs = await Blog.findAll({
        order: [
            ['likes', 'DESC'],
        ]
    });
    res.status(200).json(blogs);
})

router.use('/', (req, res, next) => {
    throw Error('Endpoint not found!')
});

module.exports = router
