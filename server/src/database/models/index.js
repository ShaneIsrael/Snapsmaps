import { readdirSync } from 'node:fs'
import { basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DataTypes, Sequelize } from 'sequelize'
import configFile from '../config/database'
const env = process.env.NODE_ENV || 'development'
const config = configFile[env]

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const db = {}
const sequelize = new Sequelize(config.database, config.username, config.password, {
  dialect: config.dialect,
  host: config.host,
  port: config.port,
  dialectOptions: config.dialectOptions,
  ...config.options,
})

const files = readdirSync(__dirname).filter(
  (file) => file.indexOf('.') !== 0 && file !== basename(__filename) && file.slice(-3) === '.js',
)
const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1)

await Promise.all(
  files.map(async (file) => {
    const model = await import(`./${file}`)
    if (!model.default) {
      return
    }

    const namedModel = model.default(sequelize, DataTypes)

    db[capitalizeFirstLetter(namedModel.name)] = namedModel
  }),
)

for (const modelName of Object.keys(db)) {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
}

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
