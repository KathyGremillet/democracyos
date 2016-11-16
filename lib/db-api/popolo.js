/**
 * Extend module's NODE_PATH
 * HACK: temporary solution
 */

require('node-path')(module);

/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Topic = mongoose.model('Topic');
var utils = require('lib/utils');
var log = require('debug')('democracyos:db-api:popolo');
var pluck = utils.pluck;

/**
 * Get all topics
 *
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'topics' list items found or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.all = function all(params, fn) {
  log('Looking for all topics.');

  var query = { deletedAt: null };

  if (params.forum) query.forum = params.forum;

  Topic
  .find(query)
  .populate('tag', 'id hash name')
  .exec(function (err, topics) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    }

    log('Delivering %d topics', topics.length );
    fn(null, topics);
  });

  return this;
};

/**
 * Search topics from query
 *
 * @param {Object} query filter
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'topics' list of topics objects found or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.search = function search(query, fn) {
  log('Searching for topics matching %j', query);

  Topic
    .find(query, function(err, topics) {
    if (err) {
      log('Found error: %j', err);
      return fn(err);
    }

    log('Found topics %j for %j', pluck(topics, 'id'), query);
    fn(null, topics);
  });

  return this;
};

/**
 * Search single topic from _id
 *
 * @param {ObjectId} topic Id to search by `_id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'topic' single topic object found or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.searchOne = function searchByTopicId(id, fn) {
  var query = { _id: id, deletedAt: null };

  log('Searching for single topic matching %j', query);
  Topic
  .findOne(query)
  .populate('tag')
  .populate('participants')
  .exec(function (err, topic) {
    if (err) {
      log('Found error %s', err);
      return fn(err);
    }

    if (!topic) {
      log('Topic with id %s not found.', id);
      return fn(new Error('Topic not found'));
    }

    log('Delivering topic %s', topic.id);
    fn(null, topic);
  });

  return this;
};

/**
 * Get Topic form `id` string or `ObjectId`
 *
 * @param {String|ObjectId} id Topic's `id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'topic' found item or `undefined`
 * @api public
 */

function onget(fn) {
  return function(err, topic) {
    if (err) {
      log('Found error %s', err);
      return fn(err);
    }

    if (!topic) {
      log('Topic not found');
      return fn(null);
    }

    topic.clauses = topic.clauses.sort(byPosition);
    log('Delivering topic %s', topic.id);
    fn(null, topic);
  };
}

exports.get = function get(id, fn) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    log('ObjectId %s is not valid', id);
    return fn(null);
  }

  var query = { _id: id, deletedAt: null };

  log('Looking for topic %s', id);
  Topic
  .findOne(query)
  .populate('tag')
  .exec(onget(fn));
};

exports.getWithForum = function getWithForum(id, fn) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    log('ObjectId %s is not valid', id);
    return fn(null);
  }

  var query = { _id: id, deletedAt: null };

  log('Looking for topic %s', id);
  Topic
  .findOne(query)
  .populate('tag forum')
  .exec(onget(fn));
};

/**
 * Get topics for RSS
 *
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'topics' list items found or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.rss = function all(fn) {
  log('Looking for RSS topics.');

  Topic
  .find({ deletedAt: null })
  .select('id topicId mediaTitle publishedAt body')
  .exec(function (err, topics) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    }

    log('Delivering topics %j', pluck(topics, 'id'));
    fn(null, topics);
  });

  return this;
};

/**
 * Search total votes
 *
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'votes', total casted or `undefined`
 * @return {Module} `topic` module
 * @api public
 */

exports.votes = function votes(fn) {
  log('Counting total casted votes');

  Topic
    .aggregate(
      { $unwind: '$votes' },
      { $group: { _id: '#votes', total: { $sum: 1 } } },
      function (err, res) {
        if (err) {
          log('Found error: %j', err);
          return fn(err);
        }

        if (!res[0]) return fn(null, 0);

        var total = res[0].total;

        log('Found %d casted votes', total);
        fn(null, total);
      }
    );

  return this;
};

/**
 * Sorting function for topic clauses
 */

function byPosition(a, b) {
  return a.position - b.position;
}
