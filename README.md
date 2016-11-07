quickbooks-js
======
[![Build Status](https://travis-ci.org/RappidDevelopment/quickbooks-js.svg?branch=mm%2Fenhancement%2F%239%2Fasynchronous-support)](https://travis-ci.org/RappidDevelopment/quickbooks-js)
[![Coverage Status](https://coveralls.io/repos/github/RappidDevelopment/quickbooks-js/badge.svg?branch=mm%2Fenhancement%2F%239%2Fasynchronous-support)](https://coveralls.io/github/RappidDevelopment/quickbooks-js?branch=mm%2Fenhancement%2F%239%2Fasynchronous-support)  
A SOAP service implemented in Node.js that communicates with [QuickBook's Web Connector](https://developer.intuit.com/docs/0200_quickbooks_desktop/0400_tools/web_connector).

## Usage 
The following steps _should_ get you up and running. 

There are a few prerequisites you should have on hand:  
*  Access to the desktop runnings Quickbooks and hosting the Company File.  
*  The Quickbooks Company's administrator (user: `admin`) password   
*  _Optional:_ A dedicated username and password for your web-service to interact with the Quickbooks Web Connector (**it is not recommended to use the admin username and password!**).  
*  _Optional:_ The port on which the service should be available.

Set environment (`env`) variables for the following values:  
* `QB_USERNAME`  
* `QB_PASSWORD`     
* `QB_COMPANY_FILE`  
* `QB_SOAP_PORT`

The easiest way to set `env` variables to an Express app is with the [dotenv package](https://www.npmjs.com/package/dotenv).

Example (these are the default values if no `env`s are found):
```
QB_USERNAME=username
QB_PASSWORD=password  
QB_COMPANY_FILE=C:\Users\Public\Documents\Intuit\QuickBooks\Sample Company Files\QuickBooks 2014\sample_wholesale-distribution business.qbw  
QB_SOAP_PORT=8000  
```  
In the Quickbooks Web Connector, select "Add an Application" and supply it with a `.qwc` file. There is an example [here](https://github.com/RappidDevelopment/quickbooks-js/blob/master/test/app.qwc).  

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

## Attribution  
This project was forked from [`qbws`](https://github.com/johnballantyne/qbws/tree/975f2eb4b827de787a43ae3e69d025e1cb91523a) and originally written by [**@johnballantyne**](https://github.com/johnballantyne).  
Modified by [**@MattMorgis**](https://github.com/MattMorgis) at [Rappid Development](http://rappiddevelopment.com).
