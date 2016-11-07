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

var counter = null;

var connectionErrCounter = null;

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
var password = password = process.env.QB_PASSWORD || 'password';

/**
 * The path to the company file that
 * Quickbooks should load. Leave an empty
 * String to use the file Quickbooks currently
 * has open.
 *
 * @type {string}
 */
var companyFile = process.env.QB_COMPANY_FILE || '';

var req = [];

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



//////////////////
//
// Public
//
//////////////////

module.exports = WebService;

function WebService () {
    this.service = webService;
};


