var _ = require('lodash-node');
var utils = require('../poker-utils');
var fcUtils = require('../fivecard-utils.js');

module.exports = function (intent, session, response) {
    console.log("!!!!!!!!!!\n\n!!!!!!!!!cancelIntent!!!!!!!!!", intent);
    console.log("!!!!!!!!!session!!!!!!!!!", session);
    return response.tell('');
};