'use strict';

var chai = require('chai');
var expect = chai.expect;

describe('Swagger', function () {
  describe('default params', function () {

    it('default assumptions', function() {
      var swagger = require('./serve-swagger.js')();

      expect(swagger).to.be.an('Object');

      swagger.getSwagger('unknown-api', function(data, err) {
        expect(err).to.be.an('Object');
        expect(data).to.be.an('undefined');
      });
    });

    it('should read file', function() {
      var swagger = require('./serve-swagger.js')({SWAGGER_LOCATION: __dirname, SWAGGER_FILE_SUFFIX: '-doc.test.yml'});

      expect(swagger).to.be.an('Object');

      swagger.getSwagger('testing', function(data, err) {
        expect(err).to.be.an('undefined');
        expect(data).to.be.an('Object');
      });

      swagger.getSwagger('testing', function(data, err) {
        expect(err).to.be.an('undefined');
        expect(data).to.be.an('Object');
      });

    });

  });
});


