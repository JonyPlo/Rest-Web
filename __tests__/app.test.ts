import { envs } from '../src/config/envs'
import { Server } from '../src/presentation/server'

jest.mock('../src/presentation/server')

describe('tests in App.ts', () => {
  test('should call server with arguments and start', async () => {
    // La linea `await import('../src/app')` importa dinámicamente el módulo `../src/app`. El propósito principal de esto es ejecutar el código contenido en `../src/app.`
    await import('../src/app')

    expect(Server).toHaveBeenCalledTimes(1)
    expect(Server).toHaveBeenCalledWith({
      port: envs.PORT,
      public_path: envs.PUBLIC_PATH,
      routes: expect.any(Function),
    })

    expect(Server.prototype.start).toHaveBeenCalled()
  })
})
