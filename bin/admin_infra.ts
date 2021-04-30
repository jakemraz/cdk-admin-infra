#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { DefaultConfigStack } from '../lib/default-config-stack';
import { UserStack } from '../lib/user-stack';

const app = new cdk.App();
new DefaultConfigStack(app, 'DefaultConfigStack');
new UserStack(app, 'UserStack');