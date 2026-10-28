require('dotenv').config()

const { connectToDatabase, sequelize } = require('./util/db')
const { QueryTypes } = require('sequelize')

const main = async () => {
  // Run (and log suppressed) migrations/connection so the output stays clean.
  const originalLog = console.log
  const originalInfo = console.info
  const originalSequelizeLogging = sequelize.options.logging
  console.log = () => {}
  console.info = () => {}
  sequelize.options.logging = () => {}
  try {
    await connectToDatabase()
  } finally {
    console.log = originalLog
    console.info = originalInfo
    sequelize.options.logging = originalSequelizeLogging
  }

  const blogs = await sequelize.query('SELECT * FROM blogs', { type: QueryTypes.SELECT })

  blogs.forEach((blog) => {
    console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
  })

  await sequelize.close()
}

main().catch((error) => {
  console.error('Unable to connect to the database:', error)
  process.exit(1)
})
