/**
 * Module dependencies.
 */

var express = require('express');
var api = require('lib/db-api');

var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');
var Tag = mongoose.model('Tag');
var Forum = mongoose.model('Forum');

var async = require('async');

var config = require('lib/config');
var utils = require('lib/utils');
var restrict = utils.restrict;
var staff = utils.staff;
var log = require('debug')('democracyos:comments-utils');
var csv = require('json-csv')
var encoding = require("encoding");

var t = require('t-component');

var filter = require('mout/array/filter');
var replace = require('mout/string/replace');

var marked = require('marked');

var app = module.exports = express();

app.get('/comments-md-to-html', staff, function (req, res) {
  log('Request comments-md-to-html');
  var query = {};

  Comment
  .find(query)
  .exec(function (err, comments) {
    if (err) return _handleError(err, req, res);

    log('Found %s comments in total',comments.length);


    async.forEach(comments, (c) => {
      log('async.forEach');
      log(c);
      marked(c.text, {}, (err, res) => {
        c.text = res ? res : '' ;

        for (var i = 0; i < c.replies.length; i++) {
          log('for replies');
          log(c.replies[i])
          var res = marked(c.replies[i].text);
          c.replies[i].text = res ? res : '' ;
        }

        // c.replies.forEach((r) => {
        //   marked(r.text, {}, (err, res) => {
        //     r.text = res ? res : '' ;
        //   });
        // });

        c.save((err) => {
          log('saved');
          if(err) return log(err);
        });

      });

    }, (err) => {
      log('finished');
      if(err) res.json(500, {error: err});
      res.json(200,'comments-md-to-html successfull');
    });

  });
});

app.get('/comments-votes', staff, function (req, res) {
  log('Request comments-md-to-html');
  var query = {};

  Comment
  .find(query)
  .exec(function (err, comments) {
    if (err) return _handleError(err, req, res);

    log('Found %s comments in total',comments.length);


    async.forEach(comments, (c) => {
      log('async.forEach');
      log(c);
      console.log(c.upvotes.length);
      console.log(c.downvotes.length);
      c.upvote = c.upvotes.length ;
      c.downvote = c.downvotes.length ;
      
        c.save((err) => {
          log('saved');
          if(err) return log(err);
        });

      });

    }, (err) => {
      log('finished');
      if(err) res.json(500, {error: err});
      res.json(200,'comments-md-to-html successfull');
    });

  });
