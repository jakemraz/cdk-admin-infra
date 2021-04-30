# CDK Admin Infra
## Overview
Admin Infra Management Framework powered by CDK
it supports user management(UserStack), default config management(DefaultConfigStack), etc

## Stacks
### DefaultConfigStack
This stack manages default configuration of the account.
- `enableEbsEncryptionByDefault` enable EBS encryption by default
- `tbd`

### UserStack
This stack manages IAM users. You can add user with `addUser` method.
```typescript
this.addUser('userid', '#Asdf12345', this.groupDeveloper, anothergroup, ...);
```

## How to deploy
* `cdk deploy`      deploy this stack to your default AWS account/region

