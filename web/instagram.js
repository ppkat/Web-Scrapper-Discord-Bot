const puppeteer = require('puppeteer')
const instagram = require('user-instagram');
require('dotenv').config({ path: '../.env' })

let websocketURL = ''

async function createBrowserInstance() {

    const browser = await puppeteer.launch({ headless: false });
    websocketURL = browser.wsEndpoint()
    const page = (await browser.pages())[0]
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
            const errorBody = page.$('.p-error.dialog-404')
            if(res.status === 404 || errorBody) return false

            return true
        })

        return returned
    }

    async function searchForUser(user) {

        await page.goto('https://www.instagram.com')
        await page.waitForSelector('[aria-label="Entrada da pesquisa"]')
        await page.type('[aria-label="Entrada da pesquisa"]', user)
        await page.waitForSelector('.fuqBx') //div that contain the search results

        const noResultsDiv = await page.$('._1fBIg')
        if (noResultsDiv) return 'Invalid Username'

        await page.waitForSelector('.-qQT3') //<a> tags with the user profiles links on search bar
        const possibleUsersNames = await page.$$eval('.-qQT3' , searchedResults => {

            const usersList = searchedResults.filter(item => !item.href.includes('/explore/'))
            const possibleUsers = usersList.filter((item, i) => i <= 10)
            return possibleUsers.map(item => item.children[0].children[1].children[0].children[0].children[0].children[0].innerHTML)

        })
        return possibleUsersNames
    }

    return func({ checkIfUserExists, searchForUser })
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

module.exports = {
    puppInstagram,
    getUserInstagramInfo
}