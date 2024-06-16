// Tener en cuenta que una entidad no esta reflejado a lo que se almacena en la base de datos, si se asemeja mucho a lo que vamos a almacenar en ella, sin embargo esto es lo que vamos a usar en la aplicacion

export class TodoEntity {
  constructor(
    public id: number,
    public text: string,
    public completedAt?: Date | null
  ) {}

  get isCompleted() {
    return Boolean(this.completedAt)
  }

  public static fromObject(obj: { [key: string]: any }): TodoEntity {
    const { id, text, completedAt } = obj

    if (!id) throw 'Id is required'
    if (!text) throw 'Id is required'

    let newCompletedAt

    if (completedAt) {
      newCompletedAt = new Date(completedAt)

      if (isNaN(newCompletedAt.getTime())) {
        throw 'CompletedAt is not a valid date'
      }
    }

    return new TodoEntity(id, text, newCompletedAt)
  }
}
