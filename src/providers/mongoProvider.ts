import { type Db, MongoClient } from 'mongodb'
import { DatabaseConnectionException } from '../exceptions/DatabaseExceptions'
import { config } from 'dotenv'

config()

const url = process.env.DATABASE_URI ?? 'mongodb://localhost:27017'
const username = process.env.DATABASE_USER ?? 'root'
const password = process.env.DATABASE_PWD ?? 'example'
const database = process.env.DATABASE_NAME ?? 'password-manager'

const client = new MongoClient(url, {
  auth: {
    username,
    password
  }
})

export async function getMongoClient (): Promise<Db> {
  try {
    await client.connect()
    console.log(`Connected to ${url}`)
    return client.db(database)
  } catch (error) {
    throw new DatabaseConnectionException(`Cannot perform database connection to ${url}: ${(error as Error).stack}`)
  }
}

export async function mongoDisconnect (): Promise<void> {
  try {
    await client.close()
    console.log(`Disconnected from ${url}`)
  } catch (error) {
    throw new DatabaseConnectionException(`Cannot disconnect from database ${url}: ${(error as Error).stack}`)
  }
}
