const { Blog } = require('../models')

const findBlog = async (req, res, next) => {
    try {
        req.blog = await Blog.findByPk(req.params.id)
        if (!req.blog) {
            return res.status(404).end()
        }
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = findBlog
