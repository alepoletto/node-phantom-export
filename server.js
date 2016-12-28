const express = require('express');
const app = express();
const admin = express();
const morgan = require('morgan');
const log = require('debug')('server');
const cors = require('cors');

const routes = require('./routes');

//const eurekaClient = require('./eureka-client/eureka-client.js')();
const environment = require('./environment/environment.js')();

const proxyTarget = process.env.PROXY_TARGET || '';
let serverPort = process.env.SERVER_PORT || environment.SERVER_PORT;
let adminPort = process.env.ADMIN_PORT || environment.ADMIN_PORT;


//cors
app.use(cors({origin: 'http://local.1p.thomsonreuters.com:6789'}));


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
else {
  app.use(morgan('common', { skip: function (req, res) { return res.statusCode < 400; } }));
}


if (serverPort === environment.SERVER_PORT) {
  log('Using default server port: ' + environment.SERVER_PORT);
}

if (adminPort !== environment.ADMIN_PORT) {
  log('Using custom admin port: ' + environment.ADMIN_PORT);
}

if (!environment.CLOUD_APP) {
  log('Cloud App name is not provided!!!');
}

serverPort = 3000;
adminPort = 8078;


//routes
app.use('/1pExport', routes);


console.log("Starting Node Server");
app.listen(serverPort, function() {
  console.log('listening: ' + serverPort);

  //eurekaClient.startClient(function(client) {});
});

admin.get('/healthcheck', function(req, res) {
  res.send(200);

  log('healthcheck called');
});

admin.listen(adminPort, function() {
  log('Admin healthcheck endpoint is up');
});
