require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { sendMessage } = require('./notifyService');

const app = express();
const port = process.env.PORT;
app.use(express.static(path.join(__dirname, 'public')));

// Dados armazenados em memória
let playersData = [];
// {"nome": string, "posicao": string, "timeAnterior": string, "nacionalidade": [string], 
//   "jogosUltimaTemporada": int, "golsUltimaTemporada": int, "dataUltimoJogo": string,
//   "valorMercado": int, "liga": string}
let userRegister = []

app.use(bodyParser.json());

app.post('/data', (req, res) => {
    const { jogadores } = req.body;

    userRegister.map(user => {
        let jogadoresEncontrados = []
        jogadores.map(jogador => {
            if (verificarJogador(jogador, user.filtro)) {
                jogadoresEncontrados.push(jogador)
            }
        });
        if(jogadoresEncontrados.length > 0){
            sendMessage(user, jogadoresEncontrados)
        }

    })

    jogadores.forEach(novoJogador => {
        adicionarOuAtualizarJogador(novoJogador)
    })

    res.status(200).json({ message: playersData });
});

function adicionarOuAtualizarJogador(novoJogador) {
    const index = playersData.findIndex(jogador => 
        jogador.nome.toUpperCase()  === novoJogador.nome.toUpperCase() &&
         jogador.nacionalidade[0].toUpperCase()  === novoJogador.nacionalidade[0].toUpperCase() 
    );

    if (index !== -1) {
        playersData[index] = { ...playersData[index], ...novoJogador };
    } else {
        playersData.push(novoJogador);
    }
}

function verificarJogador(jogador, regra) {

    const atendeLiga = regra.liga ? jogador.liga.toLowerCase() === regra.liga.toLowerCase()  : true;
    const atendePosicao = regra.posicao ? jogador.posicao.toLowerCase().trim() === regra.posicao.toLowerCase().trim()  : true

    const atendeValorMinimo = regra.valorMinimo ? jogador.valorMercado >= regra.valorMinimo : true;
    const atendeValorMaximo = regra.valorMaximo ? jogador.valorMercado <= regra.valorMaximo : true;

    return atendeLiga && atendePosicao && atendeValorMinimo && atendeValorMaximo;
}

app.get('/jogadores-por-liga', (req, res) => {
    const valoresPorLiga = {};

    playersData.forEach(jogador => {
        if (!valoresPorLiga[jogador.liga]) {
            valoresPorLiga[jogador.liga] = [];
        }
        valoresPorLiga[jogador.liga].push(jogador.valorMercado);
    });

    const mediaValoresPorLiga = Object.keys(valoresPorLiga).map(liga => {
        const total = valoresPorLiga[liga].reduce((acc, valor) => acc + valor, 0);
        const media = total / valoresPorLiga[liga].length;
        return { liga, media };
    });

    res.json(mediaValoresPorLiga);
});

app.get('/chart', (req, res) => {

    if (playersData.length === 0) {
        return res.status(400).json({ error: 'No data available' });
    }
    res.sendFile(path.join(__dirname,'public', 'chart.html'));
});

app.get('/forms', (req, res) => {

    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/notify', (req, res) => {

    userRegister.push(req.body);

    res.status(200).json({ message: 'Regra cadastrada com sucesso', regra: req.body });
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
