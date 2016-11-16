/**
 * Module Dependencies
 */

var utils = require('lib/utils');

function isOwner(req, res, next) {
  return utils.staff;
}

var hasAccess = utils.staff;

module.exports = isOwner;

module.exports.hasAccess = hasAccess;
