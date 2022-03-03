const puppeteer = require('puppeteer')
const instagram = require('user-instagram');
require('dotenv').config({ path: '../.env' })

async function puppInstagramLogin() {

    //open browser on instagram
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage();
    await page.goto('https://www.instagram.com/')

    //login on instagram with bot account
    await page.waitForSelector('[name="username"]')
    await page.type('[name="username"]', process.env.LOGIN_EMAIL_INSTAGRAM)
    await page.type('[type="password"]', process.env.LOGIN_PASSWORD_INSTAGRAM)
    await page.click('[type="submit"]')

    //await browser.close()

}

async function getUserInstagramInfo(user) {

    //login
    await instagram.authenticate(process.env.LOGIN_EMAIL_INSTAGRAM_PERSONAL_ACCOUNT, process.env.LOGIN_PASSWORD_INSTAGRAM_PERSONAL_ACCOUNT)

    const userData = instagram.getUserData(user).then(data => {
        return {
            username: data.getUsername(),
            biography: data.getBiography(),
            publicationsCount: data.getPublicationsCount(),
            followersCount: data.getFollowersCount(),
            externalUrl: data.getExternalUrl(),
            followingCount: data.getFollowingCount(),
            fullName: data.getFullName(),
            highlightsReelsCount: data.getHighlightsReelsCount(),
            id: data.getId(),
            businessAdressJson: data.getBusinessAddressJson(),
            businessContactMethod: data.getBusinessContactMethod(),
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
    puppInstagramLogin,
    getUserInstagramInfo
}