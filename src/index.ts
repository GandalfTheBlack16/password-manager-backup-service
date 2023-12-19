import { config } from 'dotenv'
import { googleDriveProviderBuilder } from './providers/googleDriveProvider'
import { GoogleDriveService } from './services/googleDriveService'
import { getMongoClient, mongoDisconnect } from './providers/mongoProvider'
import { MongoRepository } from './repositories/mongoRepository'
import { type UserEntity, type VaultEntity } from './types'
import { logger } from './providers/loggerProvider'
import { sendConfirmationEmail } from './services/sendConfirmationEmail'
import { SendEmailException, UnknownEmailException } from './exceptions/ApiExceptions'

config()

main()
  .then(async ({ users, vaults, credentials, date }) => {
    logger.info('Backup process finished succesfully')
    logger.info('Sending confirmation email...')
    await sendConfirmationEmail(users, vaults, credentials, date)
  })
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    logger.error(err)
    if (err instanceof SendEmailException || err instanceof UnknownEmailException) {
      logger.warn('Confirmation email could not send to some recipients but backup process finished successfully')
      process.exit(0)
    }
    process.exit(1)
  })

async function main (): Promise<{ users: number, vaults: number, credentials: number, date: Date }> {
  const mongoClient = await getMongoClient()
  const googleDriveProvider = await googleDriveProviderBuilder()

  const userRepository = new MongoRepository(mongoClient, 'users')
  logger.info('Fetching users data...')
  const userList = await userRepository.findDocuments() as UserEntity[]
  logger.info(`Fetched data from ${userList.length} users`)
  const vaultRepository = new MongoRepository(mongoClient, 'vaults')
  logger.info('Fetching vaults data...')
  const vaultList = await vaultRepository.findDocuments() as VaultEntity[]
  const credentials = vaultList.map(vault => vault.credentials.length).reduce((cont, a) => cont + a, 0)
  logger.info(`Fetched ${credentials} credential data from ${vaultList.length} vaults`)
  await mongoDisconnect()

  const googleDriveService = new GoogleDriveService(googleDriveProvider)
  const timestamp = Date.now()
  await googleDriveService.uploadJsonFile(userList, `users-${timestamp}.json`)
  await googleDriveService.uploadJsonFile(vaultList, `vaults-${timestamp}.json`)

  return {
    users: userList.length,
    vaults: vaultList.length,
    credentials,
    date: new Date(timestamp)
  }
}
