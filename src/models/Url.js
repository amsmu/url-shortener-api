'use strict';
var async = require('async');
var Utils = require('../services/Utils');
var knex = require('../../lib/knex').knexConnection;
var SqlString = require('sqlstring');

module.exports = {
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
