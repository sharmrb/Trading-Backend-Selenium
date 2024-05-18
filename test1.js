// var webdriver = require('selenium-webdriver');
 
// var driver = new webdriver.Builder().
//    withCapabilities(webdriver.Capabilities.chrome()).
//    build();
 
// await driver.get('https://robinhood.com/login/');
// //driver.findElement(webdriver.By.name('username')).sendKeys('sharmrb@mail.uc.edu');
// await driver.findElement(webdriver.By.name('username')).sendKeys('sharmrb@mail.uc.edu');

const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path=require('path');

async function loginRobinhood() {
    const profilePath = 'C:\\Users\\risha\\AppData\\Local\\Google\\Chrome\\User Data';
    const profileDirectory = 'Profile 4';
    let options = new chrome.Options();
    options.addArguments('disable-dev-shm-usage');
    options.addArguments(`user-data-dir=${profilePath}`);
    options.addArguments(`profile-directory=${profileDirectory}`);

       // Path to your ChromeDriver
       const chromeDriverPath = path.resolve('path/to/your/chromedriver.exe');
       
    let driver = new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        await driver.get('https://robinhood.com/login/');

        // // Wait until the username field is present
        // await driver.wait(until.elementLocated(By.name('username')), 10000);
        // let usernameField = await driver.findElement(By.name('username'));
        // await usernameField.sendKeys('sharmrb@mail.uc.edu');

        // // Wait until the password field is present
        // await driver.wait(until.elementLocated(By.name('password')), 10000);
        // let passwordField = await driver.findElement(By.name('password'));
        // await passwordField.sendKeys('Kingfisher09/');

        // // Submit the form
        // await passwordField.sendKeys(Key.RETURN);

        // Wait for potential MFA
        // try {
        //     await driver.wait(until.elementLocated(By.name('mfa')), 10000);
        //     let mfaField = await driver.findElement(By.name('mfa'));
        //     await mfaField.sendKeys('yourmfacode');
        //     await mfaField.sendKeys(Key.RETURN);
        // } catch (error) {
        //     console.log('MFA not required or not detected');
        // }

        // Wait until the dashboard page loads
        await driver.wait(until.urlContains('dashboard'), 10000);

        console.log('Login successful');
    } catch (error) {
        console.error(`Error during login: ${error.message}`);
    } finally {
        // await driver.quit();
    }
}

// Call the async function
loginRobinhood();
