export enum JobReturnCodes {
  SUCCESS = 0,
  API_COMMUNICATION_ERROR = 1,
}

export interface ApiCredentials {
  username: string
  password: string
}

export interface UserEntity {
  id: string
  email: string
  username: string
  password: string
}

export interface GoogleApiCredentialProps {
  privateKeyId: string
  privateKey: string
  clientEmail: string
  clientId: string
  clientCertUrl: string
}
