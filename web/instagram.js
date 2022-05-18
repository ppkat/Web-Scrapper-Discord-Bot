const puppeteer = require('puppeteer')
const instagram = require('user-instagram');
const ig = require('instagram-scraping')
require('dotenv').config()

let websocketURL = ''
let isLoggedIn;

async function createBrowserInstance() {

    const browser = await puppeteer.launch({ headless: false });
    websocketURL = browser.wsEndpoint()
}

async function loginInstagram(email, password, page) {
    await page.waitForSelector('[name="username"]');
    await page.type('[name="username"]', email);
    await page.type('[type="password"]', password);
    await page.click('[type="submit"]');
    await page.waitForNavigation();
}

async function webScrapInstagram(func) {
    if (websocketURL === '') {
        await createBrowserInstance()
        isLoggedIn = false
    }

    const browser = await puppeteer.connect({ browserWSEndpoint: websocketURL })
    const page = await browser.newPage()
    page.on('console', msg => console.log('browser console: ', msg.text()))
    await page.goto('https://www.instagram.com/');

    if (!isLoggedIn) {
        await loginInstagram(process.env.LOGIN_EMAIL_INSTAGRAM, process.env.LOGIN_PASSWORD_INSTAGRAM, page)
        isLoggedIn = true
    }
    await page.reload()

    async function checkIfUserExists(user) {
        let returned = await page.goto(`https://www.instagram.com/${user}`).then(async res => {
            await page.waitForSelector('body')
            const errorBody = await page.$('.p-error.dialog-404')
            if (res.status() === 404 || errorBody) return false

            return true
        })
        await page.goBack()
        return returned
    }

    async function searchForUser(user) {

        await page.waitForSelector('[aria-label="Entrada da pesquisa"]')
        await page.type('[aria-label="Entrada da pesquisa"]', user)
        await page.waitForSelector('.fuqBx') //div that contain the search results

        const noResultsDiv = await page.$('._1fBIg')
        if (noResultsDiv) return 'Invalid Username'

        await page.waitForSelector('.-qQT3') //<a> tags with the user profiles links on search bar
        const possibleUsersNames = await page.$$eval('.-qQT3', searchedResults => {

            const usersList = searchedResults.filter(item => !item.href.includes('/explore/'))
            const possibleUsers = usersList.filter((item, i) => i <= 10)
            return possibleUsers.map(item => item.firstChild.children[1].firstChild.firstChild.firstChild.firstChild.innerHTML)

        })
        return possibleUsersNames
    }

    async function exploreImages(quantity) {
        quantity = quantity ?? 1
        quantity = quantity > 10 ? 10 : quantity

        let images = []
        let postURL = []

        await page.waitForSelector('[href="/explore/"]')
        await page.click('[href="/explore/"]')

        await page.waitForSelector('div.QzzMF.Igw0E.IwRSH.eGOV_._4EzTm.NUiEW')
        await page.waitForTimeout(200) //load posts

        let postsJSHandle = await page.$$('div.QzzMF.Igw0E.IwRSH.eGOV_._4EzTm.NUiEW')

        async function getImagesSlides(postIndex) {

            postsJSHandle = await page.$$('div.QzzMF.Igw0E.IwRSH.eGOV_._4EzTm.NUiEW')
            let post = postsJSHandle[postIndex]

            await page.evaluateHandle(post => post.firstChild.click(), post) //click on the <a> tag
            let postURL = page.url()
            await page.waitForSelector('button[aria-label="Avançar"]')

            let postImageCollectionURLs = []
            let advanceButtonHandle = await page.$('button[aria-label="Avançar"]')
            await page.waitForTimeout(200)

            for (i = 0; advanceButtonHandle; i++) {

                postImageCollectionURLs.push(await page.$$eval('li.Ckrof', async (imageSlides, i) => {
                    const currentImgTagSrc = imageSlides[i == 0 ? 0 : 1].firstChild.firstChild.firstChild.firstChild.firstChild.src ??
                        imageSlides[i == 0 ? 0 : 1].firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.src

                    return currentImgTagSrc
                }, i))

                if (!postImageCollectionURLs[i]) postImageCollectionURLs.pop() //case have not an image on the page of post 

                await page.evaluate(advanceButton => advanceButton.click(), advanceButtonHandle)
                advanceButtonHandle = await page.$('button[aria-label="Avançar"]')
                await page.waitForTimeout(200)
            }

            postImageCollectionURLs.push(await page.$$eval('li.Ckrof', async imageSlides => {
                const currentImgTagSrc = imageSlides[1].firstChild.firstChild.firstChild.firstChild.firstChild.src ??
                    imageSlides[1].firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.src

                return currentImgTagSrc
            }))

            if (!postImageCollectionURLs[postImageCollectionURLs.length - 1]) postImageCollectionURLs.pop()

            await page.goBack()

            return [postImageCollectionURLs, postURL]
        }

        for (let i = 0; i < postsJSHandle.length && images.length < quantity; i++) {
            const postHandle = postsJSHandle[i]

            const isImageCollection = await page.evaluate(post => {
                return post.firstChild.children[1] ? (post.firstChild.children[1].firstChild.ariaLabel === 'Carrossel' ? true : false) : false
            }, postHandle)

            if (isImageCollection) {
                await getImagesSlides(i).then(([imagesSlides, URL]) => {

                    if (imagesSlides.length > 0) images.push(imagesSlides) && postURL.push(URL)
                })
            }
            else {
                postURL.push(await page.evaluate(post => post.firstChild.href, postHandle))
                images.push(await page.evaluate(post => post.firstChild.firstChild.firstChild.firstChild.src, postHandle))
            }

        }

        await page.goBack()
        return { images, postURL }
    }

    return func({ checkIfUserExists, searchForUser, exploreImages })
}

async function getUserInstagramInfo(user) {

    //login
    await instagram.authenticate(process.env.LOGIN_EMAIL_INSTAGRAM, process.env.LOGIN_PASSWORD_INSTAGRAM)

    const userData = instagram.getUserData(user).then(data => {
        return {
            username: data.getUsername(),
            biography: data.getBiography(),
            publicationsCount: data.getPublicationsCount().toString(),
            followersCount: data.getFollowersCount().toString(),
            externalUrl: data.getExternalUrl(),
            followingCount: data.getFollowingCount().toString(),
            fullName: data.getFullName(),
            highlightsReelsCount: data.getHighlightsReelsCount().toString(),
            id: data.getId().toString(),
            businessAdressJson: data.getBusinessAddressJson(),
            businessContactMethod: data.getBusinessContactMethod().toString(),
            businessEmail: data.getBusinessEmail(),
            businessPhoneNumber: data.getBusinessPhoneNumber(),
            businessCategoryName: data.getBusinessCategoryName(),
            overallCategoryName: data.getOverallCategoryName(),
            categoryEnum: data.getCategoryEnum(),
            profilePicture: data.getProfilePicture(),
            hdProfilePicture: data.getHdProfilePicture(),
            pronouns: data.getPronouns(),
            //medias: data.getMedias(),
            business: data.isBusinessAccount(),
            verified: data.isVerified(),
            private: data.isPrivate(),
        }
    })

    return userData
}

async function getFollowers(user, quantity) {
    if (websocketURL === '') await createBrowserInstance()
    const browser = await puppeteer.launch({headless: false}) //unfortunally, on login on instagram in one tab, unlog in other. Then it needs other browser

    const gmailPage = await browser.newPage()
    await gmailPage.goto('https://accounts.google.com/signin')

    await gmailPage.type('[type="email"]', process.env.GMAIL_ACCOUNT)
    await gmailPage.keyboard.press('Enter')
    await gmailPage.waitForTimeout(1500)
    await gmailPage.waitForSelector('[type="password"]')
    await gmailPage.type('[type="password"]', process.env.GMAIL_PASSWORD)
    await gmailPage.keyboard.press('Enter')
    await gmailPage.waitForNavigation()

    async function createAccount(username, page, index) {

        const password = process.env.LOGIN_PASSWORD_INSTAGRAM + index.toString()
        const fullName = process.env.MINIONS_USERNAME.slice(0, 4) + process.env.MINIONS_USERNAME.slice(5) + index.toString()
        const email = `${process.env.GMAIL_ACCOUNT.slice(0,-11)}+${index}${process.env.GMAIL_ACCOUNT.slice(-10)}`
        await page.goto('https://www.instagram.com/accounts/emailsignup/')
        await page.waitForSelector('[name="emailOrPhone"]')
        await page.type('[name="emailOrPhone"]', email)
        await page.type('[name="fullName"]', fullName)
        await page.type('[name="username"]', username)
        await page.type('[name="password"]', password)
        await page.click('[type="submit"]')
        await page.waitForNavigation()
    }

    for (i = 0; i < quantity; i++){

        const instagramPage = await browser.newPage()
        await instagramPage.goto(`https://www.instagram.com/${user}`);
        
        const username = `${process.env.MINIONS_USERNAME}${i}`
        await createAccount(username, instagramPage, i)

        await loginInstagram(user, '123', instagramPage)
    }
}

getFollowers('abcdef', 6)

module.exports = {
    puppInstagram: webScrapInstagram,
    getUserInstagramInfo,
}