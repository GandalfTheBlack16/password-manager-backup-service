import { ApiUnauthorizedException, ApiUnknownException } from '../exceptions/ApiExceptions'
import { EnvVarNotFoundException } from '../exceptions/EnvironmentExceptions'
import { type UserEntity } from '../types'
import { authenticationService } from './commonHttpServices'

export const fetchUserList = async (): Promise<UserEntity[]> => {
  const username = process.env.APP_JOB_USERNAME
  if (username == null) {
    throw new EnvVarNotFoundException('Environment variable "APP_JOB_USERNAME" is not defined')
  }
  const password = process.env.APP_JOB_PASSWORD
  if (password == null) {
    throw new EnvVarNotFoundException('Environment variable "APP_JOB_PASSWORD" is not defined')
  }

  if (process.env.API_BASE_URI == null) {
    throw new EnvVarNotFoundException('Environment variable "BASE_URI" is not defined')
  }

  const accessToken = await authenticationService({ username, password })
  const uri = `${process.env.API_BASE_URI}/api/users`
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${accessToken}`)

  const response = await fetch(uri, {
    headers
  })
  if (!response.ok) {
    if (response.status === 401) {
      throw new ApiUnauthorizedException(`Authentication error at ${uri}: Access token could be expired`)
    }
    if (response.status === 403) {
      throw new ApiUnauthorizedException(`Authorization error at ${uri}: Not enought privileges`)
    }
    throw new ApiUnknownException(`Unknown error requesting ${uri} resource. Status: ${response.statusText}`)
  }

  const { userList } = await response.json()
  return userList as UserEntity[]
}
