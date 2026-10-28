require('dotenv').config()

const { connectToDatabase, sequelize } = require('./utils/db')
const { QueryTypes } = require('sequelize')

const main = async () => {
  // Run (and log suppressed) migrations/connection so the output stays clean.
  const originalLog = console.log
  console.log = () => {}
  try {
    await connectToDatabase()
  } finally {
    console.log = originalLog
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
