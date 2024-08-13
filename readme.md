# Monitoramento de Jogadores Sem Contrato

## Feito por:
Arthur Castro

## Disciplina:
Sistemas Distribuídos

## Objetivo do Trabalho:
Desenvolver uma aplicação contendo web scraping, data clean, micro serviços, cadastro de evento, exibição de dados e contato por email.

## Objetivo Específico:
Esse trabalho tem como objetivo monitorar os jogadores que ficam sem contrato ativo nas principais ligas de futebol. Caso algum jogador atenda os critérios do cliente, ele será informado assim que o jogador for capturado pelo web scraping.

## Como Rodar:
Para iniciar a aplicação, execute o seguinte comando no terminal:

```bash

docker compose up --build 
```

Para ver o grafico, acesse a rota: /chart

Para ver o formulario de cadastro de evento acesse a rota: /forms

## Observacao

O sistema irá realizar o web scraping a cada minuto. Para alterar esse intervalo, edite o arquivo crontab.