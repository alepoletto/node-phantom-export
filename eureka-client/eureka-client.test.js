'use strict';

var chai = require('chai');
var expect = chai.expect;
var mockery = require('mockery');

describe('Eureka Client', function () {

  describe('operations', function () {
    var eurekaStub = {};
    var started = false;

    before(function() {
      mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true
      });

      eurekaStub.Eureka = function() {
        this.getInstancesByVipAddress = function(vip) {
          return [{
            status: 'UP',
            hostName: 'host-' + vip,
            securePort: {$: 443},
            port: {$: 80}
          }];
        };

        this.start = function(callback) {
          started = true;

          callback();
        };

        this.stop = function() {
          started = false;
        };
      };

      mockery.registerMock('eureka-js-client', eurekaStub);
    });

    after(function() {
      mockery.disable();
    });

    it('should have proper defaults', function() {
      var eureka = require('./eureka-client.js');
      var client = eureka();

      expect(client.getEurekaServers()[0]).to.be.equal('http://host-eureka.dev.oneplatform.build:80');
      expect(client.getEurekaServers(false)[0]).to.be.equal('http://host-eureka.dev.oneplatform.build:80');
      expect(client.getEurekaServers(true)[0]).to.be.equal('https://host-eureka.dev.oneplatform.build:443');

      expect(client.getServers('service')[0]).to.be.equal('http://host-service:80');
      expect(client.getServers('service', false)[0]).to.be.equal('http://host-service:80');
      expect(client.getServers('service', true)[0]).to.be.equal('https://host-service:443');

      client.startClient();
      expect(started).to.be.equal(true);

      client.startClient();
      expect(started).to.be.equal(true);
    });
  });

  describe('amazon info', function () {
    var eureka = require('./eureka-client.js');
    var client = eureka({CLOUD_DATACENTER: 'Amazon'});
    var config = client.getConfig();

    it('should have amazon servers info', function() {
      expect(config.instance.statusPageUrl).to.be.equal('http://__HOST__:8080/info');
      expect(config.instance.healthCheckUrl).to.be.equal('http://__HOST__:8077/healthcheck');
      expect(config.instance.homePageUrl).to.be.equal('http://__HOST__:8080/');
      expect(config.instance.dataCenterInfo.name).to.be.equal('Amazon');
    });
  });

  describe('default params', function () {
    var eureka = require('./eureka-client.js');
    var client = eureka({CLOUD_APP: 'test'});

    var config = client.getConfig();

    it('should produce correct resutls with default data', function() {
      expect(client.getServiceVip('test')).to.be.equal('test.1p.snapshot.dev');
      expect(client.getClient()).to.be.an('Object');
    });

    it('should have correct default params', function() {
      expect(config.eureka.preferSameZone).to.be.equal(false);
      expect(config.eureka.shouldUseDns).to.be.equal(false);
      expect(config.eureka.servicePath).to.be.equal('/v2/apps/');
      expect(config.eureka.region).to.be.equal('us-west-2');
      expect(config.eureka.serviceUrls.default[0]).to.be.equal('http://eureka.us-west-2.dev.oneplatform.build:8080/v2/apps/');
      expect(config.eureka.availabilityZones['us-west-2'][0]).to.be.equal('default');

      expect(config.instance.app).to.be.equal('test');
      expect(config.instance.port).to.be.equal(8080);
      expect(config.instance.vipAddress).to.be.equal('test.1p.snapshot.dev');
      expect(config.instance.hostName).to.be.equal('localhost');
      expect(config.instance.ipAddr).to.be.equal('127.0.0.1');
      expect(config.instance.dataCenterInfo.name).to.be.equal('MyOwn');
    });
  });
});