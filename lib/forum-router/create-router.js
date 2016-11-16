var prefix = '/:forum';

var startWith = require('mout/string/startsWith');
var log = require('debug')('democracyos:forum-router');

function createRouter(config) {
  var multiForum = config.multiForum;
  var subPath = config.subPath;
  return function forumRouter(route) {
    if (startWith(route,'/admin') || !multiForum) return route;
    return prefix + ('/' === route ? '' : route);
  };
}

module.exports = createRouter;
