import { type drive_v3 } from 'googleapis'
import { EnvVarNotFoundException } from '../exceptions/EnvironmentExceptions'
import { ApiDeleteException, ApiFetchException, ApiUploadException } from '../exceptions/ApiExceptions'
import { type GoogleApiFileEntity } from '../types'

export class GoogleDriveService {
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
      throw new ApiUploadException(`Cannot upload file ${fileName} to Drive. Cause: ${(error as Error).stack}`)
    }
  }

  async getFilesByName (filePreffix: string): Promise<GoogleApiFileEntity[]> {
    try {
      const fileList: GoogleApiFileEntity[] = []
      const res = await this.googleDriveProvider.files.list({
        q: `name contains '${filePreffix}'`,
        fields: 'files(id, name, createdTime)'
      })

      res.data.files?.forEach(file => {
        const { id, name, createdTime } = file
        if (id != null && name != null) {
          fileList.push({
            id,
            name,
            createdTime: new Date(createdTime as string)
          })
        }
      })
      return fileList
    } catch (error) {
      throw new ApiFetchException(`Error fetching files from Drive. Cause: ${(error as Error).stack}`)
    }
  }

  async removeFileById (id: string): Promise<void> {
    try {
      await this.googleDriveProvider.files.delete({
        fileId: id
      })
    } catch (error) {
      throw new ApiDeleteException(`Error deleting file ${id} from Drive. Cause: ${(error as Error).stack}`)
    }
  }
}
