// Esta clase es un custom error, que basicamente almacenara el mensaje de error y el status code para poder hacer que el error que se responde en una request sea dinamico
export class CustomError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500
  ) {
    super(message)
  }
}
