import { config } from 'dotenv'
import { googleDriveProviderBuilder } from './providers/googleDriveProvider'
import { GoogleDriveService } from './services/googleDriveService'
import { getMongoClient, mongoDisconnect } from './providers/mongoProvider'
import { MongoRepository } from './repositories/mongoRepository'
import { type UserEntity, type VaultEntity } from './types'
import { logger } from './providers/loggerProvider'

config()

main()
  .then(() => {
    logger.info('Backup process finished succesfully')
    process.exit(0)
  })
  .catch((err) => {
    logger.error(err)
    process.exit(1)
  })

async function main (): Promise<void> {
  const mongoClient = await getMongoClient()
  const googleDriveProvider = await googleDriveProviderBuilder()

  const userRepository = new MongoRepository(mongoClient, 'users')
  logger.info('Fetching users data...')
  const userList = await userRepository.findDocuments() as UserEntity[]
  logger.info(`Fetched data from ${userList.length} users!`)
  const vaultRepository = new MongoRepository(mongoClient, 'vaults')
  logger.info('Fetching vaults data...')
  const vaultList = await vaultRepository.findDocuments() as VaultEntity[]
  logger.info(`Fetched data from ${vaultList.length} vaults!`)
  await mongoDisconnect()

  const googleDriveService = new GoogleDriveService(googleDriveProvider)
  const timestamp = Date.now()
  await googleDriveService.uploadJsonFile(userList, `users-${timestamp}.json`)
  await googleDriveService.uploadJsonFile(vaultList, `vaults-${timestamp}.json`)
}
