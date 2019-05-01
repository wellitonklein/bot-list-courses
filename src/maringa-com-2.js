const puppeteer = require('puppeteer')

;(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        devtools: false
    })
    const page = await browser.newPage()
    const baseUrl = 'http://www.maringa.com/cursos/index.php?nome=&dataIniMat=&dataFim=&pagina=1'
    let urlCurrent = `${baseUrl}`
    let nextUrl = ''
    let lastUrl = ''
    let data = []

    try {
        await page.goto(
            `${baseUrl}`,
            { waitUntil: 'domcontentloaded' }
        )

        const titleSelector = '#conteudo_secao > div.conteudo_pagina > div > h2 > a'        
        const btnNextSelector = '#paginacao > a:nth-child(11)'
        const btnLastSelector = '#paginacao > a:nth-child(12)'

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
            data.push(detail)

            nextUrl = await page.evaluate(btnNextSelector => {
                const anchors = Array.from(document.querySelectorAll(btnNextSelector))
                return anchors.map((anchor) => anchor.href)
            }, btnNextSelector)     
            
            if (String(lastUrl) == String(nextUrl)) {
                console.log('> Chegou ao final desse site.')
                break;
            }
        }

        data = {
            site: baseUrl,
            ...data
        }
        console.log('data', data)

        await page.close()
        await browser.close()
    } catch (error) {
        console.log('Oops: ', error)
    }
})()

async function getData () {

}