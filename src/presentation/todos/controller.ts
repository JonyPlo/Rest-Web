import { Request, Response } from 'express'

const todos = [
  { id: 1, text: 'Buy Milk', createdAt: new Date() },
  { id: 2, text: 'Buy Eggs', createdAt: null },
  { id: 3, text: 'Buy Bread', createdAt: new Date() },
]

export class TodosController {
  constructor() {}

  public getTodos = (req: Request, res: Response) => {
    return res.json(todos)
  }

  public getTodoById = (req: Request, res: Response) => {
    const id = +req.params.id

    if (isNaN(id))
      return res.status(400).json({ message: 'Id argument is not a number' })

    const todo = todos.find((todo) => todo.id === id)

    todo
      ? res.json(todo)
      : res.status(404).json({ message: `Todo with id ${id} not found` })
  }

  public createTodo = (req: Request, res: Response) => {
    const { text } = req.body

    if (!text) return res.status(400).json({ message: 'Text is required' })

    const newTodo = { id: todos.length + 1, text, createdAt: null }

    todos.push(newTodo)

    res.json(newTodo)
  }
}
