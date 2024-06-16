import { Router } from 'express'
import { TodosController } from './controller'
import { TodoDatasourceImpl } from '../../infrastructure/datasources/todo.datasource.impl'
import { TodoRepositoryImpl } from '../../infrastructure/repositories/todo.repository.impl'

export class TodosRoutes {
  static get routes(): Router {
    const router = Router()

    const postgresTodoDatasource = new TodoDatasourceImpl()
    const todoRepository = new TodoRepositoryImpl(postgresTodoDatasource)

    const todosController = new TodosController(todoRepository)

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
