const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

async function useExistingProfile() {
    // Path to your Chrome user data directory and specific profile
    const profilePath = 'C:\\Users\\risha\\AppData\\Local\\Google\\Chrome\\User Data';
    const profileDirectory = 'Profile 4';

    // Path to your ChromeDriver executable
    const chromeDriverPath = path.resolve('C:\\Users\\risha\\Downloads\\chromedriver-win64\\chromedriver-win64\\chromedriver.exe');

    // Set up Chrome options
    let options = new chrome.Options();
    options.addArguments(`user-data-dir=${profilePath}`);
    options.addArguments(`profile-directory=${profileDirectory}`);
    options.addArguments('--remote-debugging-port=9222');
    options.addArguments('--disable-extensions');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--disable-software-rasterizer');
    // options.addArguments('--headless=new'); // Uncomment if you want headless mode

    // Set ChromeDriver service
    let service = new chrome.ServiceBuilder(chromeDriverPath).build();

    // Create a new driver instance with the specified options and service
    let driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .setChromeService(service.getExecutablePath()) // Change this line
    .build();

    try {
        // Navigate to the Robinhood login page
        await driver.get('https://robinhood.com/');
        
        // If needed, perform any additional actions after opening the browser
        // Assuming you're already logged in, you should see the dashboard or home page
        console.log('Using existing Chrome profile');
    } catch (error) {
        console.error(`Error: ${error.message}`);
    } finally {
        // Uncomment the next line if you want to close the browser after the script finishes
        // await driver.quit();
    }
}

// Call the async function
useExistingProfile();
