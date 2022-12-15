// Array que armzena um conj. de alunos
alunos = [];
// Aluno(nome, matricula, curso)
aluno01 = {
  nome: 'Joãozinho',
  matricula: '2020@Inf123',
  curso: 'Informática'
}
// push adiciona um elemento no final do array
alunos.push(aluno01);
console.log(alunos);
// [Joãozinho]

aluno02 = {
  nome: 'Mariazinha',
  matricula: '2020@Inf234',
  curso: 'Informática'
};
alunos.push(aluno02);
console.log(alunos);
// [Joãozinho, Mariazinha]

// pop = remove e retona o último elemento do array
ultAluno = alunos.pop();
console.log('Removendo', ultAluno);
