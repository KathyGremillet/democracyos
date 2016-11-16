var http = require('http');
var https = require('https');
var fs = require('fs');
var log = require('debug')('democracyos:server-factory');

module.exports = serverFactory;

function serverFactory(app, options) {
  var secure = 'https' == options.protocol;
  var servers = [];

  servers.push(create(app, options));

  if (secure && options.https.redirect === 'normal') {
    servers.push(createSecure(app, options));
  }

  servers.forEach(function(server){
    // Decorate `server` object with a `listen` handler
    server.listen = function(cb){
      server.server.listen(server.port, server.callback);
    };
  });

  return servers;
}

function create(app, options) {
  return {
    port: options.port,
    server: http.createServer(app),
    callback: function(err){
      if (err) return log(err), process.exit(1);
      log('DemocracyOS HTTP server running...');
    },
  };
}

function createSecure(app, options) {
  var privateKey = fs.readFileSync(options.https.serverKey, 'utf-8');
  var certificate = fs.readFileSync(options.https.serverCert, 'utf-8');

  return {
    port: options.https.port,
    callback: function(err){
      if (err) return log(err), process.exit(1);
      log('DemocracyOS HTTPS server running...');
    },
    server: https.createServer({
      key: privateKey,
      cert: certificate
    }, app)
  };
}
