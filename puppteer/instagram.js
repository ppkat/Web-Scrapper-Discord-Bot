const puppeteer = require('puppeteer')
require('dotenv').config()

async function puppInstagramLogin(){

    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage();
    await page.goto('https://www.instagram.com/')

    //entrando no instagram
    await page.waitForSelector('[name="username"]')
    await page.type('[name="username"]', process.env.LOGIN_EMAIL)
    await page.type('[type="password"]', process.env.LOGIN_PASSWORD)
    await page.click('[type="submit"]')

}

