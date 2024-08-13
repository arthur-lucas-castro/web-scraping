from bs4 import BeautifulSoup
import requests

# Nome do arquivo que contém o conteúdo da página
input_file = "pagina_conteudo.txt"


def get_nacionalidades(colunaNacionalidade):
    nacionalidades = []
    imgNacionalidades = colunaNacionalidade.find_all('img')
    for imgNacionalidade in imgNacionalidades:
         nacionalidades.append(imgNacionalidade['title'])
    return nacionalidades

def get_valor_mercado_numerico(valor_str):
    valor_str = valor_str.replace(" ", "").lower()
    valor_numerico = 0
    
    if not valor_str or valor_str == "-":
        return 0

    if valor_str[-1].isdigit():
        return int(float(valor_str))

    # Processa sufixos específicos
    if valor_str.endswith("mil€"):
        valor_numerico = float(valor_str.replace("mil€", "")) * 1_000
    elif valor_str.endswith("mi. €"):
        valor_numerico = float(valor_str.replace("mi.€", "")) * 1_000_000

    return int(valor_numerico)


def clean_data(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    jogadores = []

    for script_or_style in soup(['script', 'style']):
        script_or_style.decompose()
    
    tabela = soup.find('table', class_='items')
    liga = soup.find('div', class_='data-header__headline-container')

    if tabela:
            linhas = tabela.find_all('tr')
            for linha in linhas[1:]:
                colunas = linha.find_all('td')
                nomeRepetido = colunas[1].find('a')
                nomeRepetido.decompose()

                jogador = {
                    "nome": colunas[0].img['title'],
                    "posicao": colunas[1].text,
                    "timeAnterior": colunas[2].img['title'],
                    "nacionalidade": get_nacionalidades(colunas[3]),
                    "jogosUltimaTemporada": colunas[4].text,
                    "golsUltimaTemporada": colunas[5].text,
                    "dataUltimoJogo": colunas[6].text,
                    "valorMercado": get_valor_mercado_numerico(colunas[11].text),
                    "liga": liga.text.strip()
                }
                jogadores.append(jogador)
    
    return jogadores

with open(input_file, 'r', encoding='utf-8') as file:
    html_content = file.read()

file.close()

# Limpar os dados
cleaned_content = clean_data(html_content)


url = "http://node-api:3000/data"

data = { "jogadores": cleaned_content}

response = requests.post(url, json=data)

print(f"Conteúdo limpo e enviado")
