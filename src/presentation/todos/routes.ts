import { Router } from 'express'
import { TodosController } from './controller'

export class TodosRoutes {
  static get routes(): Router {
    const router = Router()
    const todosController = new TodosController()

    router
      .route('/')
      .get(todosController.getTodos)
      .post(todosController.createTodo)

    router
      .route('/:id')
      .get(todosController.getTodoById)
      .put(todosController.updateTodo)
      .delete(todosController.deleteTodo)

    return router
  }
}
