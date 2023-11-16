import { type Db } from 'mongodb'
import { type VaultEntity, type UserEntity } from '../types'
import { FindDocumentsException } from '../exceptions/DatabaseExceptions'

export class MongoRepository {
  constructor (
    private readonly mongoClient: Db,
    private readonly collectionName: string
  ) {}

  async findDocuments (): Promise<UserEntity[] | VaultEntity[]> {
    try {
      const collection = this.mongoClient.collection(this.collectionName)
      return await collection.find({}).toArray() as unknown as UserEntity[] | VaultEntity[]
    } catch (error) {
      throw new FindDocumentsException(`Error finding documents from collection ${this.collectionName}: ${(error as Error).stack}`)
    }
  }
}
