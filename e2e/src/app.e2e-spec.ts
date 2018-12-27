import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('Test suite info first tab to be Report', () => {
    page.navigateTo();
  });

  it('should show item when you click on it', function() {
    page.clickOnMenuItem('Configuration');
  });

  it('testCase page should open on click of test case link', function() {
    page.clickOnTestCaseLink('17849');
  });
});
