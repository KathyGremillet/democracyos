var mongoose = require('mongoose');
var express = require('express');
var api = require('lib/db-api');
var utils = require('lib/utils');
var restrict = utils.restrict;
var staff = utils.staff;
var maintenance = utils.maintenance;
var expose = utils.expose;
var Log = require('debug');
var regexps = require('lib/regexps');

var log = new Log('democracyos:forum-api');
var config = require('lib/config');

var app = module.exports = express();

app.get('/forum/all', function(req, res) {
  var page = parseInt(req.query.page, 10) || 0;
  var limit = 20;

  api.forum.all({
    limit: limit,
    skip: page * limit
  }, function (err, forums) {
    if (err) return _handleError(err, req, res);
    res.json(forums).send();
  });
});

app.get('/forum/exists', function(req, res, next) {
  if (!api.forum.nameIsValid(req.query.name)) {
    return res.status(200).json({ exists: true });
  }

  api.forum.exists(req.query.name, function(err, exists) {
    if (err) return next(err);
    return res.status(200).json({ exists: exists });
  });
});

app.get('/forum/mine', restrict, function(req, res) {
  if (!req.isAuthenticated()) return res.status(400).send();

  api.forum.findOneByOwner(req.user.id, function(err, forum) {
    if (err) return _handleError(err, req, res);

    if (forum) {
      return res.status(200).json(forum);
    } else {
      return res.status(404).send();
    }
  });
});

app.get('/forum/byname', function(req, res, next) {
  var name = req.query.name;

  log('forum-api /forum with %j',req.query);

  if (!name) return next()
  if (!regexps.forum.name.test(name)) return next()

  api.forum.findOneByName(name, function(err, forum) {
    if (err) return _handleError(err, req, res);

    if (forum) {
      return res.status(200).json(forum);
    } else {
      return res.status(404).send();
    }
  });
});

app.get('/forum/:id', function(req, res, next) {

  log('forum-api /forum/:id with %o',req.params);

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next();

  api.forum.findById(req.params.id, function(err, forum) {
    if (err) return _handleError(err, req, res);

    if (forum) {
      return res.status(200).json(forum);
    } else {
      return res.status(404).send();
    }
  });
});

app.post('/forum/create', restrict, maintenance, staff, function(req, res) {
  log('Request POST /forum/create');

  var data = {
    name: req.body.name,
    title: req.body.title,
    owner: req.user._id.toString(),
    body: req.body.body,
    summary: req.body.summary,
    imageUrl: req.body.image
  };

  log('Trying to create forum: %o', data);

  api.forum.create(data, function (err, forum) {
    if (err) return _handleError(err, req, res);
    log('Forum document created successfully');
    return res.status(200).json(forum);
  });
});

app.post('/forum/:id', staff, function (req, res) {
  log('Request POST /forum/%s', req.params.id);

  var data = {
    id: req.params.id,
    name: req.body.name,
    title: req.body.title,
    body: req.body.body,
    summary: req.body.summary,
    imageUrl: req.body.image
  };

  api.forum.update(req.params.id, data, function (err, forum) {
    if (err) return _handleError(err, req, res);

    log('Serving forum %s', forum.id);
    var keys = [
      'id name title body summary imageUrl'
    ].join(' ');

    res.json(expose(keys)(forum.toJSON()));
  });
});

app.delete('/forum/:id', restrict, maintenance, staff,function(req, res) {
  api.forum.findById(req.params.id, function(err, forum) {
    if (err) return _handleError(err, req, res);
    if (!forum) return _handleError('Forum not found.', req, res);

    log('Trying to delete forum: %s', forum.id);

    api.forum.del(forum, function(_err) {
      if (_err) return res.status(500).json(_err);

      res.status(200).send();
    });
  });
});


/**
 * Helper functions
 */

function _handleError (err, req, res) {
  log('Error found: %s', err);
  var error = err;
  if (err.errors && err.errors.text) error = err.errors.text;
  if (error.type) error = error.type;

  res.status(400).json({ error: error });
}
