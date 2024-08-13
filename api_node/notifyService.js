const nodemailer = require('nodemailer');


async function sendMessage(destinatario, jogadores) {
    const assunto = 'Novo jogador na área!'
    let mensagemBase = `Ola ${destinatario.nome}! \n Esses jogadores podem interessar a voce: \n `

    try {
        let transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.SENHA_EMAIL
            },
            tls: {
                ciphers: 'SSLv3'
            }
        });
        jogadores.map(jogador => {
            mensagemBase += `\n\n ----------------------------------------------------------- \n\n
                    Nome: ${jogador.nome}\n 
                    Posição: ${jogador.posicao}\n  
                    Ultimo Time: ${jogador.timeAnterior}\n
                    Jogos na ultima temporada: ${jogador.jogosUltimaTemporada}\n
                    Gols na ultima temporada: ${jogador.golsUltimaTemporada}\n
                    Data ultimo jogo: ${jogador.dataUltimoJogo}\n
                    Valor de mercado: ${jogador.valorMercado}\n
                    liga: ${jogador.liga}\n
                `
        })

        let mailOptions = {
            from: 'trabArthurCastro@outlook.com',
            to: destinatario.email, 
            subject: assunto, 
            text: mensagemBase, 
        };

        let info = await transporter.sendMail(mailOptions);

        console.log('Email enviado: %s', info.messageId);
    } catch (error) {
        console.error('Erro ao enviar email:', error);
    }
}

module.exports = { sendMessage }
