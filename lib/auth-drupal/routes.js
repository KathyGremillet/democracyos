/**
 * Module dependencies.
 */

var config = require('lib/config');
var express = require('express');
var passport = require('passport');
var log = require('debug')('democracyos:auth:drupal:routes');
var User = require('lib/models').User;
var jwt = require('lib/jwt');

/**
 * Expose auth app
 */

var app = module.exports = express();

/*
 * Google Auth routes
 */

app.get('/auth/push',
  passport.authenticate('oauth2', {scope: 'normal'}),
  function(req, res) {
    log('/auth/push');
    log('Log in user %s', req.user.id);
    jwt.setUserOnCookie(req.user, res);
    return res.redirect('/');
  }
);

app.get('/auth/callback',
  passport.authenticate('oauth2', {scope: 'normal'}),
  function(req, res) {
    // After successful authentication
    // redirect to homepage.
    log('Log in user %s', req.user.id);
    jwt.setUserOnCookie(req.user, res);
    return res.redirect('/');
  }
);
