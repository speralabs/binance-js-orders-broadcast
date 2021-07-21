require('dotenv').config();
// Import cross origins
const cors = require('cors');
// Import express
const express = require('express');
// import MongoDB
const mongoose = require('mongoose');
// import http
const http = require('http');

const config = require('./config/config');
// create express server
const server = express();
// Allow cross origins
server.use(cors());
// Set constant server port
const serverPort = config.web_port;

const directoryService = require('./services/directoryService');

directoryService.createDirectories();

// set routes
// set routes
server.use('/api', require('./routes'));

server.use(express.static(__dirname));
// check environment
const { isProduction } = config;
// // private key
// let privateKey = fs.readFileSync(config.sslPrivetKeyPath);
// // certificate
// let certificate = fs.readFileSync(config.sslCertKeyPath);
// let ca = fs.readFileSync(config.sslCertAuthPath);
// // https options
// let options = {
//   key: privateKey,
//   cert: certificate,
//   ca: ca
// };

// Database Connection initiation
if (isProduction) {
  mongoose.connect(`mongodb:${config.database}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
} else {
  mongoose.connect(`mongodb:${config.testDatabase}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  mongoose.set('debug', true);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);
}

const httpServer = http.createServer(server);
// start server...
httpServer.listen(serverPort, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`HTTP server listening on port : ${serverPort}`);
  }
});

// https.createServer(options, server).listen(config.https_web_port);
// console.log('HTTPS server listen on port ' + config.https_web_port);

module.exports = server;
