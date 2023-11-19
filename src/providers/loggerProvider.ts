import { config } from 'dotenv'
import { createLogger, format, transports } from 'winston'

config()

export const logger = createLogger({
  level: process.env.LOGGER_LEVEL ?? 'info',
  format: format.colorize(),
  transports: [
    new transports.Console({
      format: format.cli()
    })
  ]
})
