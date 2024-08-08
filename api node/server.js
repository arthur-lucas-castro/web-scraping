const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Dados armazenados em memória
let chartData = { labels: [], data: [] };

app.use(bodyParser.json());

// Endpoint para receber e salvar dados
app.post('/data', (req, res) => {
    const { labels, data } = req.body;

    if (!Array.isArray(labels) || !Array.isArray(data)) {
        return res.status(400).json({ error: 'Labels and data must be arrays' });
    }

    chartData = { labels, data };
    res.status(200).json({ message: 'Data saved successfully' });
});

// Endpoint para exibir gráfico como HTML
app.get('/chart', (req, res) => {
    if (chartData.labels.length === 0 || chartData.data.length === 0) {
        return res.status(400).json({ error: 'No data available' });
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Chart</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body>
        <canvas id="myChart" width="800" height="600"></canvas>
        <script>
            var ctx = document.getElementById('myChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ${JSON.stringify(chartData.labels)},
                    datasets: [{
                        label: 'Dataset',
                        data: ${JSON.stringify(chartData.data)},
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        </script>
    </body>
    </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
