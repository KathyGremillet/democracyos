/**
 * Module dependencies.
 */

var config = require('lib/config');
var routes = require('./routes');
var strategy = require('./strategy');

/**
 * Expose Auth Module
 */

module.exports = AuthDrupal;

/**
 * Auth Module defining routes and
 */

function AuthDrupal (app) {

  /**
   * Instantiates PassportJS midlewares
   */

  strategy(app);

  /**
   * Attach routes to parent application
   */

  app.use(routes);
  
}
