/* Based off: 
 * https://github.com/RappidDevelopment/quickbooks-js
 * https://github.com/johnballantyne/qbws
 */

const http = require('http');
const fs = require('fs');
const soap = require('soap');

const server = http.createServer(function(req, res) {
    res.end('404: Not Found: ' + req.url);
});

let port = 8000;
const WSDL_FILENAME = '/qbws.wsdl';

function buildWsdl() {
    let wsdl = fs.readFileSync(__dirname + WSDL_FILENAME, 'utf8');

    return wsdl;
}


function Server() {
    this.wsdl = buildWsdl();
    this.webService = require('./web-service');
}

Server.prototype.run = function() {
    server.listen(port);
    soap.listen(server, '/wsdl', this.webService.service, this.wsdl);
    console.log('Quickbooks SOAP Server listening on port ' + port);
};

Server.prototype.setQBXMLHandler = function(qbXMLHandler) {
    port = qbXMLHandler.port;
    this.webService.setQBXMLHandler(qbXMLHandler);
};

module.exports = Server;