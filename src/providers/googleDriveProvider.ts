import { writeFile } from 'fs/promises'
import { type drive_v3, google } from 'googleapis'
import path from 'path'
import { EnvVarNotFoundException } from '../exceptions/EnvironmentExceptions'
import { type GoogleApiCredentialProps } from '../types'

const loadProperties = (): GoogleApiCredentialProps => {
  const privateKeyId = process.env.DRIVE_PRIVATE_KEY_ID
  const privateKey = process.env.DRIVE_PRIVATE_KEY
  const clientEmail = process.env.DRIVE_CLIENT_EMAIL
  const clientId = process.env.DRIVE_CLIENT_ID
  const clientCertUrl = process.env.DRIVE_CLIENT_CERT_URL

  if (privateKeyId == null) {
    throw new EnvVarNotFoundException('Environment variable "DRIVE_PRIVATE_KEY_ID" is not defined')
  }
  if (privateKey == null) {
    throw new EnvVarNotFoundException('Environment variable "DRIVE_PRIVATE_KEY" is not defined')
  }
  if (clientEmail == null) {
    throw new EnvVarNotFoundException('Environment variable "DRIVE_CLIENT_EMAIL" is not defined')
  }
  if (clientId == null) {
    throw new EnvVarNotFoundException('Environment variable "DRIVE_CLIENT_ID" is not defined')
  }
  if (clientCertUrl == null) {
    throw new EnvVarNotFoundException('Environment variable "DRIVE_CLIENT_CERT_URL" is not defined')
  }

  return {
    privateKeyId,
    privateKey,
    clientEmail,
    clientId,
    clientCertUrl
  }
}

export const GoogleDriveProviderBuilder = async (): Promise<drive_v3.Drive> => {
  const {
    privateKeyId,
    privateKey,
    clientEmail,
    clientId,
    clientCertUrl
  } = loadProperties()

  const credentialsContent = {
    type: 'service_account',
    project_id: 'password-manager-backup',
    private_key_id: privateKeyId,
    private_key: privateKey,
    client_email: clientEmail,
    client_id: clientId,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: clientCertUrl,
    universe_domain: 'googleapis.com'
  }

  const credentialsPath = path.join(__dirname, 'credentials.json')

  await writeFile(credentialsPath, JSON.stringify(credentialsContent), 'utf-8')

  return google.drive({
    version: 'v3',
    auth: new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/drive']
    })
  })
}
