document.getElementById('playerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const telefone = document.getElementById('telefone').value;
    const playerMarketValueMin = document.getElementById('playerMarketValueMin').value;
    const playerMarketValueMax = document.getElementById('playerMarketValueMax').value;
    const position =  document.getElementById('position').value;
    const liga =  document.getElementById('liga').value;
    if(!playerMarketValueMin && !playerMarketValueMax && !position && !liga){

        alert('Preencha pelo menos um filtro');
        return;
    }

    const playerData = {
        "nome": name,
        "telefone": telefone,
        "filtro": {
            "liga": liga ? liga : null ,
            "posicao": position ? position : null,
            "valorMaximo": playerMarketValueMax ? parseInt(playerMarketValueMax) : null,
            "valorMinimo": playerMarketValueMin ? parseInt(playerMarketValueMin) : null,
        }

    };

    fetch('/notify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playerData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => console.error('Erro ao enviar os dados:', error));
});

