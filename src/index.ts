import { config } from 'dotenv'
import { GoogleDriveProviderBuilder } from './providers/googleDriveProvider'
import { GoogleDriveRepository } from './repositories/googleDriveRepository'
import { fetchUserList } from './services/userBackupService'

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
  const googleDriveProvider = await GoogleDriveProviderBuilder()
  const googleDriveRepository = new GoogleDriveRepository(googleDriveProvider)

  const userList = await fetchUserList()
  if (userList.length > 0) {
    const timestamp = Date.now()
    await googleDriveRepository.uploadJsonFile(userList, `users-${timestamp}.json`)
  }
}
