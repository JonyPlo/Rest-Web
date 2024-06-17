import { Request, Response } from 'express'
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos'
import { TodoRepository } from '../../domain'

// La aplicacion de esta arquitectura se llama Domain Driven Design (DDD) y Repository Pattern (RP), quiere decir que todo esta hecho basado en repositorios, datasources, separacion de responsabilidad unica, y todo lo que esta implementado
//! Aqui no estamos aplicando casos de uso (use cases)

export class TodosController {
  // Inyectamos en el constrolador de los todos, la implementacion del repositorio de los todos para poder dar de alta todos, editarlos, etc
  constructor(private readonly todoRepository: TodoRepository) {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await this.todoRepository.getAll()
    return res.json(todos)
  }

  public getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id

    try {
      const todo = await this.todoRepository.findById(id)
      res.json(todo)
    } catch (error) {
      res.status(400).json({ error })
    }
  }

  public createTodo = async (req: Request, res: Response) => {
    // En este caso la clase CreateTodoDto funciona como un adapter, es decir, recibe el objeto de la query, valida los datos y adapta el objeto a uno valido para poder almacenarlo en la base de datos
    const [errorMessage, createTodoDto] = CreateTodoDto.create(req.body)
    if (errorMessage) return res.status(400).json({ message: errorMessage })

    const todo = await this.todoRepository.create(createTodoDto!)
    res.json(todo)
  }

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id
    const [errorMessage, updateTodoDto] = UpdateTodoDto.create({
      ...req.body,
      id,
    })

    if (errorMessage) return res.status(400).json({ errorMessage })
    const updatedTodo = await this.todoRepository.updateById(updateTodoDto!)
    res.json(updatedTodo)
  }

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id
    const deletedTodo = await this.todoRepository.deleteById(id)
    res.json(deletedTodo)
  }
}
