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

  beforeEach(async () => {
    await prisma.todo.deleteMany()
  })

  const todo1 = { text: 'Hola mundo 1' }
  const todo2 = { text: 'Hola mundo 2' }

  test('should return TODOs api/todos', async () => {
    await prisma.todo.createMany({ data: [todo1, todo2] })
    const { body } = await request(testServer.app).get('/api/todos').expect(200)

    expect(body).toBeInstanceOf(Array)
    expect(body.length).toBe(2)
    expect(body[0].text).toBe(todo1.text)
    expect(body[1].text).toBe(todo2.text)
    expect(body[0].completedAt).toBeUndefined()
  })

  test('should return a TODO api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 })
    const { body } = await request(testServer.app)
      .get(`/api/todos/${todo.id}`)
      .expect(200)

    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
    })
  })

  test('should return a 404 NotFound api/todos/:id', async () => {
    const todoId = 999
    await prisma.todo.create({ data: todo1 })
    const { body } = await request(testServer.app)
      .get(`/api/todos/${todoId}`)
      .expect(404)

    expect(body).toEqual({ error: `Todo with id ${todoId} not found` })
  })

  test('should return a new TODO api/todos', async () => {
    const { body } = await request(testServer.app)
      .post('/api/todos')
      .send(todo1)
      .expect(201)

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo1.text,
    })
  })

  test('should return an error if text property is not provided TODO api/todos', async () => {
    const { body } = await request(testServer.app)
      .post('/api/todos')
      .send({})
      .expect(400)

    expect(body).toEqual({ message: 'Text property is required' })
  })

  test('should return an error if text property is empty TODO api/todos', async () => {
    const { body } = await request(testServer.app)
      .post('/api/todos')
      .send({ text: '' })
      .expect(400)

    expect(body).toEqual({ message: 'Text property is required' })
  })

  test('should return an updated TODO api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 })
    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ text: 'Hello world updated', completedAt: '2023-10-21' })
      .expect(200)

    expect(body).toEqual({
      id: expect.any(Number),
      text: 'Hello world updated',
      completedAt: '2023-10-21T00:00:00.000Z',
    })
  })

  test('should return 404 if TODO not found api/todos/:id', async () => {
    const todoId = 999
    const { body } = await request(testServer.app)
      .put(`/api/todos/${todoId}`)
      .send({ text: 'Hello world updated', completedAt: '2023-10-21' })
      .expect(404)

    expect(body).toEqual({ error: `Todo with id ${todoId} not found` })
  })

  test('should return an updated TODO only the date api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 })
    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ completedAt: '2023-10-21' })
      .expect(200)

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo.text,
      completedAt: '2023-10-21T00:00:00.000Z',
    })
  })

  test('should delete a TODO api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 })
    const { body } = await request(testServer.app)
      .delete(`/api/todos/${todo.id}`)
      .expect(200)

    expect(body).toEqual({ id: expect.any(Number), text: 'Hola mundo 1' })
  })

  test('should return 404 if TODO do not exist api/todos/:id', async () => {
    const { body } = await request(testServer.app)
      .delete(`/api/todos/999`)
      .expect(404)

    expect(body).toEqual({ error: 'Todo with id 999 not found' })
  })
})
