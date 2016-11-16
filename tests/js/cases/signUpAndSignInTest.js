module.exports = {
  'DemocracyOS Signup then signin test' : function (browser) {
    var TIMEOUT = 1000;

    var indexPage = browser.page.index();
    var signinPage = browser.page.signin();
    var signupPage = browser.page.signup();
    var signupConfirmPage = browser.page.signupConfirmation();

    var USER = {
      email: 'test-' + new Date().getTime() + '@test.test',
      password: 'testtest',
      firstName: 'alexandre',
      lastName: 'pichon'
    }

    indexPage
      .navigate()
      .clickOnSignin();

    signinPage
      .clickOnSignup()

    signupPage
      .signupWithUser(USER)

    signupConfirmPage
      .waitForElementVisible("@successMessage", TIMEOUT)
      .assert.containsText("@successMessage", "Bienvenue")
      .assert.containsText("@successMessage", USER.firstName)
      .assert.containsText("@successMessage", USER.lastName)

    indexPage
      .clickOnSignin();

    signinPage
      .signinWithUser(USER)

    indexPage
      .waitForElementVisible("@userBadgeName", TIMEOUT)
      .assert.containsText("@userBadgeName", USER.firstName.toUpperCase())

    browser
      .end();
  }
};
