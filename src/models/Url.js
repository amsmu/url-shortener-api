'use strict';
var async = require('async');
var Utils = require('../services/Utils');
var knex = require('../../lib/knex').knexConnection;
var SqlString = require('sqlstring');

module.exports = {
  shortenUrl: function (params, cb) {
    //Check for mandatory params that needs to be passed in api
    var mandatoryParams = ['url'];
    var missingParam = Utils.checkMandatoryParams(params, mandatoryParams);
    if (missingParam != null) {
      return Utils.sendErrorResponse(
        400,
        {
          code: Utils.config().errorCodes.missing_params,
          message: '@' + missingParam + ' param is missing. Mandatory params are: ' + mandatoryParams,
          display_message: Utils.config().errorMessages.error_generic,
        },
        cb
      );
    }

    async.waterfall(
      [fetchUrlRecord, checkAndCreateUrlRecord, createShortenedUrlRecord, createShortenedUrl, fetchShortenedUrl],
      function (err, result) {
        if (err != null) {
          return Utils.sendErrorResponse(500, err, cb);
        }
        return Utils.sendSuccessResponse(result, cb);
      }
    );

    function fetchUrlRecord(cb) {
      knex
        .raw('select id from url where url=' + SqlString.escape(params.url))
        .then((res) => {
          cb(null, res[0][0]);
        })
        .catch((err) => {
          console.log(err);
          cb({ display_message: 'Something went wrong' });
        });
    }
    function checkAndCreateUrlRecord(urlRecord, cb) {
      //If url record already present then no need to create new record
      if (!Utils.isEmpty(urlRecord)) {
        cb(null, urlRecord);
      } else {
        knex('url')
          .insert({ url: params.url })
          .then((res) => {
            cb(null, { id: res[0] });
          })
          .catch((err) => {
            console.log(err);
            cb({ display_message: 'Something went wrong' });
          });
      }
    }
    function createShortenedUrlRecord(urlRecord, cb) {
      //will leave the shortened url column null
      knex('shortened_url')
        .insert({ url_id: urlRecord.id, user: params.user })
        .then((res) => {
          cb(null, { id: res[0] });
        })
        .catch((err) => {
          console.log(err);
          cb({ display_message: 'Something went wrong' });
        });
    }
    function createShortenedUrl(shortenedUrlRecord, cb) {
      // will create random but unique string and it will be repeatable because of the seed that'll be passed is shortened_url id
      // there will be no chances of collision because the string is generated based on unique id.
      knex
        .raw(
          "update shortened_url set shortened_url=concat('https://domain.com/'," +
            "substring('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(" +
            shortenedUrlRecord.id +
            ')*4294967296))*36+1, 1),' +
            "substring('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1)," +
            "substring('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1)," +
            "substring('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1)," +
            " substring('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed:=round(rand(@seed)*4294967296))*36+1, 1)," +
            "substring('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', rand(@seed)*36+1, 1)" +
            ') where id=' +
            shortenedUrlRecord.id
        )
        .then((res) => {
          cb(null, shortenedUrlRecord);
        })
        .catch((err) => {
          console.log(err);
          cb({ display_message: 'Something went wrong' });
        });
    }
    function fetchShortenedUrl(shortenedUrlRecord, cb) {
      knex('shortened_url')
        .where(shortenedUrlRecord)
        .then((res) => {
          cb(null, { shortened_url: res[0].shortened_url });
        })
        .catch((err) => {
          console.log(err);
          cb({ display_message: 'Something went wrong' });
        });
    }
  },

  fetchUrlUsage: function (params, cb) {
    //Check for mandatory params that needs to be passed in api
    var mandatoryParams = ['url'];
    var missingParam = Utils.checkMandatoryParams(params, mandatoryParams);
    if (missingParam != null) {
      return Utils.sendErrorResponse(
        400,
        {
          code: Utils.config().errorCodes.missing_params,
          message: '@' + missingParam + ' param is missing. Mandatory params are: ' + mandatoryParams,
          display_message: Utils.config().errorMessages.error_generic,
        },
        cb
      );
    }

    async.waterfall([fetchCountOfShortenedUrlForSpecificUrl], function (err, result) {
      if (err != null) {
        return Utils.sendErrorResponse(500, err, cb);
      }
      return Utils.sendSuccessResponse(result, cb);
    });

    function fetchCountOfShortenedUrlForSpecificUrl(cb) {
      knex
        .raw(
          'select count(*) as total_times_shortened from shortened_url as su join url as u where su.url_id=u.id and u.url=' +
            SqlString.escape(params.url)
        )
        .then((res) => {
          cb(null, res[0][0]);
        })
        .catch((err) => {
          console.log(err);
          cb({ display_message: 'Something went wrong' });
        });
    }
  },
};
