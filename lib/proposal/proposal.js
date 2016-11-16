/**
 * Module dependencies.
 */

var page = require('page');
var request = require('request');
var o = require('dom');
var user = require('user');
var Article = require('proposal-article');
var sidebar = require('sidebar');
var Options = require('proposal-options');
var Comments = require('comments-view');
var log = require('debug')('democracyos:proposal');
var config = require('lib/config') ;

import rules from '../rules/rules';
import contains from 'mout/array/contains' ;
import filter from 'mout/array/filter' ;

// Routing
page('/proposal/:id', user.optional, load, rules.middleware, function(ctx) {
  bus.emit('page:change');

  // Render sidebar list
  sidebar.render('aside.nav-proposal');
  sidebar.ready(function() {
    sidebar.select(ctx.topic.id);
  });

  // Get content's container
  var contentContainer = document.querySelector('section.app-content');

  // Build page's content
  var article = new Article(ctx.proposal, ctx.path); // !!MUST be aware of user's data too
  var options = new Options(ctx.proposal, ctx.user);

  var commentsOptions = {
    item: ctx.proposal,
    reference: ctx.proposal.id
  };

  if(contains(config.rules,'role')){
    commentsOptions.roles = ctx.roles ;
  }

  var comments = new Comments(commentsOptions);
  comments.initialize();

  // Empty container before render
  o(contentContainer).empty();

  // Render page's content
  contentContainer.appendChild(article.render());
  contentContainer.appendChild(options.render());
  contentContainer.appendChild(comments.render());
});

/**
 * Load homepage data
 *
 * @param {Object} ctx page's context
 * @param {Function} next callback after load
 * @api private
 */

function load (ctx, next) {
  log('Loading proposals');

  request
  .get(config.subPath.concat('/api/proposal/all'))
  .end(function(err, res) {
    if (err || !res.ok) return log('Found error: %s', err || res.error);

    ctx.proposals = res.body;

    request
    .get(config.subPath.concat('/api/proposal/').concat(ctx.params.id))
    .end(function(err, res) {
      if (err || !res.ok) return log('Found error: %s', err || res.error);
      ctx.proposal = res.body;
      next();
    });
  });
};
