'use strict';

/*jshint esversion: 6 */

module.exports = (params) => {
  params = params || {};

  var yaml = require('js-yaml');
  var fs = require('fs');
  var environment = require('../environment/environment.js');
  var path = params.SWAGGER_LOCATION || environment.SWAGGER_LOCATION;
  var suffix = params.SWAGGER_FILE_SUFFIX || environment.SWAGGER_FILE_SUFFIX || '-doc.yml';

  var log = require('debug')('serve-swagger');

  return {
    getSwagger: (api, callback) => {
      var fn = callback || (() => {});

      fs.readFile(path + '/api-' + api + suffix, (err, data) => {
        if (err) {
          log(err);

          fn(undefined, err);
        }
        else {
          var d = yaml.safeLoad(data);

          fn(d, undefined);
        }
      });
    }
  };
};