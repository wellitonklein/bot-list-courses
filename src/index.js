const axios = require('axios');
const crawler1 = require('./maringa-com-2')

async function run() {
    let response = await axios.put(
        'https://crawler-cursos-maringa.firebaseio.com/courses-portal-1.json',
        await crawler1()
    )
    console.log(response)
}

run()