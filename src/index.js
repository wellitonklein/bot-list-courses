const axios = require('axios');
const crawler1 = require('./crawlers/maringa-com-2')
const slackChatUrl = require('./settings')

async function run() {
    let { data } = await axios.put(
        'https://crawler-cursos-maringa.firebaseio.com/courses-portal-1.json',
        await crawler1()
    )
    console.log('> Salvo com sucesso no Banco de Dados')
    console.log('> #Enviando para o Slack')
    await axios.post(
        slackChatUrl.welliton,
        {
            text: `*Um excelente dia de trampo gurizada* :genkai:\nMas antes se liguem só nesses cursos aqui em Maringá\n\n\n${data.text}`
        }
    )
    console.log('> #Coleta e postagem realizada com sucesso')
}

run()