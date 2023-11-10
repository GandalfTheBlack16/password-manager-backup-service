import { greet } from '../../src/services/helloService'

describe('Hello service test', () => {
  it('should return greet message', () => {
    const helloMessage = greet()
    expect(helloMessage).toBeDefined()
    expect(helloMessage).toBe('Hello from hello-service')
  })
})
