import { EnvVarNotFoundException } from '../../src/exceptions/EnvironmentExceptions';
import { authenticationService } from '../../src/services/commonHttpServices';
import fetchMock from 'jest-fetch-mock';
import { ApiUnauthorizedException, ApiUnknownException } from '../../src/exceptions/ApiExceptions';
import { config } from 'dotenv';
import path from 'path';

describe('Password-manager-api authenticate service', () => {
    
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    it('should throw exception if BASE_URI envar is not defined', async () => {
        try {
            await authenticationService({ username: 'test', password: 'testPassword' })
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(EnvVarNotFoundException)
        }
    })

    it('should throw exception if authentication fails', async () => {
        try {
            config({ path: path.join(__dirname, '..', 'config.env.test') })
            fetchMock.mockResponseOnce(JSON.stringify({ data: 'Unauthorized' }), {status: 401})
            await authenticationService({ username: 'test', password: 'testPassword' })
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(ApiUnauthorizedException)
        }
    })

    it('should throw exception if authentication request returns an 500 status code', async () => {
        try {
            config({ path: path.join(__dirname, '..', 'config.env.test') })
            fetchMock.mockResponseOnce(JSON.stringify({ data: 'Internal server error' }), {status: 500})
            await authenticationService({ username: 'test', password: 'testPassword' })
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(ApiUnknownException)
        }
    })

    it ('should return an access token on authentication suceed', async () => {
        config({ path: path.join(__dirname, '..', 'config.env.test') })
        fetchMock.mockResponseOnce(JSON.stringify({ accessToken: 'mockedAccessToken' }), {status: 200})
        const accessToken = await authenticationService({ username: 'test', password: 'testPassword' })
        expect(accessToken).toBeDefined()
        expect(accessToken).toBe('mockedAccessToken')
    })
})