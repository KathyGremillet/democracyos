/**
 * Module dependencies.
 */

var express = require('express');
var api = require('lib/db-api');
var config = require('lib/config');
var utils = require('lib/utils');
var accepts = require('lib/accepts');
var staff = utils.staff;
var pluck = utils.pluck;
var log = require('debug')('democracyos:rules-api');

var slugify = require('mout/string/slugify');

if (!config.rules) return;

var app = module.exports = express();

/**
 * Limit request to json format only
 */

app.use(accepts('application/json'));

app.get('/rules/all', function (req, res) {
  log('Request /rules/all');

  api.rules.all(function(err, rules) {
    if (err) return _handleError(err, req, res);

    log('Serving rules %j', pluck(rules, 'id'));

    res.json(rules);
  });
});

app.get('/rules/roles', function (req, res) {
  log('Request /rules/roles');

  api.rules.search({type: 'role'}, function(err, rules) {
    if (err) return _handleError(err, req, res);

    log('Serving rules %j', rules);

    res.json(rules);
  });
});

app.get('/rules/:id', function (req, res) {
  var id = req.params.id;
  log('Request /rules/%s', id);

  api.rules.get(id, function(err, rules) {
    if (err) return _handleError(err, req, res);

    log('Serving rules %j', rules);

    res.json(rules);
  });
});

app.post('/rules/create', staff, function (req, res) {
  log('Request /rules/create %j', req.body);

  // Convert JSON String to actual Object
  req.body.value = req.body.value ? JSON.parse(req.body.value) : {};
  req.body.name = slugify(req.body.name, '_') ;

  api.rules.create(req.body, function (err, rules) {
    if (err) return  _handleError(err, req, res);

    log('Saved rule %s', rules.id);
    res.json(rules);
  });
});

app.post('/rules/:id', staff, function (req, res) {
  log('Request /rules/:id %j', req.params.id, req.body);

  // Convert JSON String to actual Object
  req.body.value = req.body.value ? JSON.parse(req.body.value) : {};
  req.body.name = slugify(req.body.name, '_') ;

  api.rules.update(req.params.id, req.body, function (err, rules) {
    if (err) return _handleError(err, req, res);

    log('Serving rules %s', rules);
    res.json(rules.toJSON());
  });
});

app.delete('/rules/:id', staff, function (req, res) {
  var id = req.params.id;
  log('Request /rules/%s', id);

  api.rules.remove(id, function(err) {
    if (err) return _handleError(err, req, res);

    log('Rules %j deleted successfully', id);

    res.status(200).send();
  });
});

function _handleError (error, req, res) {
  log("Error found: %O", error);
  res.send(400,error.err);
}
