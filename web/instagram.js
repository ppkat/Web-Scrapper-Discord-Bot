const puppeteer = require('puppeteer')
require('dotenv').config()

async function puppInstagramLogin(){

    //open browser on instagram
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage();
    await page.goto('https://www.instagram.com/')

    //login on instagram with bot account
    await page.waitForSelector('[name="username"]')
    await page.type('[name="username"]', process.env.LOGIN_EMAIL_INSTAGRAM)
    await page.type('[type="password"]', process.env.LOGIN_PASSWORD_INSTAGRAM)
    await page.click('[type="submit"]')
    
    await browser.close()

}

module.exports = {
    puppInstagramLogin
}