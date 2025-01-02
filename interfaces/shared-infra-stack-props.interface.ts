import { StackProps } from "aws-cdk-lib";

export interface SharedInfraStackProps extends StackProps {
  resourcePrefix: string;
  environmentName: string;
  SNSEmailSubscription?: string;
}
