/* 
 * This is a sample QBMXL file. You should provide your own that: 
 *   a.) Implements all the functions under module.exports
 *   b.) Provide for a company file under module.exports. 
 * Based off: 
 * https://github.com/RappidDevelopment/quickbooks-js
 * https://github.com/johnballantyne/qbws
 */

const data2xml = require('data2xml');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({trim: true});
const convert = data2xml({
        xmlHeader: '<?xml version="1.0" encoding="utf-8"?>\n<?qbxml version="13.0"?>\n'
    });

module.exports = {

    companyFile: {},

    port: 8000, 
    /**
     * Builds an array of qbXML commands
     * to be run by QBWC.
     *
     * @param callback(err, requestArray)
     */

    authenticate: (username, password) => {
        if(username=='test' && password=='test') { 
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }, 

    fetchRequests: (callback) => {
        buildRequests(callback);
    },

    /**
     * Called when a qbXML response
     * is returned from QBWC.
     *
     * @param response - qbXML response
     */
    handleResponse: (response) => {
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
    didReceiveError: (error) => {
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