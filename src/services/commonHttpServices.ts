import { ApiUnauthorizedException, ApiUnknownException } from '../exceptions/ApiExceptions'
import { EnvVarNotFoundException } from '../exceptions/EnvironmentExceptions'
import { type ApiCredentials } from '../types'

export const authenticationService = async ({ username, password }: ApiCredentials): Promise<string> => {
  if (process.env.API_BASE_URI == null) {
    throw new EnvVarNotFoundException('Environment variable "BASE_URI" is not defined')
  }
  const uri = `${process.env.API_BASE_URI}/login`
  const headers = new Headers()
  headers.set('Content-type', 'application/json')
  const payload = {
    username,
    password
  }
  const response = await fetch(uri, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    if (response.status === 401) {
      throw new ApiUnauthorizedException(`Authentication error at ${uri}: Credentials provided may be wrong`)
    }
    throw new ApiUnknownException(`Unknown error requesting ${uri} resource. Status: ${response.statusText}`)
  }
  const { accessToken } = await response.json()
  return accessToken as string
}
