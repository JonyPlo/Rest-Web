import { Request, Response } from 'express'
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos'
import {
  GetTodos,
  TodoRepository,
  UpdateTodo,
  GetTodo,
  CreateTodo,
  DeleteTodo,
} from '../../domain'

// La aplicacion de esta arquitectura se llama Domain Driven Design (DDD) y Repository Pattern (RP), quiere decir que todo esta hecho basado en repositorios, datasources, separacion de responsabilidad unica, y todo lo que esta implementado
//* Aqui SI estamos aplicando casos de uso (use cases)

export class TodosController {
  // Inyectamos en el constrolador de los todos, la implementacion del repositorio de los todos para poder dar de alta todos, editarlos, etc
  constructor(private readonly todoRepository: TodoRepository) {}

  public getTodos = (req: Request, res: Response) => {
    new GetTodos(this.todoRepository)
      .execute()
      .then((todos) => res.json(todos))
      .catch((error) => res.status(400).json({ error }))
  }

  public getTodoById = (req: Request, res: Response) => {
    const id = +req.params.id

    new GetTodo(this.todoRepository)
      .execute(id)
      .then((todo) => res.json(todo))
      .catch((error) => res.status(400).json({ error }))
  }

  public createTodo = (req: Request, res: Response) => {
    // En este caso la clase CreateTodoDto funciona como un adapter, es decir, recibe el objeto de la query, valida los datos y adapta el objeto a uno valido para poder almacenarlo en la base de datos
    const [errorMessage, createTodoDto] = CreateTodoDto.create(req.body)
    if (errorMessage) return res.status(400).json({ message: errorMessage })

    new CreateTodo(this.todoRepository)
      .execute(createTodoDto!)
      .then((todo) => res.json(todo))
      .catch((error) => res.status(400).json({ error }))
  }

  public updateTodo = (req: Request, res: Response) => {
    const id = +req.params.id
    const [errorMessage, updateTodoDto] = UpdateTodoDto.create({
      ...req.body,
      id,
    })

    if (errorMessage) return res.status(400).json({ errorMessage })

    new UpdateTodo(this.todoRepository)
      .execute(updateTodoDto!)
      .then((todo) => res.json(todo))
      .catch((error) => res.status(400).json({ error }))
  }

  public deleteTodo = (req: Request, res: Response) => {
    const id = +req.params.id

    new DeleteTodo(this.todoRepository)
      .execute(id)
      .then((todo) => res.json(todo))
      .catch((error) => res.status(400).json({ error }))
  }
}
