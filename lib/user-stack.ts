import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';

export class UserStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DeveloperGroup
    const devGroup = new iam.Group(this, 'Group-Developer', {
      groupName: 'Developer',
      managedPolicies: [
        iam.ManagedPolicy.fromManagedPolicyArn(this, 'PowerUserAccess', 'arn:aws:iam::aws:policy/PowerUserAccess'),
        iam.ManagedPolicy.fromManagedPolicyArn(this, 'IAMFullAccess', 'arn:aws:iam::aws:policy/IAMFullAccess')
      ]
    });

    
    
  }

  protected addUser(userName: string, group: iam.Group) {

    let initialPassword = '';
    while(!this.validPassword(initialPassword)) {
      initialPassword = '#'+(Math.random()*0xFFFFFF<<0).toString(16)+(Math.random()*0xFFFFFF<<0).toString(16).toUpperCase();
      console.log(initialPassword);
    }
    //const initialPassword = 'Password#3';
    const password = cdk.SecretValue.plainText(initialPassword);

    const user = new iam.User(this, `User-${userName}`, {
      userName: userName,
      password: password,
      passwordResetRequired: true,
      groups: [
        group
      ],
    });

    new cdk.CfnOutput(this, `Output-Username-${userName}`, {
      value: userName});

    new cdk.CfnOutput(this, `Output-Password-${userName}`, {
      value: password.toString()});

  }

  private validPassword(password: string) {
    // have at least one uppercase letter
    // have at least one number
    // have at least one symbol
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-“!@#%&\/,><\’:;|_~`])\S{8,99}$/.test(password)
  }

}
