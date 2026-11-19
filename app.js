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

// ─── 7 · armazenamento ───
// todas as chaves levam o prefixo biblioteca:
const CHAVES = {
    tema: "biblioteca:tema",
    leitor: "biblioteca:leitor",
    leitura: "biblioteca:leitura",
    pesquisas: "biblioteca:pesquisas",
    aviso: "biblioteca:aviso-fechado",
    visitas: "biblioteca:visitas",
};

function ler(chave, porOmissao) {
    try {
        const texto = localStorage.getItem(chave);
        if (texto === null) return porOmissao;
        return JSON.parse(texto);
    } catch {
        return porOmissao; // texto estragado: vale o valor por omissão
    }
}

function guardar(chave, valor) {
    try {
        localStorage.setItem(chave, JSON.stringify(valor));
        return true;
    } catch (erro) {
        console.warn("Não foi possível guardar:", erro.name);
        return false; // cheio ou bloqueado: a página funciona, só sem memória
    }
}

function apagar(chave) {
    try {
        localStorage.removeItem(chave);
    } catch {
        // sem armazenamento não há nada para apagar
    }
}

let leitura = ler(CHAVES.leitura, []);
if (!Array.isArray(leitura)) leitura = [];

// ─── 8 · o catálogo na página ───
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

        const naLista = leitura.some(l => l.titulo === livro.titulo);
        const botaoGuardar = document.createElement("button");
        botaoGuardar.type = "button";
        botaoGuardar.className = "botao-guardar";
        botaoGuardar.textContent = naLista ? "★ Guardado" : "☆ Guardar";
        botaoGuardar.setAttribute("aria-pressed", String(naLista));
        botaoGuardar.addEventListener("click", () => alternarLeitura(livro.titulo));
        acoes.append(botaoGuardar);

        if (naLista) item.classList.add("favorito");

        lista.append(item);
    }

    const total = livrosDoCatalogo.length;
    const livres = contarDisponiveis(livrosDoCatalogo);
    resumo.textContent = `${total} ${total === 1 ? "livro" : "livros"}, ${livres} ${livres === 1 ? "disponível" : "disponíveis"}`;
}

// ─── 9 · pesquisa e filtro ───
const pesquisa = document.querySelector("#pesquisa");
const botaoDisponiveis = document.querySelector("#botao-disponiveis");
let soDisponiveis = false;

function atualizar() {
    const texto = pesquisa.value.trim().toLowerCase();
    let resultado = catalogo.filter(l => `${l.titulo} ${l.autor}`.toLowerCase().includes(texto));
    if (soDisponiveis) resultado = resultado.filter(l => l.disponivel);

    if (resultado.length === 0) {
        lista.replaceChildren();
        lista.textContent = "Nenhum livro encontrado.";
        resumo.textContent = "";
        return;
    }

    mostrarLivros(resultado);
}

let temporizadorPesquisa;

pesquisa.addEventListener("input", () => {
    atualizar();

    // só grava quando o leitor pára de escrever
    clearTimeout(temporizadorPesquisa);
    temporizadorPesquisa = setTimeout(() => registarPesquisa(pesquisa.value), 800);
});

botaoDisponiveis.addEventListener("click", () => {
    soDisponiveis = !soDisponiveis;
    botaoDisponiveis.setAttribute("aria-pressed", String(soDisponiveis));
    atualizar();
});

// ─── 10 · lista de leitura ───
// a fonte da verdade é o array leitura, não o DOM
const listaLeitura = document.querySelector("#lista-leitura");
const resumoLeitura = document.querySelector("#resumo-leitura");
const leituraVazia = document.querySelector("#leitura-vazia");

function mostrarLeitura() {
    listaLeitura.replaceChildren();

    leituraVazia.hidden = leitura.length > 0;

    const lidos = leitura.filter(l => l.lido).length;
    resumoLeitura.textContent = leitura.length === 0
        ? ""
        : `${leitura.length} ${leitura.length === 1 ? "livro" : "livros"}, ${lidos} ${lidos === 1 ? "lido" : "lidos"}`;

    leitura.forEach((item, i) => {
        const li = document.createElement("li");
        li.className = "item-leitura";
        li.dataset.indice = i;
        if (item.lido) li.classList.add("lido");

        const titulo = document.createElement("span");
        titulo.className = "titulo-leitura";
        titulo.textContent = item.titulo;

        const acoes = document.createElement("div");
        acoes.className = "acoes-lista";

        const botaoLido = document.createElement("button");
        botaoLido.type = "button";
        botaoLido.dataset.acao = "lido";
        botaoLido.textContent = item.lido ? "Lido ✓" : "Marcar como lido";
        botaoLido.setAttribute("aria-pressed", String(item.lido));

        const subir = document.createElement("button");
        subir.type = "button";
        subir.dataset.acao = "subir";
        subir.textContent = "↑";
        subir.setAttribute("aria-label", `Subir ${item.titulo}`);
        subir.disabled = i === 0;

        const descer = document.createElement("button");
        descer.type = "button";
        descer.dataset.acao = "descer";
        descer.textContent = "↓";
        descer.setAttribute("aria-label", `Descer ${item.titulo}`);
        descer.disabled = i === leitura.length - 1;

        const remover = document.createElement("button");
        remover.type = "button";
        remover.dataset.acao = "remover";
        remover.textContent = "Remover";
        remover.setAttribute("aria-label", `Remover ${item.titulo}`);

        acoes.append(botaoLido, subir, descer, remover);
        li.append(titulo, acoes);
        listaLeitura.append(li);
    });
}

function guardarLeitura() {
    guardar(CHAVES.leitura, leitura);
    mostrarLeitura();
    atualizar(); // os cartões do catálogo voltam a saber quem está guardado
}

function alternarLeitura(titulo) {
    if (leitura.some(l => l.titulo === titulo)) {
        leitura = leitura.filter(l => l.titulo !== titulo);
    } else {
        leitura = [...leitura, { titulo, lido: false }];
    }
    guardarLeitura();
}

// delegação: um ouvinte só para a lista toda
listaLeitura.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button");
    const li = evento.target.closest("li");
    if (!botao || !li) return;

    const i = Number(li.dataset.indice);
    const acao = botao.dataset.acao;

    if (acao === "lido") leitura[i].lido = !leitura[i].lido;
    else if (acao === "remover") leitura.splice(i, 1);
    else if (acao === "subir" && i > 0) leitura.splice(i - 1, 0, leitura.splice(i, 1)[0]);
    else if (acao === "descer" && i < leitura.length - 1) leitura.splice(i + 1, 0, leitura.splice(i, 1)[0]);

    guardarLeitura();
});

// ─── 11 · inscrição ───
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

// ─── 12 · tema ───
const botaoTema = document.querySelector("#botao-tema");
const botaoSistema = document.querySelector("#botao-sistema");
const esquemaEscuro = matchMedia("(prefers-color-scheme: dark)");

function temaGuardado() {
    try {
        return localStorage.getItem(CHAVES.tema);
    } catch {
        return null;
    }
}

function aplicarTema() {
    const guardado = temaGuardado();

    // escolha guardada ganha ao sistema; sem escolha, seguimos o sistema
    const escuro = guardado ? guardado === "escuro" : esquemaEscuro.matches;

    document.body.classList.toggle("tema-escuro", escuro);
    botaoTema.textContent = escuro ? "Modo claro" : "Modo escuro";
    botaoTema.setAttribute("aria-pressed", String(escuro));
    botaoTema.setAttribute("aria-label", escuro ? "Ativar modo claro" : "Ativar modo escuro");
    botaoSistema.setAttribute("aria-pressed", String(guardado === null));
}

botaoTema.addEventListener("click", () => {
    const escuro = !document.body.classList.contains("tema-escuro");
    try {
        localStorage.setItem(CHAVES.tema, escuro ? "escuro" : "claro");
    } catch {
        // sem armazenamento o tema muda só nesta visita
    }
    aplicarTema();
});

botaoSistema.addEventListener("click", () => {
    apagar(CHAVES.tema);
    aplicarTema();
});

// o sistema mudou e o leitor nunca escolheu nada
esquemaEscuro.addEventListener("change", () => {
    if (temaGuardado() === null) aplicarTema();
});

// ─── 13 · aviso por visita ───
const faixaAviso = document.querySelector("#faixa-aviso");
const fecharAviso = document.querySelector("#fechar-aviso");

function mostrarAviso() {
    let fechado = false;
    try {
        fechado = sessionStorage.getItem(CHAVES.aviso) === "sim";
    } catch {
        fechado = false; // bloqueado: mostra sempre
    }
    faixaAviso.hidden = fechado;
}

fecharAviso.addEventListener("click", () => {
    faixaAviso.hidden = true;
    try {
        sessionStorage.setItem(CHAVES.aviso, "sim");
    } catch {
        // fica fechada só nesta página
    }
});

// ─── 14 · últimas pesquisas ───
const SETE_DIAS = 7 * 24 * 60 * 60 * 1000;
const caixaPesquisas = document.querySelector("#ultimas-pesquisas");

function lerPesquisas() {
    const caixa = ler(CHAVES.pesquisas, null);

    if (!caixa || caixa.versao !== 1 || !Array.isArray(caixa.dados)) return [];
    if (Date.now() - caixa.guardadoEm > SETE_DIAS) {
        apagar(CHAVES.pesquisas); // velhas: ignora e deita fora
        return [];
    }
    return caixa.dados;
}

function registarPesquisa(termo) {
    const limpo = termo.trim();
    if (limpo.length < 3) return;

    // sem repetidas, a mais recente à frente, no máximo cinco
    const antigas = lerPesquisas().filter(t => t.toLowerCase() !== limpo.toLowerCase());
    const dados = [limpo, ...antigas].slice(0, 5);

    guardar(CHAVES.pesquisas, { versao: 1, guardadoEm: Date.now(), dados });
    mostrarPesquisas();
}

function mostrarPesquisas() {
    const lista = lerPesquisas();
    caixaPesquisas.replaceChildren();
    caixaPesquisas.hidden = lista.length === 0;

    const titulo = document.createElement("span");
    titulo.className = "ultimas-titulo";
    titulo.textContent = "Últimas pesquisas:";
    caixaPesquisas.append(titulo);

    for (const termo of lista) {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.textContent = termo;
        chip.addEventListener("click", () => {
            pesquisa.value = termo;
            atualizar();
        });
        caixaPesquisas.append(chip);
    }

    const limpar = document.createElement("button");
    limpar.type = "button";
    limpar.className = "limpar-pesquisas";
    limpar.textContent = "Limpar";
    limpar.addEventListener("click", () => {
        apagar(CHAVES.pesquisas);
        mostrarPesquisas();
    });
    caixaPesquisas.append(limpar);
}

// ─── 15 · visitas ───
const contadorVisitas = document.querySelector("#contador-visitas");
const recomecarVisitas = document.querySelector("#recomecar-visitas");

function contarVisita() {
    try {
        const visitas = Number(localStorage.getItem(CHAVES.visitas)) + 1;
        localStorage.setItem(CHAVES.visitas, visitas);
        contadorVisitas.textContent = `É a ${visitas}.ª vez que nos visitas.`;
        recomecarVisitas.hidden = false;
    } catch {
        contadorVisitas.textContent = "Este browser não deixa contar as visitas.";
        recomecarVisitas.hidden = true;
    }
}

recomecarVisitas.addEventListener("click", () => {
    apagar(CHAVES.visitas);
    contadorVisitas.textContent = "Contador reposto. Recarrega a página.";
});

// ─── 16 · ficha de leitor ───
const saudacao = document.querySelector("#saudacao-leitor");
const cartaoLeitor = document.querySelector("#cartao-leitor");
const listaGeneros = document.querySelector("#generos-leitor");

const leitorPorOmissao = {
    nome: "Ana",
    cartao: "BB-1042",
    generos: ["Romance", "Policial", "Ensaio"],
};

function mostrarLeitor() {
    let dados = ler(CHAVES.leitor, null);

    if (!dados) {
        guardar(CHAVES.leitor, leitorPorOmissao);
        dados = leitorPorOmissao;
    }

    saudacao.textContent = `Olá, ${dados.nome ?? "visitante"}`;
    cartaoLeitor.textContent = dados.cartao ? `Cartão ${dados.cartao}` : "";

    listaGeneros.replaceChildren();
    for (const genero of dados.generos ?? []) {
        const li = document.createElement("li");
        li.textContent = genero;
        listaGeneros.append(li);
    }
}

// ─── 17 · um só estado, vários separadores ───
// só chega aos outros separadores: quem muda não recebe o evento
window.addEventListener("storage", (evento) => {
    if (evento.key === null || evento.key === CHAVES.leitura) {
        leitura = ler(CHAVES.leitura, []);
        if (!Array.isArray(leitura)) leitura = [];
        mostrarLeitura();
        atualizar();
    }

    if (evento.key === null || evento.key === CHAVES.tema) aplicarTema();
    if (evento.key === null || evento.key === CHAVES.pesquisas) mostrarPesquisas();
    if (evento.key === null || evento.key === CHAVES.leitor) mostrarLeitor();
});

// ─── 18 · arranque ───
function provarNaConsola() {
    console.log(`${catalogo.length} livros: ${contarDisponiveis(catalogo)} disponíveis`);
    console.log(`Mais antigo: ${maisAntigo(catalogo).titulo}`);
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

mostrarLeitura();
mostrarPesquisas();
mostrarLeitor();
mostrarAviso();
contarVisita();
aplicarTema();
carregarLivros();
