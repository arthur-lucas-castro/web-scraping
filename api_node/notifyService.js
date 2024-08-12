// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = 'ACd633e87c46f1b4923dc5fe825faa2f88';
const authToken = '76ae66ffbab8515664e742ce56a700e6';
const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

async function sendMessage(destinatario, jogadores) {
    //gpt criar mensagem

    console.log(jogadores)
  /*
    const message = await client.messages.create({
    body: "mensagem teste",
    from: "+19862108806",
    to: `+55${destinatario.telefone}`,
  });
    */
  console.log("jogador encontrado");
}

module.exports = { sendMessage }
