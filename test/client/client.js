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

// Private
var soap = require('soap');
var url = 'http://localhost:8000/wsdl?wsdl';

// Public
module.exports = Client;

/**
 * Creates a new SOAP Client instance.
 * This acts as a mock quickbooks web connector.
 * @constructor
 */
function Client() {
    this.client = null;
}

/**
 * This creates the new SOAP client.
 * @param callback(err)
 */
Client.prototype.createClient = function(callback) {
    var that = this;
    soap.createClient(url, function(err, client) {
        if (err) return callback(err);
        that.client = client;
        return callback(null);
    });
};

/**
 * Makes the call to the `serverVersion`
 * endpoint required by QBWC
 *
 * @param callback(err, result)
 */
Client.prototype.serverVersion = function(callback) {
    this.client.serverVersion({}, function(err, result) {
        return callback(err, result);
    });
};

Client.prototype.clientVersion = function(callback) {
    var args = {strVersion: '2.1.0.30'};
    this.client.clientVersion(args, function(err, result) {
        return callback(err, result);
    });
};

Client.prototype.clientVersionBelowMinimum = function(callback) {
    var args = {strVersion: '0.1.0'};
    this.client.clientVersion(args, function(err, result) {
        return callback(err, result);
    });
};

Client.prototype.clientVersionBelowRecommended = function(callback) {
    var args = {strVersion: '2.0.0'};
    this.client.clientVersion(args, function(err, result) {
        return callback(err, result);
    });
};

Client.prototype.authenticateWithCorrectUsernameAndPassword = function(callback) {
    var args = {
        strUserName: process.env.QB_USERNAME || 'username',
        strPassword: process.env.QB_PASSWORD || 'password'
    };
    this.client.authenticate(args, function(err, result) {
        return callback(err, result);
    });
};

Client.prototype.authenticateWithIncorrectUsernameAndPassword = function(callback) {
    var args = {
        strUserName: 'wrongusername',
        strPassword: 'badpassword'
    };
    this.client.authenticate(args, function(err, result) {
        return callback(err, result);
    });
};

Client.prototype.sendXMLRequest = function(callback) {
    var args = {};
    this.client.sendRequestXML(args, function(err, result) {
        return callback(err, result);
    });
};

Client.prototype.receiveResponseXML = function(callback) {
    var args = {hresult: ''};
    this.client.receiveResponseXML(args, function(err, result) {
        return callback(err, result);
    });
};

Client.prototype.receiveResponseXMLWithError = function(callback) {
    var args = {hresult: '0x80040408'};
    this.client.receiveResponseXML(args, function(err, result) {
        return callback(err, result);
    });
};

Client.prototype.connectionError = function(callback) {
    var args = {hresult: '0x80040408', message: 'QuickBooks found an error when parsing the provided XML text stream.'};
    this.client.connectionError(args, function(err, result) {
        return callback(err, result);
    });
};

Client.prototype.closeConnection = function(callback) {
    var args = {};
    this.client.closeConnection(args, function(err, result) {
        return callback(err, result);
    });
};

Client.prototype.getLastError = function(callback) {
    var args = {};
    this.client.getLastError(args, function(err, result) {
        return callback(err, result);
    });
};
