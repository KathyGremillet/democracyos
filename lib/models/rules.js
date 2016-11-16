/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var regexps = require('lib/regexps');

var config = require('lib/config');

var format = require('json-format');

var Schema = mongoose.Schema;

/**
 * Define `User` Schema
 */

var RulesSchema = new Schema({
  type: { type: String, enum: config.rules , required: true, default: 'role' },
  name: { type: String, index: { unique: true }, trim: true},
  value: {}
});


/**
 * Make Schema `.toObject()` and
 * `.toJSON()` parse getters for
 * proper JSON API response
 */

RulesSchema.set('toObject', { getters: true });
RulesSchema.set('toJSON', { getters: true });

RulesSchema.virtual('text').get(function() {
  return format(this.value, { type: 'space' });
});

module.exports = function initialize(conn) {
  return conn.model('Rules', RulesSchema);
};
