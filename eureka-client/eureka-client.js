'use strict';

/*jshint esversion: 6 */

module.exports = (params) => {
  params = params || {};

  var Eureka  = require('eureka-js-client').Eureka;
  var environment = require('../environment/environment.js')();
  var log = require('debug')('eureka-client');

  var envRegion = params.EC2_REGION || environment.EC2_REGION;
  var envDeployment = params.CLOUD_ENVIRONMENT || environment.CLOUD_ENVIRONMENT;
  var envSubDeployment = params.CLOUD_DEV_PHASE || environment.CLOUD_DEV_PHASE;
  var envStack = params.CLOUD_STACK || environment.CLOUD_STACK;
  var envDomain = params.CLOUD_DOMAIN || environment.CLOUD_DOMAIN;
  var envAppId = params.CLOUD_APP || environment.CLOUD_APP;
  var envDatacenter = params.CLOUD_DATACENTER || environment.CLOUD_DATACENTER;

  var availabilityZones = {};
  var servicePath = '/v2/apps/';
  var eurekaUrl = 'http://eureka.' + envRegion + '.' + envDomain + ':' + environment.SERVER_PORT + servicePath;
  var serviceVip = envAppId + '.' + envStack + '.' + envSubDeployment + '.' + envDeployment;
  var eurekaVip = 'eureka' + '.' + envDomain;
  var started = false;

  var instanceInfo = {
    app: envAppId,
    port: environment.SERVER_PORT,
    vipAddress: serviceVip,
    dataCenterInfo: { name: envDatacenter }
  };

  if (envDatacenter === 'Amazon') {
    instanceInfo.statusPageUrl = 'http://__HOST__:' + environment.SERVER_PORT + '/info';
    instanceInfo.healthCheckUrl = 'http://__HOST__:' + environment.ADMIN_PORT + '/healthcheck';
    instanceInfo.homePageUrl = 'http://__HOST__:' + environment.SERVER_PORT + '/';
  }
  else {
    instanceInfo.hostName = 'localhost';
    instanceInfo.ipAddr = '127.0.0.1';
  }

  availabilityZones[envRegion] = ['default'];


  var eurekaConfig = {
    eureka: {
      preferSameZone: false,
      shouldUseDns: false,
      servicePath: servicePath,
      region: envRegion,
      serviceUrls: {
        default: [eurekaUrl]
      },
      availabilityZones: availabilityZones
    },
    instance: instanceInfo
  };

  var client = new Eureka(eurekaConfig);

  function getServersByVip(vip, secure) {
    var instances = client.getInstancesByVipAddress(vip);
    var servers = [];

    if (instances && instances.length) {
      for (var i = 0; i < instances.length; i += 1) {
        if (instances[i].status === 'UP') {
          if (secure) {
            servers.push('https://' + instances[i].hostName + ':' + instances[i].securePort.$);
          }
          else {
            servers.push('http://' + instances[i].hostName + ':' + instances[i].port.$);
          }
        }
      }
    }

    return servers;
  }

  process.on('exit', () => {
    if (started) {
      client.stop((error) => {
        log(error || 'Eureka client stop complete');

        started = !!error;
      });
    }
  });

  return {
    getEurekaServers: (secured => getServersByVip(eurekaVip, secured)),


    getServers: ((vip, secured) => getServersByVip(vip, secured)),

    getConfig: (() => eurekaConfig),

    getClient: (() => this),

    getServiceVip: (app => app + '.' + envStack + '.' + envSubDeployment + '.' + envDeployment),

    startClient: (callback) => {
      callback = callback || (() => {});

      var vm = this;
      if (!started) {
        client.start((error) => {
          log(error || 'Eureka client start complete');

          started = !error;

          callback(vm);
        });
      }
      else {
        log('Eureka client already started');
        callback(vm);
      }
    }
  };

};