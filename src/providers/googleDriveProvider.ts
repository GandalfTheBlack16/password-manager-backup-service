import { writeFile } from 'fs/promises'
import { type drive_v3, google } from 'googleapis'
import path from 'path'

export const GoogleDriveProviderBuilder = async (): Promise<drive_v3.Drive> => {
  const credentialsContent = {
    type: 'service_account',
    project_id: 'password-manager-backup',
    private_key_id: '3ae7b8233f6d03e6dc27412502e687a2e117b37e',
    private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCYCWySvsLxyrKL\nav5MFmWTzGJrnTYiils0u4f11zJitjhKB+fIzfdfFzLqCl7ybaCkhDgc9HnhJeP2\n0jRQ2xb181X9fckv7xc+DjQpL0912+2Iwibf4MuGVwGAsIqCnWP43KwVbolvf3zm\ngOw67VxcG3u9ptYIp+vM3oTGE38UPOWzmDWNf9Gt+eU2oCJlTlaZEla+uC9wBXTj\ncl0GUQXFXUun6AqRSdU6MU5RoICmz4ITHZ70354NheKd1P8mr0cdcjhAhx4nK/mx\nLwxhW7nDZmO3J7l/5don6tQ20Em9t7TUJsNPEZ0RvDYikmdLQ85sPenZN63GiTbc\nEzQyZRxvAgMBAAECggEAF1oLNRbbtmudtNBAMsuV2nef/kttTyzVCWpsXZQqBwNZ\n7fT84tjPz+kuRshFARNZgytTuw7J0Y0SUIzEwE6GXkx7vq2dQyGD/mIMHO9JUx7u\ngvzfH6/VUtL2Rh/XhmxKOKUcQUZzEY8RTg4rOnnOn88Q2HZRlY7FJvheiFXiROdA\n/MrTvToAIlq2aWaP/+CxRC3UHE4Nt041Hv3rkRGMgYHfVeAiCfJsRsZ1AYQBhOay\naKsGKcHp8DvRemwIkkCz0yHe1GT4v/vzgy6COW7tfRkt0sYAkqm1J3MXue0nP3SC\naCRNYu9R75qEpgyPOq+aACLfhewvt9DtqxpL4n5GYQKBgQDH0c+4d9JnRI7fW00r\noux2kGLijPhVAfzVf3qso1HsiOXUlKDMk0U36k0Cdd1bvKsLQ4WiXNbMQ36pZiUu\nx9C3gKUQVTfk3CdhYqYHe9sjQra9Xb+r6UZbob45+OWCQ5gUP+JzPV0fQag1k7hL\nXWohnqH5IDu5xVtd05xfzzodtwKBgQDCyGgWVmInG/snHn20hdYSKflAKCHEN+qA\nBxAW9HCjdV/Ks97R51IgQdWnKRnkckz4OdARob9hEfTeayyCCEQVitqizPLTPCXS\nd3r+5V8LfWnxOQKlc8Ya2f4IIjl8ve6L9mq6MQT8zCZonKgGr+BfI9pPATgIc7WE\nFsIIZsZ3CQKBgBz7v+d/6dL0zMx1D9J+hVIFS3KVBAhAi43kOcUEw4NNsBiPnmtO\nCUI9CAKNWhhOW3j8yEtur/Fc8OhdWpNYhFu5mzetRLg7frLPfkmjm3uX163MBVtI\nMN5lrZP3GEM2zr5RLeWNRw6blWyACsFTwWsy+UeLd15Q1Bnd8dar1kAtAoGAM1iY\n96p13VFm93z2LixJrigaaGsr24nR60XxW9u8BZrfUZPw3OxZnd887v/Kr4nh+F1l\nGADHblNJdYhTB0Qejn83+0qDiGOGpOCSL7dPQrwgvVIF/I90XYexi3taJCP9Si//\nGm3pnqpCRblmIb0jLHFLDyCHINM/uj41j/lnv+ECgYBoD1QSXdig9OUzRMu+o7Nz\nxpthHCV9bGx/L1iz1A2G3uBQug4c1n1HPTr2S53gAkNBhrBfrnKzp2ImKsB+URbi\nkPFOhjhHJPIglaWB1Tvul8EWM4LxvtM0nKrp5VsmG03/G2EOCWop2lZheDdGEvWu\ndlDNcoDICoLkZ9b0yIQEZA==\n-----END PRIVATE KEY-----\n',
    client_email: 'drive-owner@password-manager-backup.iam.gserviceaccount.com',
    client_id: '114149314932536358148',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/drive-owner%40password-manager-backup.iam.gserviceaccount.com',
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
