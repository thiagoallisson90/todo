//         0  1   2   3   4  5
numeros = [1, 10, 12, -3, 1, 9];

/*soma = 0
for(i = 0; i < numeros.length; i++) {
  //soma = soma + numeros[i]
  soma += numeros[i] 
}
console.log(soma);*/

// Reducer
/*fn = function(soma, numero) {
  return soma + numero;
};
somaFinal = numeros.reduce(fn, 0);
console.log(somaFinal);

// Arrow function
fn = (soma, numero) => soma + numero
somaFinal = numeros.reduce(fn, 0);
console.log(somaFinal);*/

//for...in
/* array é qualquer variável que é iterável
 * que pode ser percorrida com um for
 * for(indice in array)
 */
soma = 0;
for(i in numeros) {
  soma += numeros[i];
}
console.log(soma);

//for...of
soma = 0;
for(numero of numeros) {
  soma += numero;
}
console.log(soma);
