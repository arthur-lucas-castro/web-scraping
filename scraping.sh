#!/bin/bash

# URL da página a ser raspada
URL="https://www.transfermarkt.com.br/campeonato-brasileiro-serie-a/vertragsloseSpieler/wettbewerb/BRA1/saison_id/2023/plus/1"
# Arquivo onde o conteúdo será salvo
OUTPUT_FILE="pagina_conteudo.txt"

# Baixa o conteúdo da página e salva no arquivo
curl -s $URL > $OUTPUT_FILE

# Verifica se o download foi bem-sucedido
if [[ $? -eq 0 ]]; then
    echo "Conteúdo da página salvo em $OUTPUT_FILE"
else
    echo "Falha ao baixar o conteúdo da página"
fi