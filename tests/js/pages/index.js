module.exports = {
  url: function() { 
    return this.api.launchUrl; 
  },
  elements: {
  	loginBtn: {
  		selector: ".user-nav .login"
  	},
    userBadgeName: ".user-badge .name"
  },
  commands: [
    {
      clickOnSignin: function() {
        return this
          .waitForElementVisible("@loginBtn", 1000)
          .click("@loginBtn")
      }
    }
  ]
};