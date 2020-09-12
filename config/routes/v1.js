/**
 * Created by codeslayer1 on 02/04/17.
 */
var express = require('express');
var router = express.Router();
var controllers = require('require-all')(__dirname + '/../../src/controllers/');
var policies = require('require-all')(__dirname + '/../../src/policies/');
var Utils = require('../../src/services/Utils');

router
  .post('/url/shorten/usage', function (req, res, next) {
    controllers.UrlController.fetchUrlUsage(req, res);
  })
  .get('/url/shorten/', function (req, res, next) {
    controllers.UrlController.shortenUrl(req, res);
  });

module.exports = router;
