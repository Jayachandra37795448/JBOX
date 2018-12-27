import { browser, by, element, $, $$ } from 'protractor';

export class AppPage {
  private menu = $('#testSuiteTabs');

  navigateTo() {
    browser.ignoreSynchronization = true;
    return browser.get('/testSuite/17319');
  }

  getParagraphText() {
    browser.sleep(6000);
    browser.wait(result => {
      return element(by.className('majorHeading')).getText();
    }, 1);
  }

  clickOnMenuItem = function (name) {
    browser.ignoreSynchronization = true;
    browser.sleep(6000);

    element(by.linkText(name)).isDisplayed().then(function(visible){
      if (visible) {
        element(by.linkText(name)).click();
      }
    }, function () {
    });

    browser.sleep(5000);
  };

  getMenuItems = function() {
    return this.menu.$$('li').map(function(item) {
      return item.getText();
    });
  };

  clickOnTestCaseLink = function(testCaseId) {
    this.hoverOnLinkBeforeClick(testCaseId);
    browser.ignoreSynchronization = true;
    browser.sleep(6000);

    element(by.id(testCaseId)).isDisplayed().then(function(visible){
      if (visible) {
        element(by.id(testCaseId)).click();
      }
    }, function () {
    });
    browser.sleep(5000);
  };

  hoverOnLinkBeforeClick = function(testCaseId) {
    browser.manage().timeouts().implicitlyWait(6000);
    element(by.id(testCaseId)).isDisplayed().then(function(visible){
      if (visible) {
        browser.actions().mouseMove(element(by.id(testCaseId ))).perform();
      }
    }, function () {
    });
    browser.manage().timeouts().implicitlyWait(3000);
  };
}

