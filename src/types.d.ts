export interface ApiCredentials {
  username: string
  password: string
}

export interface UserEntity {
  _id: string
  email: string
  username: string
  password: string
}

export interface VaultEntity {
  _id: string
  credentials: CredentialEntity[]
  lastModified: Date
  owner: string
}

export interface CredentialEntity {
  _id: string
  name: string
  secret: string
  description?: string
}

export interface GoogleApiCredentialProps {
  privateKeyId: string
  privateKey: string
  clientEmail: string
  clientId: string
  clientCertUrl: string
}

export interface GoogleApiFileEntity {
  id: string
  name: string
  createdTime: Date
}
