require('express-async-errors')


const express = require('express')
const { errorHandler } = require('./util/middleware')

const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase, sequelize } = require('./util/db')
const { Blog, User, List, Session } = require('./models')

const blogsRouter = require('./controllers/blogs')
const authorsRouter = require('./controllers/authors')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logoutRouter = require('./controllers/logout')
const listRouter = require('./controllers/lists')

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).send('OK')
})

app.post('/api/reset', async (req, res) => {
  await sequelize.query('TRUNCATE TABLE sessions, lists, blogs, users RESTART IDENTITY CASCADE')
  res.status(200).json({ reset: true })
})

app.use('/api/blogs', blogsRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/readinglist', listRouter)
app.use('/api/readinglists', listRouter)

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()

module.exports = app
