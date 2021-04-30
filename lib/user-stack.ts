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

    // force mfc policy
    const mfaPolicy = new iam.ManagedPolicy(this, 'Policy-MFAEnable', {
      statements: [
        new iam.PolicyStatement({
          sid: 'AllowChangePassword',
          effect: iam.Effect.ALLOW,
          actions: [ 'iam:ChangePassword' ],
          resources: [ 'arn:aws:iam::*:user/${aws:username}' ]
        }),
        new iam.PolicyStatement({
          sid: 'AllowGetAccountPasswordPolicy',
          effect: iam.Effect.ALLOW,
          actions: [ 'iam:GetAccountPasswordPolicy' ],
          resources: [ '*' ]
        }),
        new iam.PolicyStatement({
          sid: 'AllowViewAccountInfo',
          effect: iam.Effect.ALLOW,
          actions: [
            'iam:GetAccountPasswordPolicy',
            'iam:GetAccountSummary',
            'iam:ListVirtualMFADevices'
          ],
          resources: [ '*' ]
        }),
        new iam.PolicyStatement({
          sid: 'AllowManageOwnPasswords',
          effect: iam.Effect.ALLOW,
          actions: [ 'iam:ChangePassword', 'iam:GetUser' ],
          resources: [ 'arn:aws:iam::*:user/${aws:username}' ]
        }),
        new iam.PolicyStatement({
          sid: 'AllowManageOwnAccessKeys',
          effect: iam.Effect.ALLOW,
          actions: [
            'iam:CreateAccessKey',
            'iam:DeleteAccessKey',
            'iam:ListAccessKeys',
            'iam:UpdateAccessKey'
          ],
          resources: [ 'arn:aws:iam::*:user/${aws:username}' ]
        }),
        new iam.PolicyStatement({
          sid: 'AllowManageOwnSigningCertificates',
          effect: iam.Effect.ALLOW,
          actions: [
            'iam:DeleteSigningCertificate',
            'iam:ListSigningCertificates',
            'iam:UpdateSigningCertificate',
            'iam:UploadSigningCertificate'
          ],
          resources: [ 'arn:aws:iam::*:user/${aws:username}' ]
        }),
        new iam.PolicyStatement({
          sid: 'AllowManageOwnSSHPublicKeys',
          effect: iam.Effect.ALLOW,
          actions: [
            'iam:DeleteSSHPublicKey',
            'iam:GetSSHPublicKey',
            'iam:ListSSHPublicKeys',
            'iam:UpdateSSHPublicKey',
            'iam:UploadSSHPublicKey'
          ],
          resources: [ 'arn:aws:iam::*:user/${aws:username}' ]
        }),
        new iam.PolicyStatement({
          sid: 'AllowManageOwnGitCredentials',
          effect: iam.Effect.ALLOW,
          actions: [
            'iam:CreateServiceSpecificCredential',
            'iam:DeleteServiceSpecificCredential',
            'iam:ListServiceSpecificCredentials',
            'iam:ResetServiceSpecificCredential',
            'iam:UpdateServiceSpecificCredential'
          ],
          resources: [ 'arn:aws:iam::*:user/${aws:username}' ]
        }),
        new iam.PolicyStatement({
          sid: 'AllowManageOwnVirtualMFADevice',
          effect: iam.Effect.ALLOW,
          actions: [ 'iam:CreateVirtualMFADevice', 'iam:DeleteVirtualMFADevice' ],
          resources: [ 'arn:aws:iam::*:mfa/${aws:username}' ]
        }),
        new iam.PolicyStatement({
          sid: 'AllowManageOwnUserMFA',
          effect: iam.Effect.ALLOW,
          actions: [
            'iam:DeactivateMFADevice',
            'iam:EnableMFADevice',
            'iam:ListMFADevices',
            'iam:ResyncMFADevice'
          ],
          resources: [ 'arn:aws:iam::*:user/${aws:username}' ]
        }),
        new iam.PolicyStatement({
          sid: 'DenyAllExceptListedIfNoMFA',
          effect: iam.Effect.DENY,
          notActions: [
            'iam:CreateVirtualMFADevice',
            'iam:DeleteVirtualMFADevice',
            'iam:EnableMFADevice',
            'iam:GetUser',
            'iam:ListMFADevices',
            'iam:ListVirtualMFADevices',
            'iam:ResyncMFADevice',
            'iam:ChangePassword',
            'iam:GetAccountPasswordPolicy',
            'sts:GetSessionToken'
          ],
          resources: [ '*' ],
          conditions: {
            'BoolIfExists': {
              'aws:MultiFactorAuthPresent': 'false'
            }
          }
        })
      ]
    });
    mfaPolicy.attachToGroup(devGroup);

    this.addUser(devGroup, 'jakemraz', '#Asdf12345');    
    
  }

  protected addUser(group: iam.Group, userName: string, initialPassword: string) {

    if(!this.validPassword(initialPassword)) 
      throw new Error('password should have at least one uppercase letter, at least one number and at least one symbol');
    const password = cdk.SecretValue.plainText(initialPassword);

    const user = new iam.User(this, `User-${userName}`, {
      userName: userName,
      password: password,
      passwordResetRequired: true,
      groups: [
        group
      ],
    });

    new cdk.CfnOutput(this, `${userName}-Password`, {
      value: password.toString()});

  }

  private validPassword(password: string) {
    // have at least one uppercase letter
    // have at least one number
    // have at least one symbol
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-“!@#%&\/,><\’:;|_~`])\S{8,99}$/.test(password)
  }

}
