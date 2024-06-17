import request from 'supertest'
import { testServer } from '../../test-server'
import { prisma } from '../../../src/data/postgres'

describe('tests in todo routes', () => {
  beforeAll(async () => {
    await testServer.start()
  })

  afterAll(async () => {
    // Creamos un metodo "close()" en la clase Server para cerrar la conexion en el servidor despues de cada prueba, hacemos esto porque si no lo agregamos, jest nos mostrara un warning indicando un proceso no se termino de manera completa y quedaron funciones corriendo, etc
    await testServer.close()
  })

  const todo1 = { text: 'Hola mundo 1' }
  const todo2 = { text: 'Hola mundo 2' }

  test('should return TODOs api/todos', async () => {
    await prisma.todo.deleteMany()
    await prisma.todo.createMany({ data: [todo1, todo2] })

    const { body } = await request(testServer.app).get('/api/todos').expect(200)

    expect(body).toBeInstanceOf(Array)
    expect(body.length).toBe(2)
    expect(body[0].text).toBe(todo1.text)
    expect(body[1].text).toBe(todo2.text)
    expect(body[0].completedAt).toBeNull()
  })
})
