'use strict';

var chai = require('chai');
var expect = chai.expect;

describe('Environment', function () {
  describe('default params', function () {
    before(function() {
      delete process.env.EC2_REGION;
      delete process.env.CLOUD_ENVIRONMENT;
      delete process.env.CLOUD_DEV_PHASE;
      delete process.env.CLOUD_STACK;
      delete process.env.CLOUD_DOMAIN;
      delete process.env.CLOUD_DATACENTER;
    });

    it('should have correct default params', function() {
      var environment = require('./environment.js')();

      expect(environment.EC2_REGION).to.be.equal('us-west-2');
      expect(environment.CLOUD_ENVIRONMENT).to.be.equal('dev');
      expect(environment.CLOUD_DEV_PHASE).to.be.equal('snapshot');
      expect(environment.CLOUD_STACK).to.be.equal('1p');
      expect(environment.CLOUD_DOMAIN).to.be.equal('dev.oneplatform.build');
      expect(environment.CLOUD_APP).to.be.equal('mocha-test');
      expect(environment.CLOUD_DATACENTER).to.be.equal('MyOwn');

      expect(environment.SERVER_PORT).to.be.equal(8080);
      expect(environment.ADMIN_PORT).to.be.equal(8077);
      expect(environment.SWAGGER_LOCATION).to.be.equal('resources');
    });
  });

  describe('environment params', function () {
    var lastAppId = process.env.CLOUD_APP;
    before(function() {
      process.env.EC2_REGION = 'us-east-1';
      process.env.CLOUD_ENVIRONMENT = 'prod';
      process.env.CLOUD_DEV_PHASE = 'stable';
      process.env.CLOUD_STACK = 'docker';
      process.env.CLOUD_APP = 'env-test-app';
      process.env.CLOUD_DOMAIN = 'prod.oneplatform.build';
      process.env.CLOUD_DATACENTER = 'Amazon';
    });

    after(function() {
      delete process.env.EC2_REGION;
      delete process.env.CLOUD_ENVIRONMENT;
      delete process.env.CLOUD_DEV_PHASE;
      delete process.env.CLOUD_STACK;
      delete process.env.CLOUD_DOMAIN;
      delete process.env.CLOUD_DATACENTER;

      process.env.CLOUD_APP = lastAppId;
    });

    it('should have correct overrides params', function() {
      var environment = require('./environment.js')();

      expect(environment.EC2_REGION).to.be.equal('us-east-1');
      expect(environment.CLOUD_ENVIRONMENT).to.be.equal('prod');
      expect(environment.CLOUD_DEV_PHASE).to.be.equal('stable');
      expect(environment.CLOUD_STACK).to.be.equal('docker');
      expect(environment.CLOUD_DOMAIN).to.be.equal('prod.oneplatform.build');
      expect(environment.CLOUD_APP).to.be.equal('env-test-app');
      expect(environment.CLOUD_DATACENTER).to.be.equal('Amazon');
    });
  });
});
