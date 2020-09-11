/**
 * Created by codeslayer1 on 05/10/18.
 */
'use strict';

var Utils = require('../services/Utils');
var knex = require('../../lib/knex').knexConnection;
var SqlString = require('sqlstring');

module.exports = {
  sampleApiOne: function (params, cb) {
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

    knex
      .raw('select * from `url` where url = ' + SqlString.escape(params.url))
      .then((res) => {
        return Utils.sendSuccessResponse(res, cb);
      })
      .catch((err) => {
        return Utils.sendErrorResponse(500, err, cb);
      });

  },
};
