// Frederico

console.log("Bem-vindos à Biblioteca do Bairro!");
console.log(2026 - 1987);
// console.lg("teste") → TypeError: console.lg is not a function (app.js, linha 6)

const nome = "Biblioteca do Bairro";
const morada = "Rua das Flores, 12";

let livros = 1250;
livros -= 3;
console.log(livros);

console.log(`A ${nome} tem ${livros} livros disponíveis.`);
console.log(typeof nome, typeof morada, typeof livros);
console.log(nome.toUpperCase());

function estaAberta(dia, hora) {
    if (dia === "domingo") return false;
    if (dia === "sábado") return hora >= 10 && hora < 13;
    return hora >= 9 && hora < 19;
}

console.log(estaAberta("quarta", 11));   
console.log(estaAberta("quarta", 19));   
console.log(estaAberta("sábado", 12));   
console.log(estaAberta("domingo", 11));  


function calcularMulta(dias) {
    return dias > 15 ? (dias - 15) * 0.5 : 0;
}

function formatarEuros(valor) {
    return valor.toFixed(2).replace(".", ",") + " €";
}

function mensagemMulta(dias) {
    const multa = calcularMulta(dias);
    return multa === 0 ? "Sem multa" : `Multa a pagar: ${formatarEuros(multa)}`;
}

console.log(calcularMulta(10), calcularMulta(22), calcularMulta(30));   // 0 3.5 7.5
console.log(formatarEuros(0.5), formatarEuros(3.5), formatarEuros(12)); // 0,50 € 3,50 € 12,00 €
console.log(mensagemMulta(10));  // Sem multa
console.log(mensagemMulta(22));  // Multa a pagar: 3,50 €
console.log(mensagemMulta(30));  // Multa a pagar: 7,50 €

// 5 · Lista de leituras
const lista = ["Os Maias", "Mensagem", "A Sibila", "Aparição", "Os Lusíadas"];
lista.push("Memorial do Convento", "Ensaio sobre a Cegueira");
console.log(lista.length);

lista.forEach((titulo, i) => console.log(`${i + 1}. ${titulo}`));

const longos = lista.filter(titulo => titulo.length > 10);
const maiusculas = lista.map(titulo => titulo.toUpperCase());
console.log(longos);
console.log(maiusculas);
