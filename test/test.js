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
var expect = chai.expect;

var Client = require('./client/client');
var Server = require('./server/server');
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
});