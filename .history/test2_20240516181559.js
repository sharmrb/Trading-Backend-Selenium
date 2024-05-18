// backend/index.js
const express = require('express');
const bodyParser = require('body-parser');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const app = express();
const cors = require('cors');
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

let driver; // Global driver instance
let loggedIn = false;

// Function to log in to Robinhood and maintain the session
async function loginRobinhood(username, password, mfaCode) {
    if (!driver) {
        driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build();
        try {
            await driver.get('https://robinhood.com/login');
            await driver.findElement(By.name('username')).sendKeys(username);
            await driver.findElement(By.name('password')).sendKeys(password);
            await driver.findElement(By.name('password')).sendKeys(Key.RETURN);

            if (mfaCode) {
                await driver.wait(until.elementLocated(By.name('mfa')), 10000);
                await driver.findElement(By.name('mfa')).sendKeys(mfaCode);
                await driver.findElement(By.name('mfa')).sendKeys(Key.RETURN);
            }

            await driver.wait(until.urlContains('dashboard'), 10000);
            console.log('Login successful');
            loggedIn = true;
        } catch (error) {
            await driver.quit();
            driver = null;
            loggedIn = false;
            throw error;
        }
    }
    return driver;
}

// Function to place a buy order
async function placeBuyOrder(symbol, quantity) {
    if (!loggedIn) throw new Error('Not logged in');
    try {
        await driver.get(`https://robinhood.com/stocks/${symbol}`);
        await driver.wait(until.elementLocated(By.name('quantity')), 10000);
        await driver.findElement(By.name('quantity')).sendKeys(quantity.toString());
        await driver.findElement(By.name('quantity')).sendKeys(Key.RETURN);
        await driver.findElement(By.xpath("//button[contains(text(), 'Review Order')]")).click();
        await driver.findElement(By.xpath("//button[contains(text(), 'Submit Buy')]")).click();
    } catch (error) {
        throw error;
    }
}

// Function to place a sell order
async function placeSellOrder(symbol, quantity) {
    if (!loggedIn) throw new Error('Not logged in');
    try {
        await driver.get(`https://robinhood.com/stocks/${symbol}`);
        await driver.wait(until.elementLocated(By.name('quantity')), 10000);
        await driver.findElement(By.name('quantity')).sendKeys(quantity.toString());
        await driver.findElement(By.name('quantity')).sendKeys(Key.RETURN);
        await driver.findElement(By.xpath("//button[contains(text(), 'Review Order')]")).click();
        await driver.findElement(By.xpath("//button[contains(text(), 'Submit Sell')]")).click();
    } catch (error) {
        throw error;
    }
}

// Route to log in and initialize the session
app.post('/login', async (req, res) => {
    const { username, password, mfaCode } = req.body;
    try {
        await loginRobinhood(username, password, mfaCode);
        res.status(200).send('Login successful and session initialized');
    } catch (error) {
        res.status(500).send(`Error during login: ${error.message}`);
    }
});

// Route to place a buy order
app.post('/buy-stock', async (req, res) => {
    const { symbol, quantity } = req.body;
    try {
        await placeBuyOrder(symbol, quantity);
        res.status(200).send('Buy order placed successfully');
    } catch (error) {
        res.status(500).send(`Error placing buy order: ${error.message}`);
    }
});

// Route to place a sell order
app.post('/sell-stock', async (req, res) => {
    const { symbol, quantity } = req.body;
    try {
        await placeSellOrder(symbol, quantity);
        res.status(200).send('Sell order placed successfully');
    } catch (error) {
        res.status(500).send(`Error placing sell order: ${error.message}`);
    }
});

// Route to log out and end the session
app.post('/logout', async (req, res) => {
    try {
        if (driver) {
            await driver.quit();
            driver = null;
            loggedIn = false;
            res.status(200).send('Logged out successfully');
        } else {
            res.status(500).send('No active session to log out');
        }
    } catch (error) {
        res.status(500).send(`Error during logout: ${error.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
