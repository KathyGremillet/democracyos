/**
 * Module dependencies.
 */

var express = require('express');
var config = require('lib/config');
var log = require('debug')('democracyos:auth:routes');


/**
 * Expose auth app
 */

var app = module.exports = express();

/**
 * Logout
 */

app.post('/logout',
  function(req, res) {
    try {
      req.logout();
      log('Logging out user %s', req.user);
      res.send(200);
    } catch (err) {
      log('Failed to logout user: %s', err);
      res.send(500);
    }
  }
);

app.get('/.well-known/acme-challenge/:key', function(req, res) {
  if(config.https.certbotKey===''){
    log('no certbotKey defined')
    res.send(500);
  } else if (req.params.key!==config.https.certbotKey) {
    log('wrong certbot key %s',req.params.key)
    res.send(503);
  } else {
    res.status(200).send(config.https.certbotKey + '.' + config.https.certbotToken)
  }
});
