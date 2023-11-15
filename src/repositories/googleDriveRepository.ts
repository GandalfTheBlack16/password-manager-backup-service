import { type drive_v3 } from 'googleapis'
import { EnvVarNotFoundException } from '../exceptions/EnvironmentExceptions'

export class GoogleDriveRepository {
  constructor (
    private readonly googleDriveProvider: drive_v3.Drive
  ) {}

  async uploadJsonFile (content: any, fileName: string): Promise<string | undefined> {
    const parentDirectory = process.env.DRIVE_TARGET_FOLDER_ID
    if (parentDirectory == null) {
      throw new EnvVarNotFoundException('Environment variable "DRIVE_TARGET_FOLDER_ID" is not defined')
    }
    const requestBody = {
      name: fileName,
      mimeType: 'application/json',
      parents: [parentDirectory]
    }
    const media = {
      mimeType: 'application/json',
      body: JSON.stringify(content)
    }
    try {
      const file = await this.googleDriveProvider.files.create({
        requestBody,
        media,
        fields: 'id'
      })
      return file.data?.id as string | undefined
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
