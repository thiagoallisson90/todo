/*
 * Atributos: _nome, _matricula, _curso
 * Métodos: getters e setters
 */
class Aluno {
  constructor(nome='', matricula='', curso='') {
    this._nome = nome;
    this._matricula = matricula;
    this._curso = curso;
    console.log('Objeto criado');
  }

  get nome() {
    return this._nome;
  }
  set nome(nome) {
    this._nome = nome;
  }

  get matricula() {
    return this._matricula;
  }
  set matricula(matricula) {
    this._matricula = matricula
  }

  get curso() {
    return this._curso;
  }
  set curso(curso) {
    this._curso = curso;
  }
}

aluno01 = new Aluno('Joãozinho', '2020@123Inf', 'Informática');
console.log(aluno01);