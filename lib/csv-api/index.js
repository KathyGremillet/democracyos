/**
 * Module dependencies.
 */

var express = require('express');
var api = require('lib/db-api');

var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');
var Rules = mongoose.model('Rules');
var Tag = mongoose.model('Tag');
var Forum = mongoose.model('Forum');
var config = require('lib/config');
var utils = require('lib/utils');
var restrict = utils.restrict;
var staff = utils.staff;
var log = require('debug')('democracyos:csv');
var csv = require('json-csv')
var encoding = require("encoding");

var t = require('t-component');

var filter = require('mout/array/filter');
var replace = require('mout/string/replace');

var app = module.exports = express();

app.get('/all-comments', staff, getRules, function (req, res) {
  log('Request /csv/all');

  var locale = req.user ? ( req.user.locale || config.locale ) : config.locale ;

  var query = {
    context: 'topic',
    //createdAt: { $gt: new Date(1461076025199) }
  };

  Comment
  .find(query)
  .populate('author')
  .populate('topicId')
  .sort('topicId.forum reference createdAt')
  .exec(function (err, comments) {
    if (err) return _handleError(err, req, res);

    log('Found %s comments in total',comments.length);

    filtered = filter(comments,(comment,key,a) => {
      if(!comment.topicId){
        return false;
      } else if(comment.topicId.deletedAt){
        return false;
      } else if (!comment.topicId.publishedAt){
        return false;
      }
      return true;
    });

    log('Comments filtered to %s',filtered.length);

    Forum.populate(filtered, 'topicId.forum', function(err) {
      if (err) return _handleError(err, req, res);

      Tag.populate(filtered, 'topicId.tag', function(err) {
        if (err) return _handleError(err, req, res);

        var options = {
          fields: [],
          fieldSeparator: config.csv.separator
        };

        options.fields.push({
          name: 'topicId.forum.title',
          label: t('admin-topics-form.label.forum'),
          quoted: true
        });

        options.fields.push({
            name: 'topicId.mediaTitle',
            label: t('common.topic'),
            quoted: true
        });
        options.fields.push({
            name: 'alias',
            label: t('comments.alias.title'),
            quoted: true
        });
        options.fields.push({
            name: 'count',
            label: t('comments.count.title'),
            quoted: true
        });

        options.fields.push({
            name: 'author.id',
            label: 'user-id',
            quoted: true
        });

        if( config.userAge ) {
          options.fields.push({
              name: 'author.age',
              label: t('settings.age'),
              quoted: true,
              filter: function(value) {
                if(value) return t('settings.age.' + value);
              }
          });
        }


        if( 0 <= config.rules.indexOf('location') ){
          options.fields.push({
              name: 'author.location',
              label: t('settings.location'),
              quoted: true,
              filter: function(value) {
                if(value){
                  rule = filter(req.ctx.rules, {name: value});
                  if(rule.length){
                    log('found location : %O', rule) ;
                    return rule[0].value.label[locale] || rule[0].value.label.default ;;
                  }
                }
              }
          });
        }

        options.fields.push({
            name: 'text',
            label: t('admin-topics-form.clause.label.text'),
            quoted: true
        });

        csv.csvBuffered(filtered, options, (err, data) =>{
          res.set('Content-Type', 'text/csv; charset=' + config.csv.charset);
          if('utf-8' === config.csv.charset) res.send(data);
          else res.send(encoding.convert(data,config.csv.charset));
        });
      });
    });
  });

});

function _handleError (err, req, res) {
  log('Error found: %s', err);

  if (err.errors && err.errors.text) err = err.errors.text;
  if (err.type) err = err.type;
  if (err.message) err = err.message;

  res.status(400).json({ error: err });
}

function getRules(req, res, next){
  if(!config.rules) return next();
  Rules.find().exec(function (err, rules) {
    if (err) return _handleError(err, req, res);

    log('Found %s rules in total',rules.length);

    if( ! req.ctx ) req.ctx = {};
    req.ctx.rules = rules;
    log(req.ctx.rules);
    next();
  });
}
