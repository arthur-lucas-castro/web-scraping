# Use uma imagem base do Python
FROM python:3.9-slim

# Instale cron, curl e dependências do BeautifulSoup
RUN apt-get update && apt-get install -y cron curl

# Instale BeautifulSoup4 via pip
RUN pip install beautifulsoup4

# Copie os arquivos do projeto para o container
COPY scraping.sh /project-directory/scraping.sh
COPY clean_data.py /project-directory/clean_data.py
COPY crontab /etc/cron.d/crontab

# Dê permissão de execução ao script Bash
RUN chmod +x /project-directory/scraping.sh

# Aplicar o cron job e dar permissão de execução
RUN crontab /etc/cron.d/crontab && chmod 0644 /etc/cron.d/crontab

# Crie um diretório de trabalho
WORKDIR /project-directory

# Comando para rodar o cron no foreground
CMD ["cron", "-f"]
