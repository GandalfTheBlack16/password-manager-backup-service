import { config } from 'dotenv'
import { googleDriveProviderBuilder } from './providers/googleDriveProvider'
import { GoogleDriveService } from './services/googleDriveService'
import { getMongoClient } from './providers/mongoProvider'
import { MongoRepository } from './repositories/mongoRepository'

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
  const userRepository = new MongoRepository(mongoClient, 'users')
  const userList = await userRepository.findDocuments()
  console.log(userList)

  // const googleDriveProvider = await googleDriveProviderBuilder()
  // const googleDriveRepository = new GoogleDriveService(googleDriveProvider)
  // const timestamp = Date.now()
  // await googleDriveRepository.uploadJsonFile({ prueba: 'test' }, `users-${timestamp}.json`)
  // const list = await googleDriveRepository.getFilesByName('users')
  // console.log(list)
}
