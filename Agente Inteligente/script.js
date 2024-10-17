const tabuleiro = document.getElementById('tabuleiro');
const celulas = document.querySelectorAll('.cell');
const mensagemStatus = document.getElementById('mensagemStatus');
const botaoReiniciar = document.getElementById('botaoReiniciar');
const botaoEscolher = document.getElementById('botaoEscolher');

let tabuleiroEstado = ["", "", "", "", "", "", "", "", ""];
let jogadorAtual = "O"; // "O" para humano, "X" para máquina
let jogoAtivo = true;

// Combinações vencedoras 
const combinacoesVencedoras = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Inicia jogo
iniciarJogo();

function iniciarJogo() {
    celulas.forEach(celula => celula.addEventListener('click', handleCellClick));
    botaoReiniciar.addEventListener('click', reiniciarJogo);
    botaoEscolher.addEventListener('click', escolherIniciante);
    reiniciarJogo();
}

function handleCellClick(e) {
    const celula = e.target;
    const index = celula.getAttribute('data-index');

    if (tabuleiroEstado[index] !== "" || !jogoAtivo) {
        return;
    }

    jogada(celula, index, jogadorAtual);

    if (verificarVitoria(jogadorAtual)) {
        finalizarJogo(false);
        return;
    }

    if (verificarEmpate()) {
        finalizarJogo(true);
        return;
    }

    trocarJogador();
    if (jogadorAtual === "X") {
        setTimeout(movimentoComputador, 500);
    }
}

function jogada(celula, index, jogador) {
    tabuleiroEstado[index] = jogador;
    celula.textContent = jogador;
}

function verificarVitoria(jogador) {
    return combinacoesVencedoras.some(combinacao => {
        return combinacao.every(index => {
            return tabuleiroEstado[index] === jogador;
        });
    });
}

function verificarEmpate() {
    return tabuleiroEstado.every(celula => celula !== "");
}

function finalizarJogo(empate) {
    jogoAtivo = false;
    if (empate) {
        mensagemStatus.textContent = "Empate!";
    } else {
        mensagemStatus.textContent = `${jogadorAtual} venceu!`;
    }
}

function trocarJogador() {
    jogadorAtual = jogadorAtual === "O" ? "X" : "O";
}

function movimentoComputador() {
    if (!jogoAtivo) return;

    const melhorMovimento = calcularMelhorMovimento();
    tabuleiroEstado[melhorMovimento] = "X";
    celulas[melhorMovimento].textContent = "X";

    if (verificarVitoria("X")) {
        finalizarJogo(false);
        return;
    }

    if (verificarEmpate()) {
        finalizarJogo(true);
        return;
    }

    trocarJogador();
}

function calcularMelhorMovimento() {
    // Verificar se pode vencer na próxima jogada
    for (let i = 0; i < tabuleiroEstado.length; i++) {
        if (tabuleiroEstado[i] === "") {
            tabuleiroEstado[i] = "X";
            if (verificarVitoria("X")) {
                tabuleiroEstado[i] = "";
                return i;
            }
            tabuleiroEstado[i] = "";
        }
    }

    // Verifica se o jogador pode vencer na próxima jogada e bloquear
    for (let i = 0; i < tabuleiroEstado.length; i++) {
        if (tabuleiroEstado[i] === "") {
            tabuleiroEstado[i] = "O";
            if (verificarVitoria("O")) {
                tabuleiroEstado[i] = "";
                return i;
            }
            tabuleiroEstado[i] = "";
        }
    }

    //  Ocupar o centro
    if (tabuleiroEstado[4] === "") {
        return 4;
    }

    //  Ocupar cantos
    const cantos = [0, 2, 6, 8];
    for (let i of cantos) {
        if (tabuleiroEstado[i] === "") {
            return i;
        }
    }

    // Ocupar laterais
    const laterais = [1, 3, 5, 7];
    for (let i of laterais) {
        if (tabuleiroEstado[i] === "") {
            return i;
        }
    }
}

function reiniciarJogo() {
    jogadorAtual = "O";
    tabuleiroEstado = ["", "", "", "", "", "", "", "", ""];
    jogoAtivo = true;
    mensagemStatus.textContent = "";
    celulas.forEach(celula => (celula.textContent = ""));
}

function escolherIniciante() {
    const escolha = prompt("Quem deve começar o jogo? Digite '1' para Você ou '2' para Máquina:");
    if (escolha === "1") {
        reiniciarJogo();
    } else if (escolha === "2") {
        reiniciarJogo();
        jogadorAtual = "X";
        movimentoComputador();
    } else {
        alert("Escolha inválida! O jogo será reiniciado.");
        reiniciarJogo();
    }
}
