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

var soap = require('soap');

var url = 'http://localhost:8000/wsdl?wsdl';

soap.createClient(url, function(err, client) {
    if (err) {
        console.log('Error creating SOAP client');
        console.log('Error!');
    }

    client.serverVersion({}, function(err, result) {
        if (err) {
            console.log('Error calling serverVersion()');
            console.log(err);
        }
        console.log(result);
    });
});