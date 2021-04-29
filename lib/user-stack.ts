import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';

export class UserStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DeveloperGroup
    const devGroup = new iam.Group(this, 'Developer', {
      groupName: 'Developer',
    });

    // CdkPolicy
    const developerPolicy = new iam.ManagedPolicy(this, 'DeveloperPolicy', {
      managedPolicyName: 'DeveloperPolicy',
      statements: [
        new iam.PolicyStatement({
          actions: [
            'cloudformation:*'
          ],
          resources: [
            '*'
          ]
        }),
        new iam.PolicyStatement({
          actions: [
            's3:*'
          ],
          resources: [
            'arn:aws:s3:::cdktoolkit-stagingbucket-*'
          ]
        }),
        new iam.PolicyStatement({
          actions: [
            '*'
          ],
          resources: [
            '*'
          ],
          conditions: {
              'ForAnyValue:StringEquals': {
                'aws:CalledVia': [
                  "cloudformation.amazonaws.com"
                ]
              }
            }
        }),
      ]
    });
    developerPolicy.attachToGroup(devGroup)

    // User

    
  }
}
