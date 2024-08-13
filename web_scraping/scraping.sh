#!/bin/bash

# URL da página a ser raspada
urls=(
    "https://www.transfermarkt.com.br/campeonato-brasileiro-serie-a/vertragsloseSpieler/wettbewerb/BRA1/saison_id/2023/plus/1"
    "https://www.transfermarkt.com.br/premier-league/vertragsloseSpieler/wettbewerb/GB1/saison_id/2024/plus/1"
    "https://www.transfermarkt.com.br/laliga/vertragsloseSpieler/wettbewerb/ES1/saison_id/2024/plus/1"
    "https://www.transfermarkt.com.br/bundesliga/vertragsloseSpieler/wettbewerb/L1/saison_id/2024/plus/1"
    "https://www.transfermarkt.com.br/ligue-1/vertragsloseSpieler/wettbewerb/FR1/saison_id/2024/plus/1"
    "https://www.transfermarkt.com.br/superliga/vertragsloseSpieler/wettbewerb/AR1N/saison_id/2023/plus/1"
)

# Escolher uma URL aleatoriamente
random_index=$((RANDOM % ${#urls[@]}))
URL=${urls[$random_index]}

# URL="https://www.transfermarkt.com.br/campeonato-brasileiro-serie-a/vertragsloseSpieler/wettbewerb/BRA1/saison_id/2023/plus/1"
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