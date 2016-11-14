/*
 * This file is part of quickbooks-js
 * https://github.com/RappidDevelopment/quickbooks-js
 *
 * Based on qbws: https://github.com/johnballantyne/qbws
 *
 * (c) 2015 johnballantyne
 * (c) 2016 Rappid Development LLC
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*
 * Server.js
 *
 * This class will star the SOAP service
 * and start listening for requests from
 * a Quickbooks Web Connector
 */

//////////////////
//
// Private
//
//////////////////

/**
 * Node.js' HTTP Library
 *
 * https://nodejs.org/dist/latest-v6.x/docs/api/http.html
 */
var http = require('http');

/**
 * Node.js' File System API
 *
 * https://nodejs.org/dist/latest-v6.x/docs/api/fs.html
 */
var fs = require('fs');

/**
 * A SOAP client and server
 * for Node.js
 *
 * https://github.com/vpulim/node-soap
 */
var soap = require('soap');

/**
 * An HTTP server that will be used
 * to listen for SOAP requests.
 */
var server = http.createServer(function(req, res) {
    res.end('404: Not Found: ' + req.url);
});

var port = process.env.QB_SOAP_PORT || 8000;

/**
 * A reference to the WSDL
 * required for the SOAP service.
 *
 * https://www.w3.org/TR/wsdl
 */
var wsdl;

/**
 * A constant for the WSDL filename.
 * @type {string}
 */
var WSDL_FILENAME = '/qbws.wsdl';

/**
 * Fetches the WSDL file for the
 * SOAP service.
 *
 * @returns {string} contents of WSDL file
 */
function buildWsdl() {
    var wsdl = fs.readFileSync(__dirname + WSDL_FILENAME, 'utf8');

    return wsdl;
}

/**
 * A reference to the Quickbooks
 * Web Service class.
 *
 * @type {WebService}
 */
var WebService = require('./web-service');

/**
 * An instance of the Quickbooks
 * Web Service class.
 *
 * @type {WebService}
 */
var webService = new WebService();

//////////////////
//
// Public
//
//////////////////

module.exports = Server;

function Server() {
    wsdl = buildWsdl();
}

Server.prototype.run = function() {
    var soapServer;
    server.listen(port);
    soapServer = soap.listen(server, '/wsdl', webService.service, wsdl);
    console.log('Quickbooks SOAP Server listening on port ' + port);
Server.prototype.setQBXMLHandler = function(qbXMLHandler) {
    this.webService.setQBXMLHandler(qbXMLHandler);
};