import { Request, Response } from 'express'
import { prisma } from '../../data/postgres'
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos'

export class TodosController {
  constructor() {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany()

    return res.json(todos)
  }

  public getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id
    console.log(id)

    if (isNaN(id))
      return res.status(400).json({ message: 'Id argument is not a number' })

    const todo = await prisma.todo.findUnique({
      where: { id },
    })

    todo
      ? res.json(todo)
      : res.status(404).json({ message: `Todo with id ${id} not found` })
  }

  public createTodo = async (req: Request, res: Response) => {
    // En este caso la clase CreateTodoDto funciona como un adapter, es decir, recibe el objeto de la query, valida los datos y adapta el objeto a uno valido para poder almacenarlo en la base de datos
    const [errorMessage, createTodoDto] = CreateTodoDto.create(req.body)

    if (errorMessage) return res.status(400).json({ message: errorMessage })

    const todo = await prisma.todo.create({ data: createTodoDto! })

    res.json(todo)
  }

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id
    const [errorMessage, updateTodoDto] = UpdateTodoDto.create({
      ...req.body,
      id,
    })

    if (errorMessage) return res.status(400).json({ errorMessage })

    const todo = await prisma.todo.findFirst({
      where: { id },
    })

    if (!todo)
      return res.status(404).json({ message: `Todo with id ${id} not found` })

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: updateTodoDto!.values,
    })

    res.json(updatedTodo)
  }

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id

    if (isNaN(id))
      return res.status(400).json({ message: 'Id argument is not a number' })

    try {
      await prisma.todo.delete({
        where: { id },
      })

      res.json({ message: `Todo with id ${id} deleted` })
    } catch (error) {
      console.log(error)

      res.status(400).json({ message: `Todo with id ${id} not found` })
    }
  }
}
