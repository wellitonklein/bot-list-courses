const puppeteer = require('puppeteer')

;(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        devtools: false
    })
    const page = await browser.newPage()
    const baseUrl = 'http://www.maringa.com/cursos/'
    const restUrl = 'index.php?nome=&dataIniMat=&dataFim=&pagina='
    const pages = 8
    let data = []

    try {
        for (let pageIndex = 1; pageIndex <= pages; pageIndex++) {  
                      
            await page.goto(
                `${baseUrl}${restUrl}${pageIndex}`,
                { waitUntil: 'domcontentloaded' }
            )

            console.log(`Site ${pageIndex}`, `${baseUrl}${restUrl}${pageIndex}`)

            const titleSelector = '#conteudo_secao > div.conteudo_pagina > div > h2 > a'
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