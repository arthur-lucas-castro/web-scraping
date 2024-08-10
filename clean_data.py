import re
from bs4 import BeautifulSoup
import requests

# Nome do arquivo que contém o conteúdo da página
input_file = "pagina_conteudo.txt"

# Nome do arquivo onde o conteúdo limpo será salvo
output_file = "conteudo_limpo.txt"

# Função para limpar os dados
def clean_data(html_content):
    # Parse o conteúdo HTML
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Remover scripts e styles
    for script_or_style in soup(['script', 'style']):
        script_or_style.decompose()
    
    # Obter o texto limpo
    text = soup.get_text(separator=' ')
    
    # Quebrar em linhas e remover espaços em branco extras
    lines = (line.strip() for line in text.splitlines())
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    text = ' '.join(chunk for chunk in chunks if chunk)
    
    return text

# Ler o conteúdo do arquivo
with open(input_file, 'r', encoding='utf-8') as file:
    html_content = file.read()

# Limpar os dados
cleaned_content = clean_data(html_content)

# Salvar o conteúdo limpo em um novo arquivo
with open(output_file, 'w', encoding='utf-8') as file:
    file.write(cleaned_content)

url = "http://node-api:3000/data"
data = { "data": [
    {
        "nome": "Player 3",
        "posicao": "Defender",
        "valorMercado": 5000000,
        "nacionalidade": "Argentinian",
        "liga": "Serie A"
    },
    {
        "nome": "Player 1",
        "posicao": "Atacante",
        "valorMercado": 300000,
        "nacionalidade": "Brasileiro",
        "liga": "Serie A"
    },
    {
        "nome": "Player 2",
        "posicao": "Goleiro",
        "valorMercado": 0,
        "nacionalidade": "Brasileiro",
        "liga": "Serie A"
    },
    {
        "nome": "Player 4",
        "posicao": "Lateral",
        "valorMercado": 300000,
        "nacionalidade": "Brasileiro",
        "liga": "Serie A"
    },
]}

response = requests.post(url, json=data)

print(f"Conteúdo limpo salvo em {output_file}")
