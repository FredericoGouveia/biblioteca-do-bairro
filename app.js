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

console.log(calcularMulta(10), calcularMulta(22), calcularMulta(30));  
console.log(formatarEuros(0.5), formatarEuros(3.5), formatarEuros(12)); 
console.log(mensagemMulta(10));  
console.log(mensagemMulta(22));  
console.log(mensagemMulta(30));  


const listaTitulos = ["Os Maias", "Mensagem", "A Sibila", "Aparição", "Os Lusíadas"];
listaTitulos.push("Memorial do Convento", "Ensaio sobre a Cegueira");
console.log(listaTitulos.length);

listaTitulos.forEach((titulo, i) => console.log(`${i + 1}. ${titulo}`));

const longos = listaTitulos.filter(titulo => titulo.length > 10);
const maiusculas = listaTitulos.map(titulo => titulo.toUpperCase());
console.log(longos);
console.log(maiusculas);

// ─── 6 · catálogo em objetos ───
// o array deixou de estar aqui: vem de livros.json (exercício 9)
let catalogo = [];

function contarDisponiveis(livrosDoCatalogo) {
    return livrosDoCatalogo.filter(l => l.disponivel).length;
}

function maisAntigo(livrosDoCatalogo) {
    let antigo = livrosDoCatalogo[0];
    for (const livro of livrosDoCatalogo) {
        if (livro.ano < antigo.ano) antigo = livro;
    }
    return antigo;
}

function emprestar(titulo) {
    const livro = catalogo.find(l => l.titulo === titulo);
    if (!livro) return "Livro não encontrado.";
    if (!livro.disponivel) return `${livro.titulo} já está emprestado.`;
    livro.disponivel = false;
    return `${livro.titulo} emprestado.`;
}

// ─── 7 · o catálogo na página ───
const lista = document.querySelector("#lista-livros");
const resumo = document.querySelector("#resumo-catalogo");

function mostrarLivros(livrosDoCatalogo) {
    lista.replaceChildren();

    for (const livro of livrosDoCatalogo) {
        const item = document.createElement("li");
        item.className = "cartao livro";

        const titulo = document.createElement("h3");
        titulo.textContent = `${livro.titulo} — ${livro.autor} (${livro.ano})`;
        item.append(titulo);

        if (!livro.disponivel) {
            item.classList.add("indisponivel");
            const estado = document.createElement("p");
            estado.className = "estado";
            estado.textContent = "emprestado";
            item.append(estado);
        }

        const acoes = document.createElement("div");
        acoes.className = "acoes";
        item.append(acoes);

        const botaoEmprestar = document.createElement("button");
        botaoEmprestar.type = "button";
        botaoEmprestar.textContent = livro.disponivel ? "Emprestar" : "Indisponível";
        botaoEmprestar.disabled = !livro.disponivel;
        botaoEmprestar.addEventListener("click", () => {
            console.log(emprestar(livro.titulo));
            atualizar();
        });
        acoes.append(botaoEmprestar);

        const guardado = favoritos.includes(livro.titulo);
        const botaoGuardar = document.createElement("button");
        botaoGuardar.type = "button";
        botaoGuardar.className = "botao-guardar";
        botaoGuardar.textContent = guardado ? "★ Guardado" : "☆ Guardar";
        botaoGuardar.setAttribute("aria-pressed", String(guardado));
        botaoGuardar.addEventListener("click", () => alternarFavorito(livro.titulo));
        acoes.append(botaoGuardar);

        if (guardado) item.classList.add("favorito");

        lista.append(item);
    }

    const total = livrosDoCatalogo.length;
    const livres = contarDisponiveis(livrosDoCatalogo);
    resumo.textContent = `${total} ${total === 1 ? "livro" : "livros"}, ${livres} ${livres === 1 ? "disponível" : "disponíveis"}`;
}

// ─── 8 · pesquisa, filtro e inscrição ───
const pesquisa = document.querySelector("#pesquisa");
const botaoDisponiveis = document.querySelector("#botao-disponiveis");
let soDisponiveis = false;

function atualizar() {
    const texto = pesquisa.value.trim().toLowerCase();
    let resultado = catalogo.filter(l => `${l.titulo} ${l.autor}`.toLowerCase().includes(texto));
    if (soDisponiveis) resultado = resultado.filter(l => l.disponivel);

    mostrarLivros(resultado);

    if (resultado.length === 0) {
        lista.textContent = "Nenhum livro encontrado.";
    }
}

pesquisa.addEventListener("input", atualizar);

botaoDisponiveis.addEventListener("click", () => {
    soDisponiveis = !soDisponiveis;
    botaoDisponiveis.setAttribute("aria-pressed", String(soDisponiveis));
    atualizar();
});

const formulario = document.querySelector("#inscricao");
const mensagem = document.querySelector("#mensagem");

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nomeInscrito = formulario.nome.value.trim();
    const email = formulario.email.value.trim();

    if (nomeInscrito === "" || !email.includes("@")) {
        mensagem.textContent = "Preencha o nome e um e-mail válido.";
        mensagem.className = "mensagem erro";
        return;
    }

    mensagem.textContent = `Obrigado, ${nomeInscrito}! Inscrição feita.`;
    mensagem.className = "mensagem sucesso";
    formulario.reset();
});

// ─── 9 · guardar e carregar ───
let favoritos = lerFavoritos();

function lerFavoritos() {
    try {
        return JSON.parse(localStorage.getItem("favoritos")) ?? [];
    } catch {
        return [];
    }
}

function alternarFavorito(titulo) {
    if (favoritos.includes(titulo)) {
        favoritos = favoritos.filter(t => t !== titulo);
    } else {
        favoritos = [...favoritos, titulo];
    }
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    atualizar();
}

async function carregarLivros() {
    try {
        const resposta = await fetch("livros.json");
        catalogo = await resposta.json();
        atualizar();
        provarNaConsola();
    } catch {
        lista.textContent = "Erro ao carregar o catálogo.";
    }
}

// exercício 6 continua a dar provas na consola
function provarNaConsola() {
    console.log(`${catalogo.length} livros: ${contarDisponiveis(catalogo)} disponíveis`);
    console.log(`Mais antigo: ${maisAntigo(catalogo).titulo}`);
}

carregarLivros();
