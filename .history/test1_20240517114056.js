var webdriver = require('selenium-webdriver');
 
var driver = new webdriver.Builder().
   withCapabilities(webdriver.Capabilities.chrome()).
   build();
 
driver.get('https://robinhood.com/login/');
driver.findElement(webdriver.By.name('username')).sendKeys('sharmrb@mail.uc.edu');