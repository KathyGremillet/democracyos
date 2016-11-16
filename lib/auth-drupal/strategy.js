/*
 * Module dependencies
 */
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth2').Strategy;
var User = require('lib/models').User;

/**
 * Expose DrupalStrategy
 */

module.exports = DrupalStrategy;

/**
 * Register Auth Strategies for app
 */

function DrupalStrategy () {
  /**
   * Register Local Strategy
   */

  passport.use(new OAuth2Strategy(
    {
      authorizationURL: 'https://agora.d7.beta.dev.dd:8443/oauth2/authorize',
      tokenURL: 'https://agora.d7.beta.dev.dd:8443/oauth2/token',
      clientID: 'democracyos-local',
      clientSecret: 'ZPTh229un21Vj4m9EY6r36xHDDt5r5np',
      callbackURL: 'https://agora.d7.beta.dev.dd:8443/debat/auth/push',
      customHeaders: {
        allow_implicit: true,
      },
      passReqToCallback: true,
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOrCreate({ exampleId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  ));

}
