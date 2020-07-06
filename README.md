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

### qbXML Handler
You must provide your own `qbXMLHandler` file that will:
1. Generate a queue of QBXML requests that will be passed to QBWC.
2. Handle the QBXML responses and any errors that will be returned from QBWC. 
3. Provide authentication function that receives username and password from QBWC.
4. Provide company file. If empty, it will use the open company file in QB Desktop. 
5. Port to connect to. Defaults to 8080

There is an [example handler here](https://github.com/ziban/quickbooks-js/blob/master/bin/qbXMLHandler/index.js). Setup below shows how to use it.

```javascript
// Public
module.exports = {
    companyFile: {}, 

    port: 9093, 

    /* Authenticates the QWBC client calls
     * @param username && password 
     * @return promise resolving to true(authenticated)
     * or false(not authenticated)
    */
    authenticate: (username, password) => {
        if(username=='test' && password=='test') { 
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }, 

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
node bin/run or npm start 
```

To install the app: 
```
npm install git@github.com:ziban/quickbooks-js.git --save  
```
or 
```
npm install https://github.com/ziban/quickbooks-js.git --save  
```
To import into your node project: 
```
const Server = require('quickbooks-js');  
const qbXMLHandler = require('./qbXMLHandler');
const soapServer = new Server();
soapServer.setQBXMLHandler(qbXMLHandler);
soapServer.run();
```
### QBWC Setup
1. Login to your Quickbooks Company with your `admin` user.
2. Download Quickbooks Web Connector
3. In the Quickbooks Web Connector, select "Add an Application" and supply it with a `.qwc` file. There is an example [here](https://github.com/ziban/quickbooks-js/blob/master/test/app.qwc). 
    * You may need to use `0.0.0.0` or a local IP like `10.0.0.156` to run locally
    * `<OwnerID>` and `<FileID>`can be any random `guid`
    * UserName should be the one you will use to authenticate against in the qbXMLHandler
4. Quickbooks will prompt you to authorize your new web service.
5. You may need to enter your password into QBWC once the app is added.
    * This is the password you  will use to authenticate against in the qbXMLHandler

## Tests 
Unit tests are written in mocha.  You can run them using: 
```
npm test
```
## Attribution  
This project was forked from [`quickbooks-js`](git@github.com:RappidDevelopment/quickbooks-js.git) written  by [**@MattMorgis**](https://github.com/MattMorgis) at [Rappid Development](http://rappiddevelopment.com)
 which was forked from [`qbws`](https://github.com/johnballantyne/qbws/tree/975f2eb4b827de787a43ae3e69d025e1cb91523a)  written by [**@johnballantyne**](https://github.com/johnballantyne).  

Modified by  [**@ziban**](https://github.com/ziban)
