var config = require('lib/config');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('lib/models').User;
var utils = require('lib/utils');
var log = require('debug')('democracyos:auth-facebook');

/**
 * Register Facebook Strategy
 */

module.exports = function() {
  var callbackURL = utils.buildUrl(config, {
    hostname: config.auth.exposedHost,
    port: config.auth.exposedPort,
    pathname: config.subPath.concat('/auth/facebook/callback')
  });

  passport.use(
    new FacebookStrategy({
      clientID: config.auth.facebook.clientId,
      clientSecret: config.auth.facebook.clientSecret,
      callbackURL: callbackURL,
      profileFields: ['id', 'first_name', 'last_name', 'age_range', 'photos', 'email'],
      enableProof: false
    },
    function(accessToken, refreshToken, profile, done) {
      User.findByProvider(profile, function (err, user) {
        if (err) return done(err);

        if (!user) return signup(profile, accessToken, done);

        log('profile : %j',profile);

        var email = profile._json.email;
        if (user.email !== email) {
          user.set('email', email);
          user.set('profiles.facebook.email', email);
        }

        if (user.profiles.facebook.deauthorized) {
          user.set('profiles.facebook.deauthorized');
        }

        user.isModified() ? user.save(done) : done(null, user);
      });
    })
  );
}

/**
 * Facebook Registration
 *
 * @param {Object} profile PassportJS's profile
 * @param {Function} fn Callback accepting `err` and `user`
 * @api public
 */

function signup (profile, accessToken, fn) {
  var user = new User();

  log('profile : %j',profile);

  user.firstName = profile._json.first_name;
  user.lastName = profile._json.last_name;
  user.profiles.facebook = profile._json;
  user.email = profile._json.email;
  user.emailValidated = true;
  user.profilePictureUrl = 'https://graph.facebook.com/' + profile._json.id + '/picture';
  user.save(function(err) {
    return fn(err, user);
  });
}
