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

var data2xml = require('data2xml');
var xml2js = require('xml2js');
var parser = new xml2js.Parser({trim: true});
var convert = data2xml({
        xmlHeader: '<?xml version="1.0" encoding="utf-8"?>\n<?qbxml version="13.0"?>\n'
    });

// Public
module.exports = {

    /**
     * Builds an array of qbXML commands
     * to be run by QBWC.
     *
     * @param callback(err, requestArray)
     */
    fetchRequests: function(callback) {
        buildRequests(callback);
    },

    /**
     * Called when a qbXML response
     * is returned from QBWC.
     *
     * @param response - qbXML response
     */
    handleResponse: function(response) {
        parser.parseStringPromise(response).then(function (result) {
            console.dir(JSON.stringify(result));
            console.log('Done');
          })
          .catch(function (err) {
            // Failed
          });
    },

    /**
     * Called when there is an error
     * returned processing qbXML from QBWC.
     *
     * @param error - qbXML error response
     */
    didReceiveError: function(error) {
        console.log(error);
    }
};

function buildRequests(callback) {
    var requests = new Array();
    var xml = convert(
        'QBXML',
        {
            QBXMLMsgsRq : {
                _attr : { onError : 'stopOnError' },
                ItemInventoryQueryRq : {
                    MaxReturned: 1,
                },
            },
        }
    );
    var xml2 = convert(
        'QBXML',
        {
            QBXMLMsgsRq : {
                _attr : { onError : 'stopOnError' },
                CustomerQueryRq : {
                    MaxReturned: 1,
                },
            },
        }
    );
    // Use it to pass in customer names && details. 
    var xml3 = convert(
        'QBXML',
        {
            QBXMLMsgsRq : {
                _attr : { onError : 'stopOnError' },
                CustomerAddRq : {
                    CustomerAdd: { 
                        Name: 'Mak Jonteds'
                    }
                },
            },
        }
    );
    requests.push(xml);
    requests.push(xml3)
    requests.push(xml2)


    return callback(null, requests);
}