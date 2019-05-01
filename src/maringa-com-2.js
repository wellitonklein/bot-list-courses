const puppeteer = require('puppeteer')

;(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        devtools: false
    })
    const page = await browser.newPage()
    const baseUrl = 'http://www.maringa.com/cursos/index.php?nome=&dataIniMat=&dataFim=&pagina=1'
    let nextUrl = ''
    let lastUrl = ''
    let data = []

    try {
        await page.goto(
            `${baseUrl}`,
            { waitUntil: 'domcontentloaded' }
        )

        const titleSelector = '#conteudo_secao > div.conteudo_pagina > div > h2 > a'        
        const btnNextSelector = '#paginacao > a:nth-child(9)'
        const btnLastSelector = '#paginacao > a:nth-child(10)'

        await page.waitForSelector(btnLastSelector)
        lastUrl = await page.evaluate(btnLastSelector => {
            const anchors = Array.from(document.querySelectorAll(btnLastSelector))
            return anchors.map((anchor) => anchor.href)
        }, btnLastSelector)  

        console.log('> Iniciando a varredura')
        while (true) {            
            await page.goto(
                `${nextUrl || baseUrl}`,
                { waitUntil: 'domcontentloaded' }
            )            
            await page.waitForSelector(titleSelector)

            const detail = await page.evaluate(titleSelector => {
                const anchors = Array.from(document.querySelectorAll(titleSelector))
                return anchors.map((anchor) => {
                    return {
                        title: anchor.textContent,
                        url: anchor.href
                    }
                })
            }, titleSelector)
            data.push(...detail)

            nextUrl = await page.evaluate(btnNextSelector => {
                const anchors = Array.from(document.querySelectorAll(btnNextSelector))
                return anchors.map((anchor) => anchor.href)
            }, btnNextSelector)     
            
            if (String(lastUrl) === String(nextUrl)) {
                console.log('> Chegou ao final desse site.')
                break;
            }
        }

        await page.close()
        await browser.close()

        let dataFormatted = ''
        for (let i = 0; i <= data.length; i++) {
            try {
                dataFormatted = `${dataFormatted}\n*${data[i].title}*\n${data[i].url}`
            } catch (e) {

            }
        }

        return {
            text: dataFormatted,
            site: baseUrl
        }
    } catch (error) {
        console.log('Oops: ', error)
    }
})()