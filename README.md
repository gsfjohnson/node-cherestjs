# Cherestjs for Node.js

[![Build Status](https://travis-ci.org/gsfjohnson/node-cherestjs.svg?branch=master)](http://travis-ci.org/gsfjohnson/node-cherestjs)

This module enables REST calls to the popular IT Service Management Software's REST API.

* [Installation](#installation)
* [Usage](#usage)

# Installation

* Install [Node.js](https://nodejs.org/)
* Install module with `npm`:
```shell
npm install cherestjs
```

# Usage
* Create `main.js` file with the following code:
```javascript
var cherestjs = require('cherestjs');

var cw = cherestjs('<host.fqdn.org>', '<api key>', '<username>', '<password>');

cw.getBusinessObject('<ticket id number>', function (err, object) {
  console.log(object);
});
```
* Run following command.
```shell
node main.js
```
