#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import * as dotenv from "dotenv";
import { SharedInfraStack } from "../lib/shared-infra-stack";
import { FoundationsInfraStack } from "../lib/foundations-infra-stack";
import { PetsInfraStack } from "../lib/pets-infra-stack";
import { UsersInfraStack } from "../lib/users-infra-stack";

dotenv.config();

const app = new cdk.App();
const resourcePrefix = process.env.CDK_RESOURCE_PREFIX ?? "api-alegra";
const environmentName = process.env.CDK_DEFAULT_ENVIRONMENT ?? "test";
const SNSEmailSubscription = process.env.SNS_EMAIL_SUBSCRIPTION;
const commonProps = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  resourcePrefix: resourcePrefix,
  environmentName,
};

new SharedInfraStack(app, `${resourcePrefix}-infra-shared-${environmentName}`, {
  ...commonProps,
  description: "Shared infrastructure for Alegra Pets API",
});

new FoundationsInfraStack(
  app,
  `${resourcePrefix}-infra-foundations-${environmentName}`,
  {
    ...commonProps,
    description: "Foundations Infrastructure for Alegra Pets API",
  }
);

new PetsInfraStack(app, `${resourcePrefix}-infra-pets-${environmentName}`, {
  ...commonProps,
  description: "Pets Infrastructure for Alegra Pets API",
  SNSEmailSubscription,
});

new UsersInfraStack(app, `${resourcePrefix}-infra-users-${environmentName}`, {
  ...commonProps,
  description: "Users Infrastructure for Alegra Pets API",
});
