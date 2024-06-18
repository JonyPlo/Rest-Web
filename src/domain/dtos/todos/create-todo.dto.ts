// Un DTO (Data Transfer Object) es una clase que define la estructura de los datos que se envían a través de la API. Inclusive puede ser solo una funcion o algo que se asegure de validar la data que entra a traves de una query
export class CreateTodoDto {
  // Cuando un constructor de una clase es privado "private constructor(){}" quiere decir que solo se pueden hacer instancias de la misma clase solo dentro de ella a traves de algun metodo estatico, es decir, tenemos prohibido hacer esto fuera de la clase "new CreateTodoDto()", solamente a traves de algun metodo estatico dentro de la misma clase como por ejemplo "static create(){ return new CreateTodoDto() }" y luego usar el metodo estatico para realizar la instancia "CreateTodoDto.create()"
  private constructor(public readonly text: string) {}

  static create(props: { [key: string]: any }): [string?, CreateTodoDto?] {
    const { text } = props

    if (!text || test.length === 0) return ['Text property is required']

    return [undefined, new CreateTodoDto(text)]
  }
}
