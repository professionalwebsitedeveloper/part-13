const Sequelize = require('sequelize')
const { DATABASE_URL, TEST_DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')

const dbUrl = process.env.TESTING === 'true' ? TEST_DATABASE_URL : DATABASE_URL

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
});

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: '././migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  })

  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('Database connected')
  } catch (err) {
    console.log('Connecting database failed')
    console.log(err)
    return process.exit(1)
  }
  return null
}

module.exports = {
  sequelize,
  connectToDatabase
}
