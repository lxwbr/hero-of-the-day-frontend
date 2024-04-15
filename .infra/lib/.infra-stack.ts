import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as iam from 'aws-cdk-lib/aws-iam';

interface InfraProps extends cdk.StackProps {
  HOSTED_ZONE_NAME: string;
  STAGE: string;
  CERT_ARN: string;
  HOSTED_ZONE_ID: string;
}

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: InfraProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'HeroOfTheDayStaticPageBucket', {
      bucketName: `hero-of-the-day-frontend-${props.STAGE}`,
      accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: true
    });

    const originAccessIdentity = new cloudfront.CfnCloudFrontOriginAccessIdentity(this, 'HeroOfTheDayCloudFrontOriginAccessIdentity', {
      cloudFrontOriginAccessIdentityConfig: {
        comment: bucket.bucketDomainName
      }
    })

    const distribution = new cloudfront.CfnDistribution(this, 'HeroOfTheDayCloudFrontDistribution', {
      distributionConfig: {
        aliases: [props.HOSTED_ZONE_NAME],
        origins: [
          {
            domainName: bucket.bucketDomainName,
            id: 's3origin',
            s3OriginConfig: {
              originAccessIdentity: 'origin-access-identity/cloudfront/' + originAccessIdentity.ref
            }
          }
        ],
        enabled: true,
        defaultRootObject: 'index.html',
        ipv6Enabled: true,
        defaultCacheBehavior: {
          allowedMethods: ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
          targetOriginId: 's3origin',
          forwardedValues: {
            queryString: false,
            cookies: {
              forward: 'none'
            }
          },
          viewerProtocolPolicy: 'https-only'
        },
        priceClass: 'PriceClass_100',
        httpVersion: 'http2',
        viewerCertificate: {
          minimumProtocolVersion: 'TLSv1.2_2018',
          acmCertificateArn: props.CERT_ARN,
          sslSupportMethod: 'sni-only'
        }
      }
    });

    new route53.CfnRecordSetGroup(this, 'HeroOfTheDayAliasRecord', {
      hostedZoneName: props.HOSTED_ZONE_NAME + '.',
      recordSets: [
        {
          name: props.HOSTED_ZONE_NAME + '.',
          type: 'A',
          aliasTarget: {
            dnsName: distribution.attrDomainName,
            hostedZoneId: props.HOSTED_ZONE_ID
          }
        },
        {
          name: props.HOSTED_ZONE_NAME + '.',
          type: 'AAAA',
          aliasTarget: {
            dnsName: distribution.attrDomainName,
            hostedZoneId: props.HOSTED_ZONE_ID
          }
        }
      ]
    
    })

    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
        resources: [bucket.arnForObjects('*'), bucket.bucketArn],
        principals: [new iam.CanonicalUserPrincipal(originAccessIdentity.attrS3CanonicalUserId)]
      })
    );
  }
}
