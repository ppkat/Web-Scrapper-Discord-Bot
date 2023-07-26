const { chromium } = require('playwright');
require('dotenv');

(async () => {
    const browser = await chromium.launch({ headless: false })
    const page = await browser.newPage()

    // Go to https://www.instagram.com/
    await page.goto('https://www.instagram.com/');
    // Click [aria-label="Senha"]
    await page.locator('[aria-label="Senha"]').click();
    // Fill [aria-label="Senha"]
    await page.locator('[aria-label="Senha"]').fill('H/ZpM#XhUwPVD1DaP<');
    // Click [aria-label="Telefone\, nome de usuário ou email"]
    await page.locator('[aria-label="Telefone\\, nome de usuário ou email"]').click();
    // Fill [aria-label="Telefone\, nome de usuário ou email"]
    await page.locator('[aria-label="Telefone\\, nome de usuário ou email"]').fill('ppbot8641@protonmail.com');
    // Click button:has-text("Entrar") >> nth=0
    await page.locator('button:has-text("Entrar")').first().click();
    // Click [aria-label="Encontrar pessoas"]
    await page.locator('[aria-label="Encontrar pessoas"]').click();
    
    // Click div:nth-child(2) > ._ab8x > .oajrlxb2 > ._aagu > ._aagw >> nth=0
    await page.locator('div:nth-child(2) > ._ab8x > .oajrlxb2 > ._aagu > ._aagw').first().click();
    // Click div[role="button"]:has-text("Fechar")
    await page.locator('div[role="button"]:has-text("Fechar")').click();
    
    // Click div:nth-child(3) > ._ab8x > .oajrlxb2 > ._aagu > ._aagw >> nth=0
    await page.locator('div:nth-child(3) > ._ab8x > .oajrlxb2 > ._aagu > ._aagw').first().click();
    // Click article[role="presentation"] [aria-label="Avançar"]
    await page.locator('article[role="presentation"] [aria-label="Avançar"]').click();
    // Click article[role="presentation"] [aria-label="Avançar"]
    await page.locator('article[role="presentation"] [aria-label="Avançar"]').click();
    // Click div[role="button"]:has-text("Fechar")
    await page.locator('div[role="button"]:has-text("Fechar")').click();
    
    // Click div:nth-child(4) > ._ab8x > .oajrlxb2 > ._aagu > ._aagw >> nth=0
    await page.locator('div:nth-child(4) > ._ab8x > .oajrlxb2 > ._aagu > ._aagw').first().click();
    // Click article[role="presentation"] [aria-label="Avançar"]
    await page.locator('article[role="presentation"] [aria-label="Avançar"]').click();
    // Click div[role="button"]:has-text("Fechar")
    await page.locator('div[role="button"]:has-text("Fechar")').click();
    
    // Click div:nth-child(5) > ._ab8x > .oajrlxb2 > ._aagu > ._aagw >> nth=0
    await page.locator('div:nth-child(5) > ._ab8x > .oajrlxb2 > ._aagu > ._aagw').first().click();
    // Click div[role="button"]:has-text("Fechar")
    await page.locator('div[role="button"]:has-text("Fechar")').click();
    

})()
