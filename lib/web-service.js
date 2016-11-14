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
 * Web-Service.js
 *
 * This class builds the SOAP
 * web-service methods called by
 * Quickbooks Web Connector.
 */

//////////////////
//
// Private
//
//////////////////

/**
 * A reference to the semvar library.
 * https://www.npmjs.com/package/semver
 *
 * @type {SemVer}
 */
var semver = require('semver');

/**
 * A library to generate UUIDs
 *
 * https://github.com/broofa/node-uuid
 */
var uuid = require('node-uuid');

/**
 * A constant for the minimum supported
 * version of the Quickbooks Web Connector.
 *
 * @type {string}
 */
var MIN_SUPPORTED_VERSION = '1.0.0';

/**
 * A constant for the recommended version
 * of Quickbooks Web Connector.
 *
 * @type {string}
 */
var RECOMMENDED_VERSION = '2.0.1';

/**
 * The SOAP web service functions
 * and their defintions.
 */
var webService;

/**
 * Used to keep track of the number
 * of qbXML commands needed to be sent.
 *
 * @type {int}
 */
var counter = 0;

var lastError = '';

/**
 * The username to authenticate against
 * Quickbooks with.
 *
 * @type {string}
 */
var username = process.env.QB_USERNAME || 'username';

/**
 * The password to authenticate against
 * Quickbooks with.
 *
 * @type {string}
 */
var password = process.env.QB_PASSWORD || 'password';

/**
 * The path to the company file that
 * Quickbooks should load. Leave an empty
 * String to use the file Quickbooks currently
 * has open.
 *
 * @type {string}
 */
var companyFile = process.env.QB_COMPANY_FILE || '';

/**
 * Requests to be processed by QBWC
 *
 * @type {Array}
 */
var requestQueue = [];

/**
 * A delegate to handle fetching
 * and receiving qbXML requests and responses.
 *
 * @type {Object}
 */
var qbXMLHandler = new Object();

webService = {
    QBWebConnectorSvc: {
        QBWebConnectorSvcSoap: {}
    }
};

/**
 * Communicates this web service's version
 * number to the QBWC.
 *
 * @return the version of this web service
 */
webService.QBWebConnectorSvc.QBWebConnectorSvcSoap.serverVersion = function (args, callback) {
    var retVal = '0.2.0';

    callback({
        serverVersionResult: {'string': retVal}
    });
};

/**
 * Allows the web service to evaluate the current
 * QBWebConnector version
 *
 * @return
 * - `NULL` or '' (empty string) - if you want QBWC to proceed.
 * - 'W:<any text>' - prompts a WARNING to the user.
 * - 'E:<any text>' - prompts an ERROR to the user.
 */
webService.QBWebConnectorSvc.QBWebConnectorSvcSoap.clientVersion = function(args, callback) {
    var retVal = '';
    var qbwcVersion = args.strVersion.split('.')[0] + '.' +
        args.strVersion.split('.')[1] + '.' +
        args.strVersion.split('.')[2];

    // Check if qbwcVersion is less than minimum supported.
    if (semver.lt(qbwcVersion, MIN_SUPPORTED_VERSION)) {
        retVal = 'E:You need to upgrade your QBWebConnector';
    }
    // Check if qbwcVersion is less than recommended version.
    else if (semver.lt(qbwcVersion, RECOMMENDED_VERSION)) {
        retVal = 'W:It is recommended that you upgrade your QBWebConnector';
    }

    callback({
        clientVersionResult: {'string': retVal}
    });
};

/**
 * Allows for the web service to authenticate the user
 * QBWC is using and to specify the company file to be used
 * in the session.
 *
 * @return - array
 * - [0] index 0 is always a UUID for the session
 * - [1] NONE        - if there are no requests to process
 *       ''          - if QBWC is to use the currently open company file
 *       <file path> - the full path to the company file that should be used
 *       nvu         - the username and password were invalid
 */
webService.QBWebConnectorSvc.QBWebConnectorSvcSoap.authenticate = function(args, callback) {
    var authReturn = [];
    authReturn[0] = uuid.v1();

    if (args.strUserName.trim() === username && args.strPassword.trim() === password) {

        // Check if qbXMLHandler responds to method.
        if ((typeof qbXMLHandler.fetchRequests === "function")) {
            qbXMLHandler.fetchRequests(function(err, requests) {
                requestQueue = requests;
                if (err || requestQueue.length === 0) {
                    authReturn[1] = 'NONE';
                } else {
                    authReturn[1] = companyFile;
                }

                callback({
                    authenticateResult: {'string': [authReturn[0], authReturn[1]]}
                });
            });
        } else {
            // Fallback to 'NONE'
            authReturn[1] = 'NONE';

            callback({
                authenticateResult: {'string': [authReturn[0], authReturn[1]]}
            });
        }
    } else {
        // The username and password sent from
        // QBWC do not match was is set on the server.
        authReturn[1] = 'nvu';

        callback({
            authenticateResult: {'string': [authReturn[0], authReturn[1]]}
        });
    }
};

/**
 * Sends any qbXML commands to be executes to the
 * QBWC client. This method is called continuously until it
 * receives an empty string.
 */
webService.QBWebConnectorSvc.QBWebConnectorSvcSoap.sendRequestXML = function(args, callback) {
    var request = '';
    var totalRequests = requestQueue.length;

    if (counter < totalRequests) {
        request = requestQueue[counter];
        counter += 1;
    } else {
        request = '';
        counter = 0;
    }

    callback({
        sendRequestXMLResult: { 'string': request }
    });
};

/**
 * Called after QBWC has run a qbXML command
 * and has returned a response.
 *
 * @return {Number} the percentage of requests complete.
 * - Greater than 0 - more requests to send
 * - 100 - Done; no more requests to process
 * - Less than 0 - An error occurred
 */
webService.QBWebConnectorSvc.QBWebConnectorSvcSoap.receiveResponseXML = function(args, callback) {
    var response = args.response;
    var hresult = args.hresult;
    var message = args.message;
    var retVal = 0;
    var percentage = 0;

    if (hresult) {
        // if there was an error
        // the web service should return a
        // negative value.
        console.log("QB CONNECTION ERROR: " + args.message + ' (' + args.hresult + ')');
        lastError = message;
        retVal = -101;

        if ((typeof qbXMLHandler.didReceiveError === "function")) {
            qbXMLHandler.didReceiveError(hresult);
        }
    } else {
        if ((typeof qbXMLHandler.handleResponse === "function")) {
            qbXMLHandler.handleResponse(response);
        }
        percentage = (!requestQueue.length) ? 100 : counter * 100 / requestQueue.length;
        if (percentage >= 100) {
            // There are no more requests.
            // Reset the counter.
            counter = 0;
        }
        //QBWC throws an error if the return value contains a decimal
        retVal = percentage.toFixed();
    }

    callback({
        receiveResponseXMLResult: { 'int': retVal }
    });
};

/**
 * Called when there is an error connecting to QB.
 *
 * @return 'DONE' to abort or '' to retry.
 */
webService.QBWebConnectorSvc.QBWebConnectorSvcSoap.connectionError = function(args, callback) {
    console.log("QB CONNECTION ERROR: " + args.message + ' (' + args.hresult + ')');
    lastError = args.message;
    var retVal = 'DONE';

    callback({
        connectionErrorResult: { 'string': retVal }
    });
};

/**
 * Called when there is an error connecting to QB.
 * Currently just saves off any errors and returns the latest one.
 */
webService.QBWebConnectorSvc.QBWebConnectorSvcSoap.getLastError = function(args, callback) {
    var retVal = lastError;

    callback({
        getLastErrorResult:  { 'string': retVal }
    });
};

/**
 * Tells QBWC is finished with the session.
 *
 * @return 'OK'
 */
webService.QBWebConnectorSvc.QBWebConnectorSvcSoap.closeConnection = function(args, callback) {
    var retVal = 'OK';

    callback({
        closeConnectionResult: { 'string': retVal }
    });
};

//////////////////
//
// Public
//
//////////////////

module.exports = {
    service: webService,

    setQBXMLHandler: function(xmlHandler) {
        qbXMLHandler = xmlHandler;
    }
};


