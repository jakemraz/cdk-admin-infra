import * as cdk from '@aws-cdk/core';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '@aws-cdk/custom-resources';


export class DefaultConfigStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    this.enableEbsEncryptionByDefault();
  }

  

  private enableEbsEncryptionByDefault() {

    const enableEbsEncryptionAction = {
      service: 'EC2',
      action: 'enableEbsEncryptionByDefault',
      physicalResourceId: PhysicalResourceId.of('EnableEbsEncryptionByDefault')
    }

    const disableEbsEncryptionAction = {
      service: 'EC2',
      action: 'disableEbsEncryptionByDefault',
      physicalResourceId: PhysicalResourceId.of('DisableEbsEncryptionByDefault')
    }

    new AwsCustomResource(this, 'EnableEbsEncryptionByDefault', {
      onCreate: enableEbsEncryptionAction,
      onUpdate: enableEbsEncryptionAction,
      onDelete: disableEbsEncryptionAction,
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE
      })
    });
  }

}
