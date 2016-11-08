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

var chai = require('chai');
var assert = chai.assert;

var Client = require('./client/client');
var Server = require('../index');
var soapClient = new Client();
var soapServer = new Server();

// Start soap Server
soapServer.run();

describe('Soap Client', function() {
    it('should start without error', function(done) {
        soapClient.createClient(function(err) {
            if (err) { done(err); }
            assert.isNotNull(soapClient.client, "Soap Client should not be null");
            done();
        });
    });

    it('should run server version method', function(done) {
        soapClient.serverVersion(function(err, result) {
            if (err) { done(err); }
            assert.equal(result.serverVersionResult.string, "0.2.0");
            done();
        });
    });

    it('should run client version method', function(done) {
          soapClient.clientVersion(function(err, result) {
            if (err) { done(err); }
            assert.deepEqual(result.clientVersionResult.string, {});
            done();
        });
    });

    it('should be below minimum client version', function(done) {
        soapClient.clientVersionBelowMinimum(function(err, result) {
            if (err) { done(err); }
            assert.deepEqual(result.clientVersionResult.string, 'E:You need to upgrade your QBWebConnector');
            done();
        });
    });

    it('should be below recommended client version', function(done) {
        soapClient.clientVersionBelowRecommended(function(err, result) {
            if (err) { done(err); }
            assert.deepEqual(result.clientVersionResult.string, 'W:It is recommended that you upgrade your QBWebConnector');
            done();
        });
    });

    it('should authenticate correctly', function(done) {
       soapClient.authenticateWithCorrectUsernameAndPassword(function(err, result) {
           if (err) { done(err); }
           assert.isArray(result.authenticateResult.string, 'Authenticate should return an array');
           assert.isNotNull(result.authenticateResult.string[0], 'Authenticate should return an GUID for the session');
           assert.notEqual(result.authenticateResult.string[1], 'nvu');
           done();
       });
    });

    it('should not authenticate correctly', function(done) {
        soapClient.authenticateWithIncorrectUsernameAndPassword(function(err, result) {
           if (err) { done(err); }
            assert.isArray(result.authenticateResult.string, 'Authenticate should return an array');
            assert.isNotNull(result.authenticateResult.string[0], 'Authenticate should return an GUID for the session');
            assert.equal(result.authenticateResult.string[1], 'nvu');
            done();
        });
    });

    it('should receive an empty string from sendXMLRequest', function(done) {
       soapClient.sendXMLRequest(function(err, result) {
           if (err) { done(err); }
           assert.deepEqual(result.sendRequestXMLResult.string, {}, 'String should be blank');
           done();
       });
    });

    it('should receive `100` from receiveResponseXML', function(done) {
        soapClient.receiveResponseXML(function(err, result) {
            if (err) { done(err); }
            assert.equal(result.receiveResponseXMLResult.int, 100, 'Should receive 100%');
            done();
        });
    });

    it('should receive `-101` from receiveResponseXML', function(done) {
        soapClient.receiveResponseXMLWithError(function(err, result) {
            if (err) { done(err); }
            assert.equal(result.receiveResponseXMLResult.int, -101, 'Should receive negative -101');
            done();
        });
    });

    it('should receive `done` from connectionError', function(done) {
        soapClient.connectionError(function(err, result) {
            if (err) { done(err); }
            assert.equal(result.connectionErrorResult.string, 'DONE', 'Should receive DONE');
            done();
        });
    });

    it('should receive error message from getLastError', function(done) {
        soapClient.getLastError(function(err, result) {
            if (err) { done(err); }
            assert.equal(result.getLastErrorResult.string, 'QuickBooks found an error when parsing the provided XML text stream.', 'Should receive error message');
            done();
        });
    });

    it('should receive `OK` from closeConnection', function(done) {
        soapClient.closeConnection(function(err, result) {
            if (err) { done(err); }
            assert.equal(result.closeConnectionResult.string, 'OK', 'Should receive OK');
            done();
        });
    });
});