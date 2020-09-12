var Url = require('../models/Url');
var Utils = require('../services/Utils');

module.exports = {
  /**
   * @author amsmu
   * @description Api for shortening the given url
   * @param url
   */
  shortenUrl: function (req, res) {
    var input = Utils.getAllParams(req);

    Url.shortenUrl(input, function (err, result) {
      if (!Utils.isEmpty(err)) {
        return res.error(err);
      }

      return res.success(result);
    });
  },

  /**
   * @author amsmu
   * @description Api for checking how many times a url has been shortened
   * @param url
   */
  fetchUrlUsage: function (req, res) {
    var input = Utils.getAllParams(req);

    Url.fetchUrlUsage(input, function (err, result) {
      if (!Utils.isEmpty(err)) {
        return res.error(err);
      }

      return res.success(result);
    });
  },
};
