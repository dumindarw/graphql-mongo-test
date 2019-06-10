require('babel-register')({
    presets: [ 'env' ]
});
require("dotenv").config();

module.exports = require('./index')
