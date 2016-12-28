'use strict';

/*jshint esversion: 6 */

module.exports = () => {
  var envRegion = process.env.EC2_REGION || 'us-west-2';
  var envDeployment = process.env.CLOUD_ENVIRONMENT || 'dev';
  var envSubDeployment = process.env.CLOUD_DEV_PHASE || 'snapshot';
  var envStack = process.env.CLOUD_STACK || '1p';
  var envDomain = process.env.CLOUD_DOMAIN || 'dev.oneplatform.build';
  var envAppId = process.env.CLOUD_APP;
  var envDatacenter = process.env.CLOUD_DATACENTER || 'MyOwn';

  return Object.freeze({
    EC2_REGION: envRegion,
    CLOUD_ENVIRONMENT: envDeployment,
    CLOUD_DEV_PHASE: envSubDeployment,
    CLOUD_STACK: envStack,
    CLOUD_DOMAIN: envDomain,
    CLOUD_APP: envAppId,
    CLOUD_DATACENTER: envDatacenter,
    SERVER_PORT: 8080,
    ADMIN_PORT: 8077,
    SWAGGER_LOCATION: 'resources'
  });
};