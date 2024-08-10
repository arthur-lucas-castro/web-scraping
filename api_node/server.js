const express = require('express');
const bodyParser = require('body-parser');
const { sendMessage } = require('./notifyService');


const app = express();
const port = 3000;

// Dados armazenados em memória
let playersData = [];
//{nome: "string", filtros: {posicao: "", nacionalidade: "", maxValue: "", minValue: "", maxTempoSemJogar: ""}}
let userRegister = []

app.use(bodyParser.json());


// Endpoint para receber e salvar dados
app.post('/data', (req, res) => {

    const {data} = req.body;

    data.map(jogador => {
        userRegister.map(user => {
            if (verificarJogador(jogador, user.filtro)) {
                sendMessage(user.telefone, "jogador encontrado" )
            }
        });
    })
    
    playersData.push(...data);

    res.status(200).json({ message: playersData });
});

function verificarJogador(jogador, regra) {
    const atendeNacionalidade = regra.nacionalidade ? jogador.nacionalidade === regra.nacionalidade : true;
    const atendeValorMinimo = regra.valorMinimo ? jogador.valorMercado >= regra.valorMinimo : true;
    const atendeValorMaximo = regra.valorMaximo ? jogador.valorMercado <= regra.valorMaximo : true;

    return atendeNacionalidade && atendeValorMinimo && atendeValorMaximo;
}


// Endpoint para exibir gráfico como HTML
app.get('/chart', (req, res) => {
    if (playersData.length === 0) {
        return res.status(400).json({ error: 'No data available' });
    }
    const data = playersData.reduce((acc, jogador) => {
        acc[jogador.nacionalidade] = (acc[jogador.nacionalidade] || 0) + 1;
        return acc;
    }, {});

    const nacionalidades = Object.keys(data);
    const valores = Object.values(data);

    let chartHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Jogadores sem contrato por país</title>
        <script src="https://d3js.org/d3.v7.min.js"></script>
    </head>
    <body>
        <h1>Jogadores sem contrato por país</h1>
        <div id="chart"></div>
        <script>
            const data = ${JSON.stringify(data)};
            const width = 500, height = 500, radius = Math.min(width, height) / 2;

            const color = d3.scaleOrdinal(d3.schemeCategory10);

            const svg = d3.select("#chart")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            const pie = d3.pie().value(d => d[1]);

            const arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);

            const arcs = svg.selectAll("arc")
                .data(pie(Object.entries(data)))
                .enter()
                .append("g")
                .attr("class", "arc")
                .on("click", function(event, d) {
                    window.location.href = "/jogadores/" + d.data[0];
                });

            arcs.append("path")
                .attr("d", arc)
                .attr("fill", d => color(d.data[0]));

            arcs.append("text")
                .attr("transform", d => "translate(" + arc.centroid(d) + ")")
                .attr("text-anchor", "middle")
                .text(d => d.data[0]);

            // Adiciona legenda
            const legend = svg.append("g")
                .attr("transform", "translate(" + (radius + 20) + "," + (-radius) + ")")
                .selectAll("g")
                .data(Object.entries(data))
                .enter().append("g")
                .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

            legend.append("rect")
                .attr("width", 18)
                .attr("height", 18)
                .attr("fill", d => color(d[0]));

            legend.append("text")
                .attr("x", 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .text(d => d[0]);
        </script>
    </body>
    </html>`;

    res.send(chartHtml);
});

app.post('/notify', (req, res) => {
    const { nome, telefone, filtro } = req.body;

    const newRegister = {
        nome: nome,
        telefone: telefone,
        filtro: {
            nacionalidade: filtro.nacionalidade || null,
            valorMinimo: filtro.valorMinimo || null,
            valorMaximo: filtro.valorMaximo || null
        }
    };

    // Adicionando a nova regra à lista de regras
    userRegister.push(newRegister);

    console.log('Nova regra cadastrada:', newRegister);
    res.status(200).json({ message: 'Regra cadastrada com sucesso', regra: newRegister });
});

// Endpoint para listar jogadores por nacionalidade
app.get('/jogadores/:nacionalidade', (req, res) => {
    const nacionalidade = req.params.nacionalidade;
    const jogadoresFiltrados = playersData.filter(jogador => jogador.nacionalidade === nacionalidade);

    let jogadoresHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Jogadores de ${nacionalidade}</title>
    </head>
    <body>
        <h1>Jogadores de ${nacionalidade}</h1>
        <ul>
    `;

    jogadoresFiltrados.forEach(jogador => {
        jogadoresHtml += `<li>${jogador.nome} - ${jogador.posicao} - Valor de Mercado: ${jogador.valorMercado}</li>`;
    });

    jogadoresHtml += `
        </ul>
        <a href="/chart">Voltar ao gráfico</a>
    </body>
    </html>`;

    res.send(jogadoresHtml);
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
