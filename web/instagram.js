const puppeteer = require('puppeteer')
const instagram = require('user-instagram');
const ig = require('instagram-scraping')
require('dotenv').config({ path: '../.env' })

let websocketURL = ''

async function createBrowserInstance() {

    const browser = await puppeteer.launch({ headless: false });
    websocketURL = browser.wsEndpoint()
    const page = (await browser.pages())[0]

    page.on('console', msg => console.log('browser console: ', msg.text()))

    await page.goto('https://www.instagram.com/');
    await page.waitForSelector('[name="username"]');
    await page.type('[name="username"]', process.env.LOGIN_EMAIL_INSTAGRAM);
    await page.type('[type="password"]', process.env.LOGIN_PASSWORD_INSTAGRAM);
    await page.click('[type="submit"]');
    await page.waitForNavigation();
}

async function puppInstagram(func) {
    if (websocketURL === '') await createBrowserInstance()

    const browser = await puppeteer.connect({ browserWSEndpoint: websocketURL })
    const page = (await browser.pages())[0]

    async function checkIfUserExists(user) {
        let returned = await page.goto(`https://www.instagram.com/${user}`).then(async res => {
            await page.waitForSelector('body')
            const errorBody = await page.$('.p-error.dialog-404')
            if (res.status === 404 || errorBody) return false

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

    async function exploreImages() {

        await page.waitForSelector('[href="/explore/"]')
        await page.click('[href="/explore/"]')

        await page.waitForSelector('div.QzzMF.Igw0E.IwRSH.eGOV_._4EzTm.NUiEW')
        await page.waitForTimeout(1500)

        const postsJSHandle = await page.$$('div.QzzMF.Igw0E.IwRSH.eGOV_._4EzTm.NUiEW')
        await page.exposeFunction('getImagesSlides', async postIndex => {
            let post = postsJSHandle[postIndex]
            console.log('getImagesSlides sendo chamada')
            await page.evaluateHandle( post => post.firstChild.click(), post)
            console.log('passou do image link')
            await page.waitForSelector('button[aria-label="Avançar"]').then(async button => await button.click())
            console.log('passou daq')

            const postImageCollection = await page.$$eval('li.Ckrof', async imagesSlides => {
                let postImageCollection = []
                for (let imageSlide of imagesSlides){
                    console.log('for do getImageSlides')
                    postImageCollection.push(imageSlide.firstChild.firstChild.firstChild.firstChild.firstChild.src) 
                }
                return postImageCollection
            })

            await page.goBack()
            console.log('passou do for', postImageCollection)
            return postImageCollection
        })
        const images = await page.$$eval('div.QzzMF.Igw0E.IwRSH.eGOV_._4EzTm.NUiEW' ,async posts => {
            let images = []
            console.log('chegou no eval')

            for ( let i = 0; i < posts.length; i++) {
                const post = posts[i]
                console.log('chegou no for')
                //weather post has a svg on top left corner
                if (post.firstChild.children[1]) {
                    console.log('chegou no if que verifica svg')
                    if (post.firstChild.children[1].firstChild.ariaLabel === 'Carrossel'){
                        console.log('chegou no if do getImagesSlides')
                        await getImagesSlides(i).then(imagesSlides => images.push(imagesSlides))
                    } else {
                        console.log(post.firstChild.children[1].firstChild.ariaLabel)
                    }

                } else{ images.push(post.firstChild.firstChild.firstChild.firstChild.src)
                    console.log('chegou no else')}
            }
            return images
        })

        await page.goBack()
        return images
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

async function scrappInstagramTag(tag) {

}

puppInstagram(async ({ exploreImages, searchForUser }) => {
    console.log(await exploreImages())
})

module.exports = {
    puppInstagram,
    getUserInstagramInfo
}