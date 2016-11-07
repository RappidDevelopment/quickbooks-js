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
        if (err) {
            
            return callback(err);
        } else {

            return callback(null, result);
        }
    })
};
            console.log(err);
            return callback(err);
        } else {
            console.log(result);
            return callback(null, result);
        }
    })
};
