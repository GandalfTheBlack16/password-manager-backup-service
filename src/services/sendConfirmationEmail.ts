import { config } from 'dotenv'
import { SendEmailException, UnknownEmailException } from '../exceptions/ApiExceptions'
import { logger } from '../providers/loggerProvider'

config()

export const sendConfirmationEmail = async (users: number, vaults: number, date: Date): Promise<void> => {
  const endpoint = process.env.SEND_EMAIL_SERVICE_ENDPOINT ?? 'http://localhost:3000/email'
  const recipients = process.env.SEND_EMAIL_RECIPIENTS?.split(',')
  const subject = 'Password-manager backup performed successfully'
  const formattedDate = date.toLocaleString().replace(', ', ' at ')
  const content = setHtmlContent(users, vaults, formattedDate)
  const headers = new Headers()
  headers.set('Content-type', 'application/json')
  logger.debug(`Sending email POST request to ${endpoint}`)
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        recipients,
        subject,
        content
      })
    })
    const data = await response.json()
    logger.debug(JSON.stringify(data))
    if (!response.ok) {
      logger.debug(JSON.stringify(response))
      if (response.status === 404) {
        throw new SendEmailException(`Could not send email because of invalid recipients: ${data.adresses}`)
      }
      throw new SendEmailException(`Could not send email: ${data.message}`)
    }
    if (response.status === 206) {
      logger.warn(`Email sended to ${data.accepted} but cannot deliver to ${data.rejected}`)
      return
    }
    logger.info(`Email sended to ${data.addresses}`)
  } catch (error) {
    if (error instanceof SendEmailException) {
      throw error
    }
    throw new UnknownEmailException(`Could not send email: ${(error as Error).stack}`)
  }
}

const setHtmlContent = (users: number, vaults: number, date: string): string => {
  return `
    <div style="background-color: #133d64; color: white; padding: 2rem; font-family: Poppins,sans-serif; width: 30%; border-radius: 10px;">
        <img src="https://password-manager.up.railway.app/assets/logo-no-background-0210caf7.png" alt="password-manager-logo" width="350px">
        <h1>Backup on ${date}</h1>
        <h2>Users proccessed: ${users}</h2>
        <h2>Vaults proccessed: ${vaults}</h2>
    </div>
    `
}
