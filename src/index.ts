import { config } from 'dotenv'
import { googleDriveProviderBuilder } from './providers/googleDriveProvider'
import { GoogleDriveService } from './services/googleDriveService'
import { getMongoClient, mongoDisconnect } from './providers/mongoProvider'
import { MongoRepository } from './repositories/mongoRepository'
import { type UserEntity, type VaultEntity } from './types'

config()

main()
  .then(() => {
    console.log('Backup process finished succesfully')
    process.exit(0)
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })

async function main (): Promise<void> {
  const mongoClient = await getMongoClient()
  const googleDriveProvider = await googleDriveProviderBuilder()
  const maxItems = (process.env.BATCH_MAX_ITEMS_STORED ?? 10) as number

  const userRepository = new MongoRepository(mongoClient, 'users')
  const userList = await userRepository.findDocuments() as UserEntity[]
  const vaultRepository = new MongoRepository(mongoClient, 'vaults')
  const vaultList = await vaultRepository.findDocuments() as VaultEntity[]
  await mongoDisconnect()

  const googleDriveService = new GoogleDriveService(googleDriveProvider)
  const timestamp = Date.now()
  await googleDriveService.uploadJsonFile(userList, `users-${timestamp}.json`)
  await googleDriveService.uploadJsonFile(vaultList, `vaults-${timestamp}.json`)

  const userFiles = await googleDriveService.getFilesByName('users')
  if (userFiles.length > maxItems) {
    // Delete n-oldest files
  }
  const vaultFiles = await googleDriveService.getFilesByName('vaults')
  if (vaultFiles.length > maxItems) {
    // Delete n-oldest files
  }
}
