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
            if (err) { done (err); }
            console.log(result.clientVersionResult.string);
            assert.deepEqual(result.clientVersionResult.string, {});
            done();
        });
    });

    it('should be below minimum client version', function(done) {
        soapClient.clientVersionBelowMinimum(function(err, result) {
            if (err) { done (err); }
            console.log(result.clientVersionResult.string);
            assert.deepEqual(result.clientVersionResult.string, 'E:You need to upgrade your QBWebConnector');
            done();
        });
    });

    it('should be below recommended client version', function(done) {
        soapClient.clientVersionBelowRecommended(function(err, result) {
            if (err) { done (err); }
            console.log(result.clientVersionResult.string);
            assert.deepEqual(result.clientVersionResult.string, 'W:It is recommended that you upgrade your QBWebConnector');
            done();
        });
    });
});