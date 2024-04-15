#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/.infra-stack';

const app = new cdk.App();
let HOSTED_ZONE_NAME = process.env.HOSTED_ZONE_NAME;
let HOSTED_ZONE_ID = process.env.HOSTED_ZONE_ID;
let STAGE = process.env.STAGE;
let CERT_ARN = process.env.CERT_ARN;
if (!HOSTED_ZONE_NAME) {
  throw Error('Failed to determine HOSTED_ZONE_NAME')
} else if (!STAGE) {
  throw Error('Failed to determine STAGE')
} else if(!CERT_ARN) {
  throw Error('Failed to determine CERT_ARN')
} else if(!HOSTED_ZONE_ID) {
  throw Error('Failed to determine HOSTED_ZONE_ID')
} else {
  new InfraStack(app, 'hero-of-the-day-frontend', {
    /* If you don't specify 'env', this stack will be environment-agnostic.
     * Account/Region-dependent features and context lookups will not work,
     * but a single synthesized template can be deployed anywhere. */
  
    /* Uncomment the next line to specialize this stack for the AWS Account
     * and Region that are implied by the current CLI configuration. */
    // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  
    /* Uncomment the next line if you know exactly what Account and Region you
     * want to deploy the stack to. */
    // env: { account: '123456789012', region: 'us-east-1' },
  
    /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
    HOSTED_ZONE_NAME,
    STAGE,
    CERT_ARN,
    HOSTED_ZONE_ID
  });
}