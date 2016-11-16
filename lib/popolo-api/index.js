/**
 * Module dependencies.
 */

var express = require('express');
var api = require('lib/db-api');
var utils = require('lib/utils');
var accepts = require('lib/accepts');
var pluck = utils.pluck;
var log = require('debug')('democracyos:popolo');
var config = require('lib/config');
var utils = require('lib/utils');
var t = require('t-component');
var strip = require('strip');

var sanitizeHtml = require('sanitize-html');

var app = module.exports = express();

app.use(accepts(['application/json', 'text/html', '']));

function exposeMotion (topicDoc){

  var sources = [];

  if(topicDoc.source) sources.push({
    'note': 'source',
    'url': topicDoc.source
  });

  if(topicDoc.links) topicDoc.links.forEach( (link) => {
    sources.push({
      'note': link.text ? link.text : 'link',
      'url': link.url
    });
  });

  var polls = [];

  if(topicDoc.votes) polls.push({
    'start_date': topicDoc.publishedAt,
    'end_date': topicDoc.closingAt,
    'counts': [
      {
        'option': t('proposal-options.yea'),
        'value': topicDoc.upvotes.length
      },
      {
        'option': t('proposal-options.nay'),
        'value': topicDoc.downvotes.length
      },
      {
        'option': t('proposal-options.abstain'),
        'value': topicDoc.abstentions.length
      }
    ]
  });

  var cleanText = sanitizeHtml(strip(topicDoc.content), {
    allowedTags: [],
    allowedAttributes: []
  }).replace(/(\r\n|\n|\r)/gm, '');

  return {
    'id': topicDoc.id,
    'organization_id': config.organizationName,
    'legislative_session_id': null,
    'creator_id': topicDoc.author,
    'text': cleanText,
    'identifier': topicDoc.topicId,
    'classification': topicDoc.tag.name,
    'date': topicDoc.publishedAt,
    'requirement': 'consensus',
    'result': null,
    'vote_events': polls,
    'created_at': topicDoc.createdAt,
    'updated_at': topicDoc.createdAt,
    'sources': sources
  };
}

app.get('/motion/all',
  function (req, res) {
    log('Request /motion/all');

    api.popolo.all({}, function(err, motions) {
      if (err) return _handleError(err, req, res);

      motions = motions.filter(function(topic) {
        if (topic.public) return true;
        if (req.query.draft && topic.draft) return true;
        return false;
      });

      log('Serving %d topics', motions.length);

      res.json({
        'motions': motions.map((topicDoc) => {
          return exposeMotion(topicDoc);
        })
      });
    });
  }
);

app.get('/motion/:id', function (req, res) {
  log('Request GET /motion/%s', req.params.id);

  api.topic.get(req.params.id, function (err, topic) {
    if (err) return _handleError(err, req, res);
    if (!topic) return res.send(404);
    res.json(exposeMotion(topic));
  });
});

function _handleError (err, req, res) {
  log('Error found: %s', err);
  var error = err;
  if (err.errors && err.errors.text) error = err.errors.text;
  if (error.type) error = error.type;

  res.json(400, { error: error });
}
