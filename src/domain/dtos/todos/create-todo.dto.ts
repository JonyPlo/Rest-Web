// Un DTO (Data Transfer Object) es una clase que define la estructura de los datos que se envían a través de la API. Inclusive puede ser solo una funcion o algo que se asegure de validar la data que entra a traves de una query
export class CreateTodoDto {
  private constructor(public readonly text: string) {}

  static create(props: { [key: string]: any }): [string?, CreateTodoDto?] {
    const { text } = props

    if (!text) return ['Text property is required']

    return [undefined, new CreateTodoDto(text)]
  }
}
