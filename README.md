[![Build Status](https://travis-ci.org/RappidDevelopment/quickbooks-js.svg?branch=mm%2Fenhancement%2F%2312%2FqbXML-Handler)](https://travis-ci.org/RappidDevelopment/quickbooks-js)
[![Coverage Status](https://coveralls.io/repos/github/RappidDevelopment/quickbooks-js/badge.svg?branch=mm%2Fenhancement%2F%239%2Fasynchronous-support)](https://coveralls.io/github/RappidDevelopment/quickbooks-js?branch=mm%2Fenhancement%2F%239%2Fasynchronous-support)  
quickbooks-js
======
A SOAP service implemented in Node.js that communicates with [QuickBook's Web Connector](https://developer.intuit.com/docs/0200_quickbooks_desktop/0400_tools/web_connector).

## Usage 
The following steps _should_ get you up and running. 

### Prerequisites
There are a few prerequisites you should have on hand:  
*  Access to the desktop running Quickbooks and hosting the Company File.  
*  The Quickbooks Company's administrator (user: `admin`) password   
*  _Optional:_ A dedicated username and password for your web-service to interact with the Quickbooks Web Connector (**it is not recommended to use the admin username and password!**).  
*  _Optional:_ The port on which the service should be available. Defaults to `8080`.

Set environment (`env`) variables for the following values (these are the defaults):  
```
QB_USERNAME=username
QB_PASSWORD=password  
QB_COMPANY_FILE=C:\Users\Public\Documents\Intuit\QuickBooks\Sample Company Files\QuickBooks 2014\sample_wholesale-distribution business.qbw  
QB_SOAP_PORT=8000  
```  

Depending on your environemnt, you may need to set `QB_COMPNANY_FILE` in one of the following ways:
```
QB_COMPANY_FILE=C:\Users\Public\Documents\Intuit\QuickBooks\Sample Company Files\QuickBooks 2014\sample_wholesale-distribution business.qbw  
QB_COMPANY_FILE='C:\Users\Public\Documents\Intuit\QuickBooks\Sample Company Files\QuickBooks 2014\sample_wholesale-distribution business.qbw'
QB_COMPANY_FILE=C:\\Users\\Public\\Documents\\Intuit\\QuickBooks\\Sample Company Files\\QuickBooks 2014\\sample_wholesale-distribution business.qbw  
QB_COMPANY_FILE='C:\\Users\\Public\\Documents\\Intuit\\QuickBooks\\Sample Company Files\\QuickBooks 2014\\sample_wholesale-distribution business.qbw  '
```
_For easy `env` variable management checkout the [dotenv package](https://www.npmjs.com/package/dotenv)_.

### qbXML Handler
You must addtionally create your own `qbXMLHandler` that will send the SOAP Server a queue of requests to pass to QBWC. It will addtionally handle the qbXML responses and any errors that may be returned. 

There is an [example class here](https://github.com/RappidDevelopment/quickbooks-js/blob/master/bin/qbXMLHandler/index.js).

```javascript
// Public
module.exports = {

    /**
     * Builds an array of qbXML commands
     * to be run by QBWC.
     *
     * @param callback(err, requestArray)
     */
    fetchRequests: function(callback) {
        return callback(null, []);
    },

    /**
     * Called when a qbXML response
     * is returned from QBWC.
     *
     * @param response - qbXML response
     */
    handleResponse: function(response) {
        console.log(response);
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
```

### SOAP Server Setup
To start the service from the command line simply run:  
``` 
node bin/run
```

To start the app from an Express install the package:  
```
npm install quickbooks-js --save  
```
Then start the service from your `app.js` with:  
```
var Server = require('quickbooks-js');  
var qbXMLHandler = require('./qbXMLHandler');
var soapServer = new Server();
quickbooksServer.setQBXMLHandler(qbXMLHandler);
soapServer.run();
```
### QBWC Setup
1. Login to your Quickbooks Company with your `admin` user.
2. In the Quickbooks Web Connector, select "Add an Application" and supply it with a `.qwc` file. There is an example [here](https://github.com/RappidDevelopment/quickbooks-js/blob/master/test/app.qwc). 
    * You may need to use `0.0.0.0` or a local IP like `10.0.0.156` to run locally
    * `<OwnerID>` and `<FileID>`can be any random `guid`
3. Quickbooks will prompt you to authorize your new web service.
4. You may need to enter your password into QBWC once the app is added.

To start the service from the command line simply run:  
``` 
node test/client.js
```

To start the app from an Express install the package:  
```
npm install quickbooks-js --save  
```
Then start the service from your `app.js` with:  
```
var quickbooks = require('quickbooks-js');  
quickbooks.run();  
```
## Tests 
Unit tests are written in mocha.
```
npm test
```
## Attribution  
This project was forked from [`qbws`](https://github.com/johnballantyne/qbws/tree/975f2eb4b827de787a43ae3e69d025e1cb91523a) and originally written by [**@johnballantyne**](https://github.com/johnballantyne).  
Modified by [**@MattMorgis**](https://github.com/MattMorgis) at [Rappid Development](http://rappiddevelopment.com).
