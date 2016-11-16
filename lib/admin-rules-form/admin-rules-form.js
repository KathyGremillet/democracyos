/**
 * Module dependencies.
 */

var FormView = require('./form-view');
var log = require('debug')('democracyos:admin-rules-form');
var page = require('page');
var request = require('../request/request.js');

var config = require('../config/config.js');

page('/admin/rules/create', function (ctx, next) {
  var form = new FormView();
  form.replace('#admin-content');
});

page('/admin/rules/:id', load, function (ctx, next) {
  var form = new FormView(ctx.rule);
  form.replace('#admin-content');
});

/**
 * Load specific rule from context params
 */

function load(ctx, next) {
  request
  .get(config.subPath + '/api/rules/' + ctx.params.id)
  .end(function(err, res) {
    if (err || !res.ok) {
      var message = 'Unable to load rules for ' + ctx.params.id;
      return log(message);
    }
    ctx.rule = res.body;
    return next();
  });
}
